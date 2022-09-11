import * as dom from './dom';

/**
 * Helper for working with caret
 */
export default class Caret {
  /**
   * Store internal properties
   */
  constructor() {
    /**
     * The <span> for caret saving/restoring
     */
    this.savedFakeCaret = undefined;
  }

  /**
   * Saves caret position using hidden <span>
   *
   * @returns {void}
   */
  save() {
    const range = Caret.range;
    const cursor = dom.make('span');

    cursor.hidden = true;

    range.insertNode(cursor);

    this.savedFakeCaret = cursor;
  }

  /**
   * Restores the caret position saved by the save() method
   *
   * @returns {void}
   */
  restore() {
    if (!this.savedFakeCaret) {
      return;
    }

    const sel = window.getSelection();
    const range = new Range();

    range.setStartAfter(this.savedFakeCaret);
    range.setEndAfter(this.savedFakeCaret);

    sel.removeAllRanges();
    sel.addRange(range);

    /**
     * A little timeout uses to allow browser to set caret after element before we remove it.
     */
    setTimeout(() => {
      this.savedFakeCaret.remove();
    }, 150);
  }

  /**
   * Returns the first range
   *
   * @returns {Range|null}
   */
  static get range() {
    const selection = window.getSelection();

    return selection && selection.rangeCount ? selection.getRangeAt(0) : null;
  }

  /**
   * Extract content fragment from Caret position to the end of contenteditable element
   *
   * @returns {DocumentFragment|void}
   */
  static extractFragmentFromCaretPositionTillTheEnd() {
    const selection = window.getSelection();

    if (!selection.rangeCount) {
      return;
    }

    const selectRange = selection.getRangeAt(0);
    let startNode = selectRange.startContainer;

    /**
     * selectRange.startContainer can point to the Text node which has no .closest() method
     */
    if (startNode.nodeType !== Node.ELEMENT_NODE) {
      startNode = startNode.parentNode;
    }

    const currentBlockInput = startNode.closest('[contenteditable]');

    selectRange.deleteContents();

    const range = selectRange.cloneRange();

    range.selectNodeContents(currentBlockInput);
    range.setStart(selectRange.endContainer, selectRange.endOffset);

    return range.extractContents();
  }

  /**
   * Set focus to contenteditable or native input element
   *
   * @param {HTMLElement} element - element where to set focus
   * @param {boolean} atStart - where to set focus: at the start or at the end
   *
   * @returns {void}
   */
  static focus(element, atStart = true) {
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(element);
    range.collapse(atStart);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  /**
   * Check if the caret placed at the start of the contenteditable element
   *
   * @returns {void}
   */
  static isAtStart() {
    const selection = window.getSelection();

    if (selection.focusOffset > 0) {
      return false;
    }

    const focusNode = selection.focusNode;

    /**
     * In case of
     * <div contenteditable>
     *     <p><b></b></p>   <-- first (and deepest) node is <b></b>
     *     |adaddad         <-- focus node
     * </div>
     */
    const leftSiblings = Caret.getHigherLevelSiblings(focusNode, 'left');

    const nothingAtLeft = leftSiblings.every((node) => {
      return dom.isEmpty(node);
    });

    return nothingAtLeft;
  }

  /**
   * Get all first-level (first child of [contenteditabel]) siblings from passed node
   * Then you can check it for emptiness
   *
   * @example
   * <div contenteditable>
   * <p></p>                            |
   * <p></p>                            | left first-level siblings
   * <p></p>                            |
   * <blockquote><a><b>adaddad</b><a><blockquote>       <-- passed node for example <b>
   * <p></p>                            |
   * <p></p>                            | right first-level siblings
   * <p></p>                            |
   * </div>
   *
   * @param {HTMLElement} from - element from which siblings should be searched
   * @param {'left' | 'right'} direction - direction of search
   *
   * @returns {HTMLElement[]}
   */
  static getHigherLevelSiblings(from, direction = 'left') {
    let current = from;
    const siblings = [];

    /**
     * Find passed node's firs-level parent (in example - blockquote)
     */
    while (current.parentNode && (current.parentNode).contentEditable !== 'true') {
      current = current.parentNode;
    }

    const sibling = direction === 'left' ? 'previousSibling' : 'nextSibling';

    /**
     * Find all left/right siblings
     */
    while (current[sibling]) {
      current = current[sibling];
      siblings.push(current);
    }

    return siblings;
  }
}

import toolboxIcon from './img/toolboxIcon.svg';
import Popover from './utils/popover';
import * as $ from './utils/dom';

/**
 * Toolbox is a menu for manipulation of rows/cols
 *
 * It contains toggler and Popover:
 *   <toolbox>
 *     <toolbox-toggler />
 *     <popover />
 *   <toolbox>
 */
export default class Toolbox {
  /**
   * Creates toolbox buttons and toolbox menus
   *
   * @param {object} api - Editor.js api
   * @param {PopoverItem[]} items - Editor.js api
   * @param {function} onOpen - callback fired when the Popover is opening
   * @param {function} onClose - callback fired when the Popover is closing
   * @param {string} [cssModifier] - the modifier for the Toolbox. Allows to add some specific styles.
   */
  constructor({api, items, onOpen, onClose, cssModifier = ''}) {
    this.api = api;

    this.items = items;
    this.onOpen = onOpen;
    this.onClose = onClose;
    this.cssModifier = cssModifier;

    this.popover = null;
    this.wrapper = this.createToolbox();
  }

  /**
   * Style classes
   */
  static get CSS() {
    return {
      toolbox: 'tc-toolbox',
      toolboxShowed: 'tc-toolbox--showed',
      toggler: 'tc-toolbox__toggler'
    };
  }

  /**
   * Returns rendered Toolbox element
   */
  get element() {
    return this.wrapper;
  }

  /**
   * Creating a toolbox to open menu for a manipulating columns
   *
   * @returns {Element}
   */
  createToolbox() {
    const wrapper = $.make('div', [
      Toolbox.CSS.toolbox,
      (this.cssModifier ? `${Toolbox.CSS.toolbox}--${this.cssModifier}` : '')
    ]);
    const popover = this.createPopover();
    const toggler = this.createToggler();

    wrapper.appendChild(toggler);
    wrapper.appendChild(popover);

    return wrapper;
  }

  /**
   * Creates the Toggler
   *
   * @returns {Element}
   */
  createToggler() {
    const toggler = $.make('div', Toolbox.CSS.toggler, {
      innerHTML: toolboxIcon
    });

    toggler.addEventListener('click', () => {
      this.togglerClicked();
    });

    return toggler;
  }

  /**
   * Creates the Popover instance and render it
   *
   * @returns {Element}
   */
  createPopover() {
    this.popover = new Popover({
      items: this.items
    });

    return this.popover.render();
  }

  /**
   * Toggler click handler. Opens/Closes the popover
   *
   * @returns {void}
   */
  togglerClicked() {
    if (this.popover.opened) {
      this.popover.close();
      this.onClose();
    } else {
      this.popover.open();
      this.onOpen();
    }
  }

  /**
   * Shows the Toolbox
   *
   * @param {function} computePositionMethod - method that returns the position coordinate
   * @returns {void}
   */
  show(computePositionMethod) {
    const position = computePositionMethod();

    /**
     * Set 'top' or 'left' style
     */
    Object.entries(position).forEach(([prop, value]) => {
      this.wrapper.style[prop] = value;
    });

    this.wrapper.classList.add(Toolbox.CSS.toolboxShowed);
  }

  /**
   * Hides the Toolbox
   *
   * @returns {void}
   */
  hide() {
    this.popover.close();
    this.wrapper.classList.remove(Toolbox.CSS.toolboxShowed);
  }
}

import * as Dom from './utils/dom';
import Caret from './utils/caret';

/**
 * Build styles
 */
import './../styles/index.pcss';

/**
 * @typedef {object} ListData
 * @property {string} style - list type 'ordered' or 'unordered'
 * @property {ListItem[]} items - list of first-level elements
 */

/**
 * @typedef {object} ListItem
 * @property {string} content - list item text content
 * @property {ListItem[]} items - sublist items
 */

/**
 * NestedList Tool for EditorJS
 */
export default class NestedList {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Allow to use native Enter behaviour
   *
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"> <path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',
      title: 'List',
    };
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} params - tool constructor options
   * @param {ListData} params.data - previously saved data
   * @param {object} params.config - user config for Tool
   * @param {object} params.api - Editor.js API
   * @param {boolean} params.readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    /**
     * HTML nodes used in tool
     */
    this.nodes = {
      wrapper: null,
    };

    this.api = api;
    this.readOnly = readOnly;
    this.config = config;

    this.settings = [
      {
        name: 'unordered',
        title: this.api.i18n.t('Unordered'),
        icon: '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"> <path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',
        default: false,
      },
      {
        name: 'ordered',
        title: this.api.i18n.t('Ordered'),
        icon: '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"><path d="M5.819 4.607h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 1 1 0-2.138zm0-4.607h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 1 1 0-2.138zm0 9.357h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 0 1 0-2.137zM1.468 4.155V1.33c-.554.404-.926.606-1.118.606a.338.338 0 0 1-.244-.104A.327.327 0 0 1 0 1.59c0-.107.035-.184.105-.234.07-.05.192-.114.369-.192.264-.118.475-.243.633-.373.158-.13.298-.276.42-.438a3.94 3.94 0 0 1 .238-.298C1.802.019 1.872 0 1.975 0c.115 0 .208.042.277.127.07.085.105.202.105.351v3.556c0 .416-.15.624-.448.624a.421.421 0 0 1-.32-.127c-.08-.085-.121-.21-.121-.376zm-.283 6.664h1.572c.156 0 .275.03.358.091a.294.294 0 0 1 .123.25.323.323 0 0 1-.098.238c-.065.065-.164.097-.296.097H.629a.494.494 0 0 1-.353-.119.372.372 0 0 1-.126-.28c0-.068.027-.16.081-.273a.977.977 0 0 1 .178-.268c.267-.264.507-.49.722-.678.215-.188.368-.312.46-.371.165-.11.302-.222.412-.334.109-.112.192-.226.25-.344a.786.786 0 0 0 .085-.345.6.6 0 0 0-.341-.553.75.75 0 0 0-.345-.08c-.263 0-.47.11-.62.329-.02.029-.054.107-.101.235a.966.966 0 0 1-.16.295c-.059.069-.145.103-.26.103a.348.348 0 0 1-.25-.094.34.34 0 0 1-.099-.258c0-.132.031-.27.093-.413.063-.143.155-.273.279-.39.123-.116.28-.21.47-.282.189-.072.411-.107.666-.107.307 0 .569.045.786.137a1.182 1.182 0 0 1 .618.623 1.18 1.18 0 0 1-.096 1.083 2.03 2.03 0 0 1-.378.457c-.128.11-.344.282-.646.517-.302.235-.509.417-.621.547a1.637 1.637 0 0 0-.148.187z"/></svg>',
        default: true,
      },
    ];

    /**
     * This list-style will be used by default
     */
    this.defaultListStyle = 'ordered';

    const initialData = {
      style: this.defaultListStyle,
      items: [],
    };

    this.data = data && Object.keys(data).length ? data : initialData;

    /**
     * Instantiate caret helper
     */
    this.caret = new Caret();
  }

  /**
   * Returns list tag with items
   *
   * @returns {Element}
   * @public
   */
  render() {
    this.nodes.wrapper = this.makeListWrapper(this.data.style, [ this.CSS.baseBlock ]);

    // fill with data
    if (this.data.items.length) {
      this.appendItems(this.data.items, this.nodes.wrapper);
    } else {
      this.appendItems([ {
        content: '',
        items: [],
      } ], this.nodes.wrapper);
    }

    if (!this.readOnly) {
      // detect keydown on the last item to escape List
      this.nodes.wrapper.addEventListener('keydown', (event) => {
        switch (event.key) {
          case 'Enter':
            this.enterPressed(event);
            break;
          case 'Backspace':
            this.backspace(event);
            break;
          case 'Tab':
            if (event.shiftKey) {
              this.shiftTab(event);
            } else {
              this.addTab(event);
            }
            break;
        }
      }, false);
    }

    return this.nodes.wrapper;
  }

  /**
   * Creates Block Tune allowing to change the list style
   *
   * @public
   * @returns {Element}
   */
  renderSettings() {
    const wrapper = Dom.make('div', [ this.CSS.settingsWrapper ], {});

    this.settings.forEach((item) => {
      const itemEl = Dom.make('div', this.CSS.settingsButton, {
        innerHTML: item.icon,
      });

      itemEl.addEventListener('click', () => {
        this.listStyle = item.name;

        /**
         * Clear other buttons
         */
        const buttons = itemEl.parentNode.querySelectorAll('.' + this.CSS.settingsButton);

        Array.from(buttons).forEach((button) =>
          button.classList.remove(this.CSS.settingsButtonActive)
        );

        /**
         * Mark active button
         */
        itemEl.classList.toggle(this.CSS.settingsButtonActive);
      });

      this.api.tooltip.onHover(itemEl, item.title, {
        placement: 'top',
        hidingDelay: 500,
      });

      if (this.data.style === item.name) {
        itemEl.classList.add(this.CSS.settingsButtonActive);
      }

      wrapper.appendChild(itemEl);
    });

    return wrapper;
  }

  /**
   * Renders children list
   *
   * @param {ListItem[]} items - items data to append
   * @param {Element} parentItem - where to append
   * @returns {void}
   */
  appendItems(items, parentItem) {
    items.forEach((item) => {
      const itemEl = this.createItem(item.content, item.items);

      parentItem.appendChild(itemEl);
    });
  };

  /**
   * Renders the single item
   *
   * @param {string} content - item content to render
   * @param {ListItem[]} [items] - children
   * @returns {Element}
   */
  createItem(content, items = []) {
    const itemWrapper = Dom.make('li', this.CSS.item);
    const itemBody = Dom.make('div', this.CSS.itemBody);
    const itemContent = Dom.make('div', this.CSS.itemContent, {
      innerHTML: content,
      contentEditable: !this.readOnly,
    });

    itemBody.appendChild(itemContent);
    itemWrapper.appendChild(itemBody);

    /**
     * Append children if we have some
     */
    if (items && items.length > 0) {
      this.addChildrenList(itemWrapper, items);
    }

    return itemWrapper;
  }

  /**
   * Extracts tool's data from the DOM
   *
   * @returns {ListData}
   */
  save() {
    /**
     * The method for recursive collecting of the child items
     *
     * @param {Element} parent - where to find items
     * @returns {ListItem[]}
     */
    const getItems = (parent) => {
      const children = Array.from(parent.querySelectorAll(`:scope > .${this.CSS.item}`));

      return children.map(el => {
        const subItemsWrapper = el.querySelector(`.${this.CSS.itemChildren}`);
        const content = this.getItemContent(el);
        const subItems = subItemsWrapper ? getItems(subItemsWrapper) : [];

        return {
          content,
          items: subItems,
        };
      });
    };

    return {
      style: this.data.style,
      items: getItems(this.nodes.wrapper),
    };
  }

  /**
   * Append children list to passed item
   *
   * @param {Element} parentItem - item that should contain passed sub-items
   * @param {ListItem[]} items - sub items to append
   */
  addChildrenList(parentItem, items) {
    const itemBody = parentItem.querySelector(`.${this.CSS.itemBody}`);
    const sublistWrapper = this.makeListWrapper(undefined, [ this.CSS.itemChildren ]);

    this.appendItems(items, sublistWrapper);

    itemBody.appendChild(sublistWrapper);
  }

  /**
   * Creates main <ul> or <ol> tag depended on style
   *
   * @param {string} [style] - 'ordered' or 'unordered'
   * @param {string[]} [classes] - additional classes to append
   * @returns {HTMLOListElement|HTMLUListElement}
   */
  makeListWrapper(style = this.listStyle, classes = []) {
    const tag = style === 'ordered' ? 'ol' : 'ul';
    const styleClass = style === 'ordered' ? this.CSS.wrapperOrdered : this.CSS.wrapperUnordered;

    classes.push(styleClass);

    return Dom.make(tag, [this.CSS.wrapper, ...classes]);
  }

  /**
   * Styles
   *
   * @returns {object} - CSS classes names by keys
   *
   * @private
   */
  get CSS() {
    return {
      baseBlock: this.api.styles.block,
      wrapper: 'cdx-nested-list',
      wrapperOrdered: 'cdx-nested-list--ordered',
      wrapperUnordered: 'cdx-nested-list--unordered',
      item: 'cdx-nested-list__item',
      itemBody: 'cdx-nested-list__item-body',
      itemContent: 'cdx-nested-list__item-content',
      itemChildren: 'cdx-nested-list__item-children',
      settingsWrapper: 'cdx-nested-list__settings',
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
    };
  }

  /**
   * Get list style name
   *
   * @returns {string}
   */
  get listStyle() {
    return this.data.style || this.defaultListStyle;
  }

  /**
   * Set list style
   *
   * @param {string} style - new style to set
   */
  set listStyle(style) {
    /**
     * Get lists elements
     *
     * @type {any[]}
     */
    const lists = Array.from(this.nodes.wrapper.querySelectorAll(`.${this.CSS.wrapper}`));

    /**
     * Add main wrapper to the list
     */
    lists.push(this.nodes.wrapper);

    /**
     * For each list we need to update classes
     */
    lists.forEach(list => {
      list.classList.toggle(this.CSS.wrapperUnordered, style === 'unordered');
      list.classList.toggle(this.CSS.wrapperOrdered, style === 'ordered');
    });

    /**
     * Update the style in data
     *
     * @type {string}
     */
    this.data.style = style;
  }

  /**
   * Returns current List item by the caret position
   *
   * @returns {Element}
   */
  get currentItem() {
    let currentNode = window.getSelection().anchorNode;

    if (currentNode.nodeType !== Node.ELEMENT_NODE) {
      currentNode = currentNode.parentNode;
    }

    return currentNode.closest(`.${this.CSS.item}`);
  }

  /**
   * Handles Enter keypress
   *
   * @param {KeyboardEvent} event - keydown
   * @returns {void}
   */
  enterPressed(event) {
    const currentItem = this.currentItem;

    /**
     * Prevent editor.js behaviour
     */
    event.stopPropagation();

    /**
     * Prevent browser behaviour
     */
    event.preventDefault();

    /**
     * On Enter in the last empty item, get out of list
     */
    const isEmpty = this.getItemContent(currentItem).trim().length === 0;
    const isFirstLevelItem = currentItem.parentNode === this.nodes.wrapper;
    const isLastItem = currentItem.nextElementSibling === null;

    if (isFirstLevelItem && isLastItem && isEmpty) {
      this.getOutOfList();

      return;
    } else if (isLastItem && isEmpty) {
      this.unshiftItem();

      return;
    }

    /**
     * On other Enters, get content from caret till the end of the block
     * And move it to the new item
     */
    const endingFragment = Caret.extractFragmentFromCaretPositionTillTheEnd();
    const endingHTML = Dom.fragmentToString(endingFragment);
    const itemChildren = currentItem.querySelector(`.${this.CSS.itemChildren}`);

    /**
     * Create the new list item
     */
    const itemEl = this.createItem(endingHTML, undefined);

    /**
     * Check if child items exist
     *
     * @type {boolean}
     */
    const childrenExist = itemChildren && Array.from(itemChildren.querySelectorAll(`.${this.CSS.item}`)).length > 0;

    /**
     * If item has children, prepend to them
     * Otherwise, insert the new item after current
     */
    if (childrenExist) {
      itemChildren.prepend(itemEl);
    } else {
      currentItem.after(itemEl);
    }

    this.focusItem(itemEl);
  }

  /**
   * Decrease indentation of the current item
   *
   * @returns {void}
   */
  unshiftItem() {
    const currentItem = this.currentItem;
    const parentItem = currentItem.parentNode.closest(`.${this.CSS.item}`);

    /**
     * If item in the first-level list then no need to do anything
     */
    if (!parentItem) {
      return;
    }

    this.caret.save();

    parentItem.after(currentItem);

    this.caret.restore();

    /**
     * If previous parent's children list is now empty, remove it.
     */
    const prevParentChildrenList = parentItem.querySelector(`.${this.CSS.itemChildren}`);
    const isPrevParentChildrenEmpty = prevParentChildrenList.children.length === 0;

    if (isPrevParentChildrenEmpty) {
      prevParentChildrenList.remove();
    }
  }

  /**
   * Return the item content
   *
   * @param {Element} item - item wrapper (<li>)
   * @returns {string}
   */
  getItemContent(item) {
    const contentNode = item.querySelector(`.${this.CSS.itemContent}`);

    if (Dom.isEmpty(contentNode)) {
      return '';
    }

    return contentNode.innerHTML;
  }

  /**
   * Sets focus to the item's content
   *
   * @param {Element} item - item (<li>) to select
   * @param {boolean} atStart - where to set focus: at the start or at the end
   * @returns {void}
   */
  focusItem(item, atStart = true) {
    const itemContent = item.querySelector(`.${this.CSS.itemContent}`);

    Caret.focus(itemContent, atStart);
  }

  /**
   * Get out from List Tool by Enter on the empty last item
   *
   * @returns {void}
   */
  getOutOfList() {
    this.currentItem.remove();

    this.api.blocks.insert();
    this.api.caret.setToBlock(this.api.blocks.getCurrentBlockIndex());
  }

  /**
   * Handle backspace
   *
   * @param {KeyboardEvent} event - keydown
   */
  backspace(event) {
    /**
     * Caret is not at start of the item
     * Then backspace button should remove letter as usual
     */
    if (!Caret.isAtStart()) {
      return;
    }

    /**
     * Prevent default backspace behaviour
     */
    event.preventDefault();

    const currentItem = this.currentItem;
    const previousItem = currentItem.previousSibling;
    const parentItem = currentItem.parentNode.closest(`.${this.CSS.item}`);

    /**
     * Do nothing with the first item in the first-level list.
     * No previous sibling means that this is the first item in the list.
     * No parent item means that this is a first-level list.
     *
     * Before:
     * 1. |Hello
     * 2. World!
     *
     * After:
     * 1. |Hello
     * 2. World!
     *
     * If it this item and the while list is empty then editor.js should
     * process this behaviour and remove the block completely
     *
     * Before:
     * 1. |
     *
     * After: block has been removed
     *
     */
    if (!previousItem && !parentItem) {
      return;
    }

    /**
     * Prevent editor.js behaviour
     */
    event.stopPropagation();

    /**
     * Lets compute the item which will be merged with current item text
     */
    let targetItem;

    /**
     * If there is a previous item then we get a deepest item in its sublists
     *
     * Otherwise we will use the parent item
     */
    if (previousItem) {
      const childrenOfPreviousItem = previousItem.querySelectorAll(`.${this.CSS.item}`);

      targetItem = Array.from(childrenOfPreviousItem).pop() || previousItem;
    } else {
      targetItem = parentItem;
    }

    /**
     * Get content from caret till the end of the block to move it to the new item
     */
    const endingFragment = Caret.extractFragmentFromCaretPositionTillTheEnd();
    const endingHTML = Dom.fragmentToString(endingFragment);

    /**
     * Get the target item content element
     */
    const targetItemContent = targetItem.querySelector(`.${this.CSS.itemContent}`);

    /**
     * Set a new place for caret
     */
    Caret.focus(targetItemContent, false);

    /**
     * Save the caret position
     */
    this.caret.save();

    /**
     * Update target item content by merging with current item html content
     */
    targetItemContent.insertAdjacentHTML('beforeend', endingHTML);

    /**
     * Get the sublist first-level items for current item
     */
    let currentItemSublistItems = currentItem.querySelectorAll(`.${this.CSS.itemChildren} > .${this.CSS.item}`);

    /**
     * Create an array from current item sublist items
     */
    currentItemSublistItems = Array.from(currentItemSublistItems);

    /**
     * Filter items for sublist first-level
     * No need to move deeper items
     */
    currentItemSublistItems = currentItemSublistItems.filter(node => node.parentNode.closest(`.${this.CSS.item}`) === currentItem);

    /**
     * Reverse the array to insert items
     */
    currentItemSublistItems.reverse().forEach(item => {
      /**
       * Check if we need to save the indent for current item children
       *
       * If this is the first item in the list then place its children to the same level as currentItem.
       * Same as shift+tab for all of these children.
       *
       * If there is a previous sibling then place children right after target item
       */
      if (!previousItem) {
        /**
         * The first item in the list
         *
         * Before:
         * 1. Hello
         *   1.1. |My
         *     1.1.1. Wonderful
         *     1.1.2. World
         *
         * After:
         * 1. Hello|My
         *   1.1. Wonderful
         *   1.2. World
         */
        currentItem.after(item);
      } else {
        /**
         * Not the first item
         *
         * Before:
         * 1. Hello
         *   1.1. My
         *   1.2. |Dear
         *     1.2.1. Wonderful
         *     1.2.2. World
         *
         * After:
         * 1. Hello
         *   1.1. My|Dear
         *   1.2. Wonderful
         *   1.3. World
         */
        targetItem.after(item);
      }
    });

    /**
     * Remove current item element
     */
    currentItem.remove();

    /**
     * Restore the caret position
     */
    this.caret.restore();
  }

  /**
   * Add indentation to current item
   *
   * @param {KeyboardEvent} event - keydown
   */
  addTab(event) {
    /**
     * Prevent editor.js behaviour
     */
    event.stopPropagation();

    /**
     * Prevent browser tab behaviour
     */
    event.preventDefault();

    const currentItem = this.currentItem;
    const prevItem = currentItem.previousSibling;
    const isFirstChild = !prevItem;

    /**
     * In the first item we should not handle Tabs (because there is no parent item above)
     */
    if (isFirstChild) {
      return;
    }

    const prevItemChildrenList = prevItem.querySelector(`.${this.CSS.itemChildren}`);

    this.caret.save();

    /**
     * If prev item has child items, just append current to them
     */
    if (prevItemChildrenList) {
      prevItemChildrenList.appendChild(currentItem);
    } else {
      /**
       * If prev item has no child items
       * - Create and append children wrapper to the previous item
       * - Append current item to it
       */
      const sublistWrapper = this.makeListWrapper(undefined, [ this.CSS.itemChildren ]);
      const prevItemBody = prevItem.querySelector(`.${this.CSS.itemBody}`);

      sublistWrapper.appendChild(currentItem);
      prevItemBody.appendChild(sublistWrapper);
    }

    this.caret.restore();
  }

  /**
   * Reduce indentation for current item
   *
   * @param {KeyboardEvent} event - keydown
   * @returns {void}
   */
  shiftTab(event) {
    /**
     * Prevent editor.js behaviour
     */
    event.stopPropagation();

    /**
     * Prevent browser tab behaviour
     */
    event.preventDefault();

    /**
     * Move item from current list to parent list
     */
    this.unshiftItem();
  }

  /**
   * Convert from list to text for conversionConfig
   * @param {ListData} data
   * @returns {string}
  */
  static joinRecursive(data) {
    return data.items
      .map((item) => `${item.content} ${NestedList.joinRecursive(item)}`)
      .join('');
  }

  /**
   * Convert from text to list with import and export list to text
   */
  static get conversionConfig() {
    return {
      export: (data) => {
        return NestedList.joinRecursive(data);
      },
      import: (content) => {
        return {
          items: [{
            content,
            items: []
          }],
          style: 'unordered'
        };
      }
    };
  }
}

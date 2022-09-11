/**
 * @typedef {object} LinkToolData
 * @description Link Tool's input and output data format
 * @property {string} link — data url
 * @property {metaData} meta — fetched link data
 */

/**
 * @typedef {object} metaData
 * @description Fetched link meta data
 * @property {string} image - link's meta image
 * @property {string} title - link's meta title
 * @property {string} description - link's description
 */

// eslint-disable-next-line
import css from './index.css';
import ToolboxIcon from './svg/toolbox.svg';
import ajax from '@codexteam/ajax';
// eslint-disable-next-line
import polyfill from 'url-polyfill';

/**
 * @typedef {object} UploadResponseFormat
 * @description This format expected from backend on link data fetching
 * @property {number} success  - 1 for successful uploading, 0 for failure
 * @property {metaData} meta - Object with link data.
 *
 * Tool may have any data provided by backend, currently are supported by design:
 * title, description, image, url
 */
export default class LinkTool {
  /**
   * Notify core that read-only mode supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
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
      icon: ToolboxIcon,
      title: 'Link',
    };
  }

  /**
   * Allow to press Enter inside the LinkTool input
   *
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * @param {LinkToolData} data - previously saved data
   * @param {config} config - user config for Tool
   * @param {object} api - Editor.js API
   * @param {boolean} readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;

    /**
     * Tool's initial config
     */
    this.config = {
      endpoint: config.endpoint || '',
      headers: config.headers || {},
    };

    this.nodes = {
      wrapper: null,
      container: null,
      progress: null,
      input: null,
      inputHolder: null,
      linkContent: null,
      linkImage: null,
      linkTitle: null,
      linkDescription: null,
      linkText: null,
    };

    this._data = {
      link: '',
      meta: {},
    };

    this.data = data;
  }

  /**
   * Renders Block content
   *
   * @public
   *
   * @returns {HTMLDivElement}
   */
  render() {
    this.nodes.wrapper = this.make('div', this.CSS.baseClass);
    this.nodes.container = this.make('div', this.CSS.container);

    this.nodes.inputHolder = this.makeInputHolder();
    this.nodes.linkContent = this.prepareLinkPreview();

    /**
     * If Tool already has data, render link preview, otherwise insert input
     */
    if (Object.keys(this.data.meta).length) {
      this.nodes.container.appendChild(this.nodes.linkContent);
      this.showLinkPreview(this.data.meta);
    } else {
      this.nodes.container.appendChild(this.nodes.inputHolder);
    }

    this.nodes.wrapper.appendChild(this.nodes.container);

    return this.nodes.wrapper;
  }

  /**
   * Return Block data
   *
   * @public
   *
   * @returns {LinkToolData}
   */
  save() {
    return this.data;
  }

  /**
   * Validate Block data
   * - check if given link is an empty string or not.
   *
   * @public
   *
   * @returns {boolean} false if saved data is incorrect, otherwise true
   */
  validate() {
    return this.data.link.trim() !== '';
  }

  /**
   * Stores all Tool's data
   *
   * @param {LinkToolData} data
   */
  set data(data) {
    this._data = Object.assign({}, {
      link: data.link || this._data.link,
      meta: data.meta || this._data.meta,
    });
  }

  /**
   * Return Tool data
   *
   * @returns {LinkToolData}
   */
  get data() {
    return this._data;
  }

  /**
   * @returns {object} - Link Tool styles
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,

      /**
       * Tool's classes
       */
      container: 'link-tool',
      inputEl: 'link-tool__input',
      inputHolder: 'link-tool__input-holder',
      inputError: 'link-tool__input-holder--error',
      linkContent: 'link-tool__content',
      linkContentRendered: 'link-tool__content--rendered',
      linkImage: 'link-tool__image',
      linkTitle: 'link-tool__title',
      linkDescription: 'link-tool__description',
      linkText: 'link-tool__anchor',
      progress: 'link-tool__progress',
      progressLoading: 'link-tool__progress--loading',
      progressLoaded: 'link-tool__progress--loaded',
    };
  }

  /**
   * Prepare input holder
   *
   * @returns {HTMLElement}
   */
  makeInputHolder() {
    const inputHolder = this.make('div', this.CSS.inputHolder);

    this.nodes.progress = this.make('label', this.CSS.progress);
    this.nodes.input = this.make('div', [this.CSS.input, this.CSS.inputEl], {
      contentEditable: !this.readOnly,
    });

    this.nodes.input.dataset.placeholder = this.api.i18n.t('Link');

    if (!this.readOnly) {
      this.nodes.input.addEventListener('paste', (event) => {
        this.startFetching(event);
      });

      this.nodes.input.addEventListener('keydown', (event) => {
        const [ENTER, A] = [13, 65];
        const cmdPressed = event.ctrlKey || event.metaKey;

        switch (event.keyCode) {
          case ENTER:
            event.preventDefault();
            event.stopPropagation();

            this.startFetching(event);
            break;
          case A:
            if (cmdPressed) {
              this.selectLinkUrl(event);
            }
            break;
        }
      });
    }

    inputHolder.appendChild(this.nodes.progress);
    inputHolder.appendChild(this.nodes.input);

    return inputHolder;
  }

  /**
   * Activates link data fetching by url
   *
   * @param {PasteEvent} event
   */
  startFetching(event) {
    let url = this.nodes.input.textContent;

    if (event.type === 'paste') {
      url = (event.clipboardData || window.clipboardData).getData('text');
    }

    this.removeErrorStyle();
    this.fetchLinkData(url);
  }

  /**
   * If previous link data fetching failed, remove error styles
   */
  removeErrorStyle() {
    this.nodes.inputHolder.classList.remove(this.CSS.inputError);
    this.nodes.inputHolder.insertBefore(this.nodes.progress, this.nodes.input);
  }

  /**
   * Select LinkTool input content by CMD+A
   *
   * @param {KeyboardEvent} event
   */
  selectLinkUrl(event) {
    event.preventDefault();
    event.stopPropagation();

    const selection = window.getSelection();
    const range = new Range();

    const currentNode = selection.anchorNode.parentNode;
    const currentItem = currentNode.closest(`.${this.CSS.inputHolder}`);
    const inputElement = currentItem.querySelector(`.${this.CSS.inputEl}`);

    range.selectNodeContents(inputElement);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  /**
   * Prepare link preview holder
   *
   * @returns {HTMLElement}
   */
  prepareLinkPreview() {
    const holder = this.make('a', this.CSS.linkContent, {
      target: '_blank',
      rel: 'nofollow noindex noreferrer',
    });

    this.nodes.linkImage = this.make('div', this.CSS.linkImage);
    this.nodes.linkTitle = this.make('div', this.CSS.linkTitle);
    this.nodes.linkDescription = this.make('p', this.CSS.linkDescription);
    this.nodes.linkText = this.make('span', this.CSS.linkText);

    return holder;
  }

  /**
   * Compose link preview from fetched data
   *
   * @param {metaData} meta - link meta data
   */
  showLinkPreview({ image, title, description }) {
    this.nodes.container.appendChild(this.nodes.linkContent);

    if (image && image.url) {
      this.nodes.linkImage.style.backgroundImage = 'url(' + image.url + ')';
      this.nodes.linkContent.appendChild(this.nodes.linkImage);
    }

    if (title) {
      this.nodes.linkTitle.textContent = title;
      this.nodes.linkContent.appendChild(this.nodes.linkTitle);
    }

    if (description) {
      this.nodes.linkDescription.textContent = description;
      this.nodes.linkContent.appendChild(this.nodes.linkDescription);
    }

    this.nodes.linkContent.classList.add(this.CSS.linkContentRendered);
    this.nodes.linkContent.setAttribute('href', this.data.link);
    this.nodes.linkContent.appendChild(this.nodes.linkText);

    try {
      this.nodes.linkText.textContent = (new URL(this.data.link)).hostname;
    } catch (e) {
      this.nodes.linkText.textContent = this.data.link;
    }
  }

  /**
   * Show loading progressbar
   */
  showProgress() {
    this.nodes.progress.classList.add(this.CSS.progressLoading);
  }

  /**
   * Hide loading progressbar
   */
  hideProgress() {
    return new Promise((resolve) => {
      this.nodes.progress.classList.remove(this.CSS.progressLoading);
      this.nodes.progress.classList.add(this.CSS.progressLoaded);

      setTimeout(resolve, 500);
    });
  }

  /**
   * If data fetching failed, set input error style
   */
  applyErrorStyle() {
    this.nodes.inputHolder.classList.add(this.CSS.inputError);
    this.nodes.progress.remove();
  }

  /**
   * Sends to backend pasted url and receives link data
   *
   * @param {string} url - link source url
   */
  async fetchLinkData(url) {
    this.showProgress();
    this.data = { link: url };

    try {
      const { body } = await (ajax.get({
        url: this.config.endpoint,
        headers: this.config.headers,
        data: {
          url,
        },
      }));

      this.onFetch(body);
    } catch (error) {
      this.fetchingFailed(this.api.i18n.t('Couldn\'t fetch the link data'));
    }
  }

  /**
   * Link data fetching callback
   *
   * @param {UploadResponseFormat} response
   */
  onFetch(response) {
    if (!response || !response.success) {
      this.fetchingFailed(this.api.i18n.t('Couldn\'t get this link data, try the other one'));

      return;
    }

    const metaData = response.meta;

    const link = response.link || this.data.link;

    this.data = {
      meta: metaData,
      link,
    };

    if (!metaData) {
      this.fetchingFailed(this.api.i18n.t('Wrong response format from the server'));

      return;
    }

    this.hideProgress().then(() => {
      this.nodes.inputHolder.remove();
      this.showLinkPreview(metaData);
    });
  }

  /**
   * Handle link fetching errors
   *
   * @private
   *
   * @param {string} errorMessage
   */
  fetchingFailed(errorMessage) {
    this.api.notifier.show({
      message: errorMessage,
      style: 'error',
    });

    this.applyErrorStyle();
  }

  /**
   * Helper method for elements creation
   *
   * @param tagName
   * @param classNames
   * @param attributes
   * @returns {HTMLElement}
   */
  make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }
}

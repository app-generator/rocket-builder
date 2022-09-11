/**
 * Import Tool's icon
 */
import ToolboxIcon from './svg/toolbox.svg';

/**
 * Build styles
 */
require('./index.css').toString();

/**
 * @class Warning
 * @classdesc Warning Tool for Editor.js
 * @property {WarningData} data - Warning Tool`s input and output data
 * @property {object} api - Editor.js API instance
 *
 * @typedef {object} WarningData
 * @description Warning Tool`s input and output data
 * @property {string} title - warning`s title
 * @property {string} message - warning`s message
 *
 * @typedef {object} WarningConfig
 * @description Warning Tool`s initial configuration
 * @property {string} titlePlaceholder - placeholder to show in warning`s title input
 * @property {string} messagePlaceholder - placeholder to show in warning`s message input
 */
export default class Warning {

  /**
   * Notify core that read-only mode is supported
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Get Toolbox settings
   *
   * @public
   * @returns {string}
   */
  static get toolbox() {
    return {
      icon: ToolboxIcon,
      title: 'Warning',
    };
  }

  /**
   * Allow to press Enter inside the Warning
   *
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Default placeholder for warning title
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_TITLE_PLACEHOLDER() {
    return 'Title';
  }

  /**
   * Default placeholder for warning message
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_MESSAGE_PLACEHOLDER() {
    return 'Message';
  }

  /**
   * Warning Tool`s styles
   *
   * @returns {object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-warning',
      title: 'cdx-warning__title',
      input: this.api.styles.input,
      message: 'cdx-warning__message',
    };
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {WarningData} data — previously saved data
   * @param {WarningConfig} config — user config for Tool
   * @param {object} api - Editor.js API
   * @param {boolean} readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;

    this.titlePlaceholder = config.titlePlaceholder || Warning.DEFAULT_TITLE_PLACEHOLDER;
    this.messagePlaceholder = config.messagePlaceholder || Warning.DEFAULT_MESSAGE_PLACEHOLDER;

    this.data = {
      title: data.title || '',
      message: data.message || '',
    };
  }

  /**
   * Create Warning Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const container = this._make('div', [this.CSS.baseClass, this.CSS.wrapper]);
    const title = this._make('div', [this.CSS.input, this.CSS.title], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.title,
    });
    const message = this._make('div', [this.CSS.input, this.CSS.message], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.message,
    });

    title.dataset.placeholder = this.titlePlaceholder;
    message.dataset.placeholder = this.messagePlaceholder;

    container.appendChild(title);
    container.appendChild(message);

    return container;
  }

  /**
   * Extract Warning data from Warning Tool element
   *
   * @param {HTMLDivElement} warningElement - element to save
   * @returns {WarningData}
   */
  save(warningElement) {
    const title = warningElement.querySelector(`.${this.CSS.title}`);
    const message = warningElement.querySelector(`.${this.CSS.message}`);

    return Object.assign(this.data, {
      title: title.innerHTML,
      message: message.innerHTML,
    });
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {Array|string} classNames  - list or name of CSS classname(s)
   * @param  {object} attributes        - any attributes
   * @returns {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
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

  /**
   * Sanitizer config for Warning Tool saved data
   *
   * @returns {object}
   */
  static get sanitize() {
    return {
      title: {},
      message: {},
    };
  }
}

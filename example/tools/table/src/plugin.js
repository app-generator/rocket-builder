import Table from './table';
import tableIcon from './img/tableIcon.svg';
import withHeadings from './img/with-headings.svg';
import withoutHeadings from './img/without-headings.svg';
import * as $ from './utils/dom';

/**
 * @typedef {object} TableConfig - configuration that the user can set for the table
 * @property {number} rows - number of rows in the table
 * @property {number} cols - number of columns in the table
 */
/**
 * @typedef {object} Tune - setting for the table
 * @property {string} name - tune name
 * @property {HTMLElement} icon - icon for the tune
 * @property {boolean} isActive - default state of the tune
 * @property {void} setTune - set tune state to the table data
 */
/**
 * @typedef {object} TableData - object with the data transferred to form a table
 * @property {boolean} withHeading - setting to use cells of the first row as headings
 * @property {string[][]} content - two-dimensional array which contains table content
 */

/**
 * Table block for Editor.js
 */
export default class TableBlock {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Allow to press Enter inside the CodeTool textarea
   *
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {TableData} data — previously saved data
   * @param {TableConfig} config - user config for Tool
   * @param {object} api - Editor.js API
   * @param {boolean} readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = {
      withHeadings: data && data.withHeadings ? data.withHeadings : false,
      content: data && data.content ? data.content : []
    };
    this.config = config;
    this.table = null;
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
      icon: tableIcon,
      title: 'Table'
    };
  }

  /**
   * Plugins styles
   *
   * @returns {{settingsWrapper: string}}
   */
  static get CSS() {
    return {
      settingsWrapper: 'tc-settings'
    };
  }

  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement}
   */
  render() {
    /** creating table */
    this.table = new Table(this.readOnly, this.api, this.data, this.config);

    /** creating container around table */
    this.container = $.make('div', this.api.styles.block);
    this.container.appendChild(this.table.getWrapper());

    this.table.setHeadingsSetting(this.data.withHeadings);

    return this.container;
  }

  /**
   * Add plugin settings
   *
   * @returns {HTMLElement} - wrapper element
   */
  renderSettings() {
    const wrapper = $.make('div', TableBlock.CSS.settingsWrapper);

    const tunes = [ {
      name: this.api.i18n.t('With headings'),
      icon: withHeadings,
      isActive: this.data.withHeadings,
      setTune: () => {
        this.data.withHeadings = true;
      }
    }, {
      name: this.api.i18n.t('Without headings'),
      icon: withoutHeadings,
      isActive: !this.data.withHeadings,
      setTune: () => {
        this.data.withHeadings = false;
      }
    } ];

    tunes.forEach((tune) => {
      let tuneButton = $.make('div', this.api.styles.settingsButton);

      if (tune.isActive) {
        tuneButton.classList.add(this.api.styles.settingsButtonActive);
      }

      tuneButton.innerHTML = tune.icon;
      tuneButton.addEventListener('click', () => this.toggleTune(tune, tuneButton));

      this.api.tooltip.onHover(tuneButton, tune.name, {
        placement: 'top',
        hidingDelay: 500
      });

      wrapper.append(tuneButton);
    });

    return wrapper;
  }

  /**
   * Extract table data from the view
   *
   * @returns {TableData} - saved data
   */
  save() {
    const tableContent = this.table.getData();

    let result = {
      withHeadings: this.data.withHeadings,
      content: tableContent
    };

    return result;
  }

  /**
   * Changes the state of the tune
   * Updates its representation in the table
   *
   * @param {Tune} tune - one of the table settings
   * @param {HTMLElement} tuneButton - DOM element of the tune
   * @returns {void}
   */
  toggleTune(tune, tuneButton) {
    const buttons = tuneButton.parentNode.querySelectorAll('.' + this.api.styles.settingsButton);

    // Clear other buttons
    Array.from(buttons).forEach((button) =>
      button.classList.remove(this.api.styles.settingsButtonActive)
    );

    // Mark active button
    tuneButton.classList.toggle(this.api.styles.settingsButtonActive);
    tune.setTune();

    this.table.setHeadingsSetting(this.data.withHeadings);
  }

  /**
   * Plugin destroyer
   *
   * @returns {void}
   */
  destroy() {
    this.table.destroy();
  }
}

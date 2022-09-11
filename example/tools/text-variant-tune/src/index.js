import './styles/index.css';
import * as $ from './utils/dom';
import IconCallOut from './assets/call-out.svg';
import IconCitation from './assets/citation.svg';
import IconDetails from './assets/details.svg';

/**
 * Available predefined variants
 */
export const TextVariant = {
  /**
   * For important information the author wants to emphasize.
   * Should be indicated by a border and some padding inside the border.
   */
  CallOut: 'call-out',

  /**
   * To cite some full-text from a different source without using the Quote tool provided by editor.js.
   * Should be indicated by all italics.
   */
  Citation: 'citation',

  /**
   * To add some information that is less important.
   * Should be indicated by a font about two sizes smaller than standard text.
   */
  Details: 'details',
};

/**
 * @typedef {string} TextVariantData
 */

/**
 * @typedef {object} TextVariantTuneConfig
 */

/**
 * This Block Tunes allows user to select some of predefined text variant.
 *
 * @see TextVariant enum for the details.
 * @uses Block Tunes API  {@link https://editorjs.io/block-tunes-api}
 */
export default class TextVariantTune {
  /**
   * Tune constructor. Called on Block creation
   *
   * @param {object} options - constructor params
   * @param {API} api - editor.js Core API
   * @param {BlockAPI} block - editor.js Block API
   * @param {TextVariantData} data - previously saved data
   * @param {TextVariantTuneConfig} config - configuration supported by Tune
   */
  constructor({ api, data, config, block }) {
    this.api = api;
    this.data = data;
    this.config = config;
    this.block = block;

    this.variants = [
      {
        name: TextVariant.CallOut,
        icon: IconCallOut,
        title: this.api.i18n.t('Call-out'),
      },
      {
        name: TextVariant.Citation,
        icon: IconCitation,
        title: this.api.i18n.t('Citation'),
      },
      {
        name: TextVariant.Details,
        icon: IconDetails,
        title: this.api.i18n.t('Details'),
      },
    ];

    this.wrapper = undefined;
  }

  /**
   * Tell editor.js that this Tool is a Block Tune
   *
   * @returns {boolean}
   */
  static get isTune() {
    return true;
  }

  /**
   * CSS selectors used in Tune
   */
  static get CSS() {
    return {
      toggler: 'cdx-text-variant__toggler',
    };
  }

  /**
   * Create Tunes controls wrapper that will be appended to the Block Tunes panel
   *
   * @returns {Element}
   */
  render() {
    const tuneWrapper = $.make('div', '');

    this.variants.forEach(({ name, icon, title }) => {
      const toggler = $.make('div', [this.api.styles.settingsButton, TextVariantTune.CSS.toggler], {
        innerHTML: icon,
      });

      toggler.dataset.name = name;

      this.api.tooltip.onHover(toggler, title, {
        placement: 'top',
        hidingDelay: 500,
      });

      tuneWrapper.appendChild(toggler);
    });

    /**
     * Delegate click event on all the controls
     */
    this.api.listeners.on(tuneWrapper, 'click', (event) => {
      this.tuneClicked(event);
    });

    return tuneWrapper;
  }

  /**
   * Handler for Tune controls click
   * Toggles the variant
   *
   * @param {MouseEvent} event - click
   * @returns {void}
   */
  tuneClicked(event) {
    const tune = event.target.closest(`.${this.api.styles.settingsButton}`);
    const isEnabled = tune.classList.contains(this.api.styles.settingsButtonActive);

    tune.classList.toggle(this.api.styles.settingsButtonActive, !isEnabled);

    this.variant = !isEnabled ? tune.dataset.name : '';
  }

  /**
   * Wraps Block Content to the Tunes wrapper
   *
   * @param {Element} blockContent - editor.js block inner container
   * @returns {Element} - created wrapper
   */
  wrap(blockContent) {
    this.wrapper = $.make('div');

    this.variant = this.data;

    this.wrapper.appendChild(blockContent);

    return this.wrapper;
  }

  /**
   * Save current variant in memory and apply style for that
   *
   * @param {string} name - variant to save
   */
  set variant(name) {
    this.data = name;

    this.variants.forEach((variant) => {
      this.wrapper.classList.toggle(`cdx-text-variant--${variant.name}`, variant.name === this.data);
    });
  }

  /**
   * Returns Tune state
   *
   * @returns {string}
   */
  save() {
    return this.data || '';
  }
}

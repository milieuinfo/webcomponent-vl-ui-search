import {vlElement, define} from '/node_modules/vl-ui-core/dist/vl-core.js';
import {VlSelect} from '/node_modules/vl-ui-select/dist/vl-select.js';
import '/node_modules/vl-ui-icon/dist/vl-icon.js';
import '/node_modules/vl-ui-button/dist/vl-button.js';
import '/node_modules/vl-ui-input-field/dist/vl-input-field.js';

/**
 * Search change event analoog aan native change event.
 * @event VlSearch#change
 */

/**
 * VlSearch
 * @class
 * @classdesc Gebruik de vl-search component zodat een gebruiker zoekcriteria kan ingeven om specifieke content te vinden.
 *
 * @extends HTMLElement
 * @mixes vlElement
 *
 * @property {string} [data-vl-label='Zoekterm'] - Attribuut wordt gebruikt als label voor zoekcriteria.
 * @property {string} [data-vl-submit-label='Zoeken'] - Attribuut wordt gebruikt als label voor de submit knop.
 * @property {boolean} data-vl-block - Attribuut duidt aan dat een breed zoekveld met knop wordt getoond. Dit is de standaardweergave.
 * @property {boolean} data-vl-inline - Attribuut duidt aan dat een smal zoekveld met kleine knop wordt gebruikt.
 * @property {boolean} data-vl-alt - Attribuut bepaalt of de alternatieve weergave (witte achtergrond) wordt gebruikt. Alleen relevant in combinatie met data-vl-block.
 *
 * @example Breedte aanpassen:
 * <style>
    :root {
      --vl-search-width: 50%;
    }
   </style>
 *
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-search/releases/latest|Release notes}
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-search/issues|Issues}
 * @see {@link https://webcomponenten.omgeving.vlaanderen.be/demo/vl-search.html|Demo}
 */
export class VlSearch extends vlElement(HTMLElement) {
  static get _observedAttributes() {
    return ['label', 'submit-label'];
  }

  static get _observedChildClassAttributes() {
    return ['inline', 'block', 'alt'];
  }

  constructor() {
    super(`
      <style>
        @import '/src/style.css';
        @import '/node_modules/vl-ui-icon/dist/style.css';
        @import '/node_modules/vl-ui-button/dist/style.css';
        @import '/node_modules/vl-ui-input-field/dist/style.css';
      </style>
      <div class="vl-search">
        <slot name="input"></slot>
        <input is="vl-input-field" class="vl-search__input" type="search" id="search-input" value="" title="Zoekterm" required />
      </div>
    `);
  }

  connectedCallback() {
    if (!this._isInline && !this._isBlock) {
      this.setAttribute('data-vl-block', ''); // default to block if none set
    }
    this.__processInputSlot();
    this.__setupChangeEventTriggers();
  }

  /**
   * Geeft de zoekterm.
   *
   * @return {String}
   */
  get value() {
    return this.__inputElement.value;
  }

  get _isInline() {
    return this.hasAttribute('data-vl-inline');
  }

  get _isBlock() {
    return this.hasAttribute('data-vl-block');
  }

  get _classPrefix() {
    return 'vl-search--';
  }

  get __labelElement() {
    return this._element.querySelector('#search-label');
  }

  get __buttonElement() {
    return this._element.querySelector('#search-button');
  }

  get __inputElement() {
    return this._element.querySelector('#search-input');
  }

  get __inputSlotElement() {
    return this._element.querySelector('slot[name="input"]');
  }

  _inlineChangedCallback(oldValue, newValue) {
    this.toggleAttribute('data-vl-block', newValue == undefined);
    this.__render();
  }

  _blockChangedCallback(oldValue, newValue) {
    this.toggleAttribute('data-vl-inline', newValue == undefined);
    this.__render();
  }

  _labelChangedCallback() {
    this.__renderLabel();
  }

  _submitLabelChangedCallback() {
    this.__renderButton();
  }

  __setupChangeEventTriggers() {
    if (this.__inputElement) {
      this.__inputElement.addEventListener('change', (event) => {
        event.stopPropagation();
        this._submit();
      });
    }
  }

  _submit() {
    this.dispatchEvent(new Event('change'));
  }

  __render() {
    this.__renderLabel();
    this.__renderButton();
  }

  __renderLabel() {
    if (this.__labelElement) {
      this.__labelElement.remove();
    }
    this._element.prepend(this.__getLabelTemplate());
  }

  __renderButton() {
    if (this.__buttonElement) {
      this.__buttonElement.remove();
    }
    this._element.append(this.__getButtonTemplate());
  }

  __iconTemplate() {
    return `<span is="vl-icon" data-vl-icon="magnifier" aria-hidden="true"></span>`;
  }

  __getLabelTemplate() {
    const text = this.dataset.vlLabel || 'Zoekterm';
    const content = this._isInline ? `<span class="vl-u-visually-hidden">${text}</span> ${this.__iconTemplate()}` : text;
    return this._template(`
      <label id="search-label" class="vl-search__label" for="search-input">
        <slot name="label">
          ${content}
        </slot>
      </label>
    `);
  }

  __getButtonTemplate() {
    const content = this._isInline ? this.__iconTemplate() : ``;
    return this._template(`
      <button is="vl-button" id="search-button" class="vl-search__submit" type="submit">
        ${content}
        <slot name="submit-label">
          ${this.dataset.vlSubmitLabel || 'Zoeken'}
        </slot>
      </button>
    `);
  }

  __processInputSlot() {
    const slot = this.querySelector('[slot="input"]');
    if (!slot) {
      this._shadow.querySelector('slot[name="input"]').remove();
    } else {
      customElements.whenDefined('vl-select').then(() => {
        if (slot instanceof VlSelect) {
          slot.addEventListener(VlSelect.readyEvent, (event) => {
            event.target._wrapperElement.classList.add('vl-search__input');
          });
        }
      });
      if (this.__inputElement) {
        this.__inputElement.remove();
      }
    }
  }
}

define('vl-search', VlSearch);

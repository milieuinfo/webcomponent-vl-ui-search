import { VlElement, define } from '/node_modules/vl-ui-core/dist/vl-core.js';
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
 * @extends VlElement
 *
 * @property {string} ['Zoekterm'] data-vl-label - Attribuut wordt gebruikt als label voor zoekcriteria.
 * @property {string} ['Zoeken'] data-vl-submit-label - Attribuut wordt gebruikt als label voor de submit knop.
 * @property {boolean} data-vl-block - Attribuut duidt aan dat een breed zoekveld met knop wordt getoond. Dit is de standaardweergave.
 * @property {boolean} data-vl-inline - Attribuut duidt aan dat een smal zoekveld met kleine knop wordt gebruikt.
 * @property {boolean} data-vl-alt - Attribuut bepaalt of de alternatieve weergave (witte achtergrond) wordt gebruikt. Alleen relevant in combinatie met data-vl-block.
 * 
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-search/releases/latest|Release notes}
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-search/issues|Issues}
 * @see {@link https://webcomponenten.omgeving.vlaanderen.be/demo/vl-search.html|Demo}
 * 
 */
export class VlSearch extends VlElement(HTMLElement) {
    static get _observedAttributes() {
        return ['label', 'submit-label'];
    }

    static get _observedChildClassAttributes() {
        return ['inline', 'block', 'alt'];
    }

    constructor() {
        super(`
            <style>
                @import '/node_modules/vl-ui-search/dist/style.css';
                @import '/node_modules/vl-ui-icon/dist/style.css';
                @import '/node_modules/vl-ui-button/dist/style.css';
                @import '/node_modules/vl-ui-input-field/dist/style.css';              
            </style>
            <div class="vl-search">
                <input is="vl-input-field" class="vl-search__input" type="search" id="search-input" value="" title="Zoekterm" required />
            </div>
        `);
    }

    connectedCallback() {
        if (!this._isInline && !this._isBlock) {
            this.setAttribute('data-vl-block', ''); // default to block if none set
        }
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

    _submit_labelChangedCallback() {
        this.__renderButton();
    }

    __setupChangeEventTriggers() {
        this.__inputElement.addEventListener('change', (event) => {
            event.stopPropagation();
            this._submit();
        });
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
}

define('vl-search', VlSearch);

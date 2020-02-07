import { VlElement, define } from '/node_modules/vl-ui-core/vl-core.js';
import { VlButton } from '/node_modules/vl-ui-button/vl-button.js';
import { VlInputField } from '/node_modules/vl-ui-input-field/vl-input-field.js';

/**
 * VlSearch
 * @class
 * @classdesc Gebruik de vl-search component zodat een gebruiker zoekcriteria kan ingeven om specifieke content te vinden.
 * 
 * @extends VlElement
 *
 * @event submit - Zoeken werd getriggerd. Het event bevat de zoekterm als detail.
 *
 * @property {string} data-vl-label - Attribuut wordt gebruikt als label voor zoekcriteria. Standaard 'Zoekterm'.
 * @property {boolean} block - Attribuut duidt aan dat een breed zoekveld met knop wordt getoond. (Dit is de standaardweergave.)
 * @property {boolean} inline - Attribuut duidt aan dat een smal zoekveld met kleine knop wordt gebruikt.
 * @property {boolean} alt - Attribuut bepaalt of de alternatieve weergave (witte achtergrond) wordt gebruikt. Niet van toepassing bij inline.
 * 
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-search/releases/latest|Release notes}
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-search/issues|Issues}
 * @see {@link https://webcomponenten.omgeving.vlaanderen.be/demo/vl-search.html|Demo}
 * 
 */
export class VlSearch extends VlElement(HTMLElement) {
  
    constructor() {
        super(`
                <style>
                    @import '../style.css';              
                </style>
                <div id="search" class="vl-search">
                    <input is="vl-input-field" 
                           class="vl-search__input" 
                           type="search"
                           id="search-input" 
                           value="" 
                           title="Zoekterm" 
                           required />
                </div>
            `);
        this.__registreerZoekBijEnter();
    }

    connectedCallback() {
        if (!this.hasAttribute('inline') && !this.hasAttribute('block')) {
            // default to block if none set
            this.__toggleInlineBlock(false);
        }
        this.__zoekknopElement.onclick = this._submit.bind(this);
    }

    static get _observedAttributes() {
        return ['data-vl-label'];
    }

    static get _observedChildClassAttributes() {
        return ['block', 'inline', 'alt'];
    }

    get _classPrefix() {
        return 'vl-search--';
    }

    get _stylePath() {
        return '../style.css';
    }

    get __labelElement() {
        return this._element.querySelector('#search-label');
    }

    get __zoekknopElement() {
        return this._element.querySelector('#search-button');
    }

    get __zoekveldElement() {
        return this._element.querySelector('#search-input');
    }

    _blockChangedCallback(oldValue, newValue) {
        this.__toggleInlineBlock(newValue == undefined);
        this.__zetLabelEnKnop();
    }

    _inlineChangedCallback(oldValue, newValue) {
        this.__toggleInlineBlock(newValue != undefined);
        this.__zetLabelEnKnop();
    }

    __toggleInlineBlock(inline) {
        if (inline) {
            this.removeAttribute('block');
            if (!this.hasAttribute('inline')) {
                this.setAttribute('inline', '');
            }
        } else {
            this.removeAttribute('inline');
            if (!this.hasAttribute('block')) {
                this.setAttribute('block', '');
            }
        }
    }

    _data_vl_labelChangedCallback() {
        if (this.__isInlineLabel) {
            this.__labelElement.querySelector('span').innerText = this.__labelTekst();
        } else {
            this.__labelElement.innerText = this.__labelTekst();
        }
    }

    get zoekterm() {
        return this.__zoekveldElement.value;
    }

    _submit() {
        const event = new CustomEvent("submit", {
            detail: {
                zoekterm: this.zoekterm
            }
        });
        this.dispatchEvent(event);
    }

    get __isInlineLabel() {
        return [...this.attributes].map(att => att.name).includes('inline');
    }

    __registreerZoekBijEnter() {
        this.__zoekveldElement.addEventListener("keydown", event => {
            if (event.key === 'Enter') {
                this._submit();
            }
        });
    }

    __zetLabelEnKnop() {
        if (this.__labelElement) {
            delete this.__labelElement;
        }
        if (this.__isInlineLabel) {
            this._element.prepend(this.__inlineLabelTemplate());
            this._element.appendChild(this.__zoekKnopTemplate(true))
        } else {
            this._element.prepend(this.__blockLabelTemplate());
            this._element.appendChild(this.__zoekKnopTemplate(false))
        }
    }

    __inlineLabelTemplate() {
        return this._template(`
            <label id="search-label" class="vl-search__label" for="search-input">
                <span class="vl-u-visually-hidden">${this.__labelTekst()}</span>
                <i class="vl-vi vl-vi-magnifier" aria-hidden="true"></i>
            </label>
        `);
    }

    __blockLabelTemplate() {
        return this._template(`
            <label id="search-label" 
                   class="vl-search__label" 
                   for="search-input">${this.__labelTekst()}</label>
        `);
    }

    __zoekKnopTemplate(inline) {
        return this._template(`
            <button is="vl-button"
                    id="search-button"
                    class="vl-search__submit"
                    type="submit">
                ${inline 
                    ? '<i class="vl-vi vl-vi-magnifier" aria-hidden="true"></i>' 
                    : ''}         
                Zoeken
            </button>
        `);
    }

    __labelTekst() {
        return this.dataset.vlLabel || 'Zoekterm';
    }

}

define('vl-search', VlSearch);

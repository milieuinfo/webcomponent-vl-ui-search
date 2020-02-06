const { VlElement } = require('vl-ui-core').Test;
const { By } = require('vl-ui-core').Test.Setup;

class VlSearch extends VlElement {

    constructor(driver, selector) {
        super(driver, selector);
    }

    async _getSearch() {
        return this.shadowRoot;
    }

    async _hasClass(clazz) {
        const classes =  await (await this._getSearch()).getAttribute('class');
        return classes.split(' ').includes(clazz);
    }

    async getZoekknop() {
        return (await this._getSearch()).findElement(By.css('#search-button'));
    }

    async getZoekveld() {
        return (await this._getSearch()).findElement(By.css('#search-input'));
    }

    async getLabel() {
        return (await this._getSearch()).findElement(By.css('#search-label'));
    }

    async getLabelTekst() {
        return (await this.getLabel()).getText();
    }

    async isBlock() {
        return this._hasClass('vl-search--block');
    }

    async isInline() {
        return this._hasClass('vl-search--inline');
    }

    async isAlt() {
        return this._hasClass('vl-search--alt');
    }

    async setZoekterm(zoekterm) {
        // (await this.getZoekveld()).sendKeys(zoekterm); --> not reachable by keyboard
        await this.driver.executeScript(`arguments[0].setAttribute('value', '${zoekterm}')`, this.getZoekveld());
    }

    async getZoekterm() {
        return (await this.getZoekveld()).getAttribute('value');
    }

    async zoek() {
        const zoekknop = await this.getZoekknop();
        return zoekknop.click();
    }

}

module.exports = VlSearch;

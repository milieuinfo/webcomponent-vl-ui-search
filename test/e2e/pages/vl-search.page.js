const VlSearch = require('../components/vl-search');
const { Page, Config } = require('vl-ui-core').Test;
const { By } = require('vl-ui-core').Test.Setup;

class VlSearchPage extends Page {
    async getInlineSearch() {
        return this._getSearch('#search-inline');
    }

    async getBlockSearch() {
        return this._getSearch('#search-block');
    }

    async getAltSearch() {
        return this._getSearch('#search-block-alt');
    }

    async getLabelSearch() {
        return this._getSearch('#search-block-label');
    }

    async getSlotLabelSearch() {
        return this._getSearch('#search-block-slot-label');
    }

    async getSearchValues() {
        const elements = await this.driver.findElements(By.css('[name=zoekterm]'));
        const values = await Promise.all(elements.map(element => element.getText()));
        return values.map(value => value.replace('Zoekterm: ', ''));
    }

    async load() {
        await super.load(Config.baseUrl + '/demo/vl-search.html');
    }

    async _getSearch(selector) {
        return new VlSearch(this.driver, selector);
    }
}

module.exports = VlSearchPage;

const VlSearch = require('../components/vl-search');
const { Page, Config } = require('vl-ui-core').Test;

class VlSearchPage extends Page {

    async _getSearch(selector) {
        return new VlSearch(this.driver, selector);
    }

    async getSearchInline() {
        return this._getSearch('#search-inline');
    }

    async getSearchBlock() {
        return this._getSearch('#search-block');
    }

    async getSearchBlockAlt() {
        return this._getSearch('#search-block-alt');
    }

    async getSearchBlockMetCustomLabel() {
        return this._getSearch('#search-block-custom-label');
    }

    async load() {
        await super.load(Config.baseUrl + '/demo/vl-search.html');
    }
}

module.exports = VlSearchPage;

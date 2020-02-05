const VlSearch = require('../components/vl-search');
const { Page, Config } = require('vl-ui-core').Test;

class VlSearchPage extends Page {

    async _getSearch(selector) {
        return new VlSearch(this.driver, selector);
    }

    async load() {
        await super.load(Config.baseUrl + '/demo/vl-search.html');
    }
}

module.exports = VlSearchPage;

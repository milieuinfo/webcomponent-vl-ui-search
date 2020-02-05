const { assert, driver } = require('vl-ui-core').Test.Setup;
const VlSearchPage = require('./pages/vl-search.page');

describe('vl-search', async () => {
    const vlSearchPage = new VlSearchPage(driver);

    before(() => {
        return vlSearchPage.load();
    });

    it('', async () => {
    });

    after(() => driver && driver.quit());
});

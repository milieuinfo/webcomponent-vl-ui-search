const { assert, driver } = require('vl-ui-core').Test.Setup;
const VlSearchPage = require('./pages/vl-search.page');

describe('vl-search', async () => {
    const vlSearchPage = new VlSearchPage(driver);

    before(() => {
        return vlSearchPage.load();
    });

    it('Als ik een inline search gebruik, zal deze niet block zijn', async () => {
        const search = await vlSearchPage.getSearchInline();
        await assert.eventually.isTrue(search.isInline());
        await assert.eventually.isFalse(search.isBlock());
    });

    it('Als ik een block search gebruik, zal deze niet inline zijn', async () => {
        const search = await vlSearchPage.getSearchBlock();
        await assert.eventually.isTrue(search.isBlock());
        await assert.eventually.isFalse(search.isInline());
    });

    it('Als ik een search gebruik zonder label wordt het default label gebruikt', async () => {
        const search = await vlSearchPage.getSearchBlock();
        await assert.eventually.equal(search.getLabelTekst(), 'Zoekterm');
    });

    it('Als ik een search gebruik met custom label wordt dat label getoond', async () => {
        const search = await vlSearchPage.getSearchBlockMetCustomLabel();
        await assert.eventually.equal(search.getLabelTekst(), 'Foo');
    });

    it('Als ik een block alt search gebruik, heeft deze alternatieve stijl', async () => {
        const search = await vlSearchPage.getSearchBlockAlt();
        await assert.eventually.isTrue(search.isBlock());
        await assert.eventually.isTrue(search.isAlt());
    });

    it('Als ik zoekterm ingeef en zoek, wordt de zoekterm op de demo pagina getoond', async () => {
        const search = await vlSearchPage.getSearchInline();
        await assert.eventually.equal(search.getLabelTekst(), 'Zoekterm');
        await search.setZoekterm("foobar");
        await assert.eventually.equal(search.getZoekterm(), 'foobar');
        await search.zoek();
        await assert.eventually.include(vlSearchPage.getZoektermen(), 'foobar');
    });

});

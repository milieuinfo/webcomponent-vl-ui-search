const {assert, getDriver} = require('vl-ui-core').Test.Setup;
const VlSearchPage = require('./pages/vl-search.page');

describe('vl-search', async () => {
  let vlSearchPage;

  before(() => {
    vlSearchPage = new VlSearchPage(getDriver());
    return vlSearchPage.load();
  });

  it('als gebruiker kan ik het verschil zien tussen een inline en een block search', async () => {
    const inlineSearch = await vlSearchPage.getInlineSearch();
    const blockSearch = await vlSearchPage.getBlockSearch();
    await assert.eventually.isTrue(inlineSearch.isInline());
    await assert.eventually.isFalse(inlineSearch.isBlock());
    await assert.eventually.isFalse(blockSearch.isInline());
    await assert.eventually.isTrue(blockSearch.isBlock());
  });

  it('als gebruiker kan ik het verschil zien tussen een alt en een gewone search', async () => {
    const search = await vlSearchPage.getBlockSearch();
    const altSearch = await vlSearchPage.getAltSearch();
    await assert.eventually.isFalse(search.isAlt());
    await assert.eventually.isTrue(altSearch.isAlt());
  });

  it('als gebruiker kan ik de gepersonaliseerde labels zien', async () => {
    const search = await vlSearchPage.getLabelSearch();
    await assert.eventually.equal(search.getLabelText(), 'Foo');
    await assert.eventually.equal(search.getSubmitText(), 'Bar');
  });

  it('als gebruiker kan ik de gepersonaliseerde labels zien ook als ze via slots zijn gedefinieerd', async () => {
    const search = await vlSearchPage.getSlotLabelSearch();
    const labelSlotContent = await search.getLabelSlotContent();
    const submitSlotContent = await search.getSubmitSlotContent();
    await assert.eventually.equal(labelSlotContent[0].getText(), 'Foo');
    await assert.eventually.equal(submitSlotContent[0].getText(), 'Bar');
  });

  it('als gebruiker kan ik zoeken door op de submit knop te klikken', async () => {
    const search = await vlSearchPage.getInlineSearch();
    const value = 'foobar';
    await search.setValue(value);
    await assert.eventually.equal(search.getValue(), value);
    await search.submit();
    await assert.eventually.include(vlSearchPage.getSearchValues(), value);
  });


  it('als gebruiker kan ik iets selecteren uit een select die via een slot is meegegeven', async () => {
    const selectSearch = await vlSearchPage.getSlotInputSearch();
    await selectSearch.search('Frankrijk');
    await selectSearch.selectByIndex(0);
    await assert.eventually.include(vlSearchPage.getSearchValues(), 'France');
  });
});

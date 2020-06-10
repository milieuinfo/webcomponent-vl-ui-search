const {VlElement} = require('vl-ui-core').Test;
const {By} = require('vl-ui-core').Test.Setup;
const {VlInputField} = require('vl-ui-input-field').Test;

class VlSearch extends VlElement {
  async isBlock() {
    return this.shadowRoot.hasClass('vl-search--block');
  }

  async isInline() {
    return this.shadowRoot.hasClass('vl-search--inline');
  }

  async isAlt() {
    return this.shadowRoot.hasClass('vl-search--alt');
  }

  async getLabelText() {
    const label = await this._labelElement();
    return this._getText(label);
  }

  async getLabelSlotContent() {
    const label = await this._labelElement();
    const slot = await label.findElement(By.css('slot'));
    return this.getAssignedElements(slot);
  }

  async getSubmitText() {
    const button = await this._submitButton();
    return this._getText(button);
  }

  async getSubmitSlotContent() {
    const button = await this._submitButton();
    const slot = await button.findElement(By.css('slot'));
    return this.getAssignedElements(slot);
  }

  async getValue() {
    const input = await this._inputElement();
    return input.getValue();
  }

  async setValue(content) {
    const input = await this._inputElement();
    await input.click();
    return this.sendKeys(content);
  }

  async submit() {
    const button = await this._submitButton();
    return button.click();
  }

  async _submitButton() {
    return this.shadowRoot.findElement(By.css('#search-button'));
  }

  async _inputElement() {
    const element = await this.shadowRoot.findElement(By.css('#search-input'));
    return new VlInputField(this.driver, element);
  }

  async _labelElement() {
    const element = await this.shadowRoot.findElement(By.css('#search-label'));
    return new VlElement(this.driver, element);
  }

  async _getText(element) {
    const text = await element.getTextContent();
    return text.trim();
  }
}

module.exports = VlSearch;

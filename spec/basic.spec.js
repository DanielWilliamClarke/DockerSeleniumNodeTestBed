const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('DefaultTest', () => {
    const driver = new Builder()
    .forBrowser('chrome')
    .usingServer("http://localhost:4444/wd/hub")
    .build();

    it('should go to nehalist.io and check the title', async () => {
        await driver.get('http://www.google.com/ncr');
        await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
        await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
        const title = await driver.getTitle();
        expect(title).to.equal('webdriver - Google Search');
    });

    after(async () => driver.quit());
});
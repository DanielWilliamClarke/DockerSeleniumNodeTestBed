const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe("Basic Test", () => {
    ["chrome", "firefox"].forEach(browser => {
        describe(`${browser} Test`, () => {
            it('should go to google and check the title', async () => {
                const driver = new Builder().forBrowser(browser).usingServer("http://localhost:4444/wd/hub").build();

                await driver.get('https://www.google.com');
                await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
                await driver.wait(until.titleIs('webdriver - Google Search'), 10000);
                expect(await driver.getTitle()).to.equal('webdriver - Google Search');

                await driver.sleep(5000);
                await driver.quit();
            });
        });
    });
});

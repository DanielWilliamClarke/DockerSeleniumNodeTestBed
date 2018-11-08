const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');

const BasicTest = async (driver) => {
    await driver.get('http://www.google.com/ncr');
    await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    const title = await driver.getTitle();
    expect(title).to.equal('webdriver - Google Search');
};

describe("Basic Test", () => {
    ["chrome", "firefox"].forEach(browser => {
        describe(`${browser} Test`, async () => {
            const driver = new Builder()
                .forBrowser(browser)
                .usingServer("http://localhost:4444/wd/hub")
                .build();

            it('should go to google and check the title', BasicTest.bind(this, driver));

            after(async () => driver.quit());
        });
    });
});


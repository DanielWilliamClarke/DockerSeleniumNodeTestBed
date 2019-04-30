const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const AsyncArray = require('bluebird');

const BrowserLogger = (browser, message) => {
    console.log(`${browser} | ${message}`);
};

const Test = async ({browser, driver}) => {
    BrowserLogger(browser, 'Test Start');

    BrowserLogger(browser, 'Accessing Google');
    await driver.get('https://www.google.com');
    await driver.sleep(1000);

    BrowserLogger(browser, 'Enter input');
    const inputBox = await driver.findElement(By.name('q'))
    await inputBox.sendKeys('webdriver');
    await driver.sleep(1000);

    BrowserLogger(browser, 'Submit Search');
    await inputBox.sendKeys(Key.RETURN);
    await driver.wait(until.titleIs('webdriver - Google Search'), 10000);
    expect(await driver.getTitle()).to.equal('webdriver - Google Search');

    BrowserLogger(browser, 'Click on first search result');
    await driver.sleep(1000);
    const topLink = await driver.findElement(By.xpath('(//a/h3)[1]'));
    await topLink.click();
    
    BrowserLogger(browser, 'Click on WebDriver Documentation');
    await driver.sleep(2000);
    const docSelector = By.id('menu_documentation');
    await driver.wait(until.elementLocated(docSelector), 10000);
    const docLink = await driver.findElement(docSelector);
    await docLink.click();

    BrowserLogger(browser, 'Select all Langauges');
    await driver.sleep(1000);
    const langSelector = By.xpath('//div[@id="codeLanguagePreference"]//li');
    await driver.wait(until.elementLocated(langSelector), 10000);
    const langButtons = await driver.findElements(langSelector);

    langButtons.shift();
    await AsyncArray.each(langButtons, async button => {
        await button.click();
        await driver.sleep(1000);
    });

    BrowserLogger(browser, 'Navigate to Introduction');
    const introLink = await driver.findElement(By.linkText('Introducing the Selenium-WebDriver API by Example'));
    await introLink.click();
    await driver.sleep(2000);

    BrowserLogger(browser, 'Scroll to next section');
    const nextSectionSelector = By.xpath('//a[@href="#selenium-webdriver-api-commands-and-operations" and @class="headerlink"]');
    const nextSection = await driver.findElement(nextSectionSelector);
    await driver.executeScript('arguments[0].scrollIntoView({ behavior: "smooth", block: "center" });', nextSection);
    await driver.sleep(3000);

    BrowserLogger(browser, 'Test Complete');
}

describe('Simple Google Test', () => {
    let drivers;
    before(() => {
        drivers = ['chrome', 'firefox'].map(browser => {
            return {
                browser: browser,
                driver: new Builder().forBrowser(browser).usingServer('http://localhost:4444/wd/hub').build()
            }
        });
    });

    after(() => {
        drivers.forEach(async d => {
            await d.driver.quit();
        });
    });

    it('Lets go read the webdriver documentation', async () => {
        await Promise.all(drivers.map(d => Test(d)))
    });
});

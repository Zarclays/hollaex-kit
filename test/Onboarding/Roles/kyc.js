// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './../../.env') });
let KYC = process.env.KYC;
let password = process.env.PASSWORD;
let logInPage = process.env.LOGIN_PAGE;

describe('KYC', function() {
	this.timeout(3000000);
	let driver;
	let vars;
	function sleep(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}
	beforeEach(async function() {
		driver = await new Builder().forBrowser('chrome').build();
		driver.manage().window().maximize();
		vars = {};
	});
	afterEach(async function() {
		await driver.quit();
	});
	it('KYC', async function() {
		console.log(' KYC role can access some user data to review KYC requirements');
		console.log(' Test name: KYC');
		console.log(' Step # | name | target | value');
		console.log(' 1 | open | /login | ');
		await driver.get(logInPage);
		await sleep(5000);
		console.log(' 2 | type | name=email |'+KYC);
		await driver.findElement(By.name('email')).sendKeys(KYC);
		console.log(' 3 | type | name=password | Password');
		await driver.findElement(By.name('password')).sendKeys(password);
		console.log(' 4 | click | css=.holla-button | ');
		await sleep(5000);
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(5000);
		console.log(' 5 | click | css=a > .pl-1 | ');
		await driver.findElement(By.css('a > .pl-1')).click();
		await sleep(5000);
		console.log(' 6 | click | css=.role-section > div:nth-child(2) | ');
		await driver.findElement(By.css('.role-section > div:nth-child(2)')).click();
		console.log(' 7 | assertText | css=.sub-label | KYC');
		assert(await driver.findElement(By.css('.sub-label')).getText() == 'KYC');
		console.log(' 8 | click | css=.active-side-menu | ');
		await sleep(5000);
		// await driver.findElement(By.css(".active-side-menu")).click()
		await driver.findElement(By.linkText('Users')).click();
		console.log(' 9 | click | name=id | ');
		await driver.findElement(By.name('id')).click();
		console.log(' 10 | type | name=id | 1');
		await driver.findElement(By.name('id')).sendKeys('1');
		console.log(' 11 | sendKeys | name=id | ${KEY_ENTER}');
		await driver.findElement(By.name('id')).sendKeys(Key.ENTER);
		console.log(' 12 | click | css=.ant-btn | ');
		await driver.findElement(By.css('.ant-btn')).click();
		console.log(' 13 | click | id=rc-tabs-8-tab-bank | ');
		await sleep(5000);
		await driver.findElement(By.id('rc-tabs-1-tab-bank')).click();
		console.log(' 14 | click | css=.ant-col:nth-child(1) .ant-card-head-wrapper | ');
		await driver.findElement(By.css('.ant-col:nth-child(1) .ant-card-head-wrapper')).click();
		console.log(' 15 | | assertElementPresent | css=.ant-col:nth-child(1) .ant-card-head-title |  |'); 
		{
			const elements = await driver.findElements(By.css('.ant-col:nth-child(1) .ant-card-head-title'));
			assert(elements.length);
		}

		await sleep(5000);
		await driver.findElement(By.linkText('Financials')).click();
		console.log(' 17 | runScript | window.scrollTo(0,0) | ');
		await driver.executeScript('window.scrollTo(0,0)');
		console.log(' 18 | click | css=p | ');
		await sleep(5000);
		await driver.findElement(By.css('p')).click();
		console.log(' 19 | assertElementPresent | css=p | ');
		{
			const elements = await driver.findElements(By.css('p'));
			assert(elements.length);
		}
		console.log(' 20 | click | css=.ant-card-body > .ant-alert | ');
		await driver.findElement(By.css('.ant-card-body > .ant-alert')).click();
		console.log(' 21 | assertElementPresent | css=.ant-card-body .ant-alert-description | ');
		{
			const elements = await driver.findElements(By.css('.ant-card-body .ant-alert-description'));
			assert(elements.length);
		}
		console.log(' 22 | click | id=rc-tabs-2-tab-assets | ');
		await sleep(5000);
		await driver.findElement(By.id('rc-tabs-2-tab-assets')).click();
		console.log(' 23 | click | css=.content | ');
		await driver.findElement(By.css('.content')).click();
		console.log(' 24 | assertText | css=.content | To view this page you must go back to Holla Dash');
		assert(await driver.findElement(By.css('.content')).getText() == 'To view this page you must go back to Holla Dash');
		console.log(' 25 | click | css=.ant-tabs-tab:nth-child(3) | ');
		await driver.findElement(By.css('.ant-tabs-tab:nth-child(3)')).click();
		console.log(' 26 | click | id =rc-tabs-2-tab-deposits | ');
		await driver.findElement(By.id('rc-tabs-2-tab-deposits')).click();
		console.log(' 27 | assertText | css=.ant-alert-closable > .ant-alert-message | Access denied: User is not authorized to access this endpoint');
		await sleep(5000);
		assert(await driver.findElement(By.css('.ant-alert-closable > .ant-alert-message')).getText() == 'Access denied: User is not authorized to access this endpoint');
		console.log(' 28 | click | id=rc-tabs-2-tab-withdrawals | ');
		await driver.findElement(By.id('rc-tabs-2-tab-withdrawals')).click();
		console.log(' 29 | click | css=#rc-tabs-2-panel-withdrawals .app-wrapper | ');
		await sleep(5000);
		await driver.findElement(By.css('#rc-tabs-2-panel-withdrawals .app-wrapper')).click();
		console.log(' 30 | assertText | css=#rc-tabs-2-panel-withdrawals .app-wrapper > .ant-alert > .ant-alert-message | Access denied: User is not authorized to access this endpoint');
		assert(await driver.findElement(By.css('#rc-tabs-2-panel-withdrawals .app-wrapper > .ant-alert > .ant-alert-message')).getText() == 'Access denied: User is not authorized to access this endpoint');
	});
});

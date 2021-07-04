// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './../../.env') });
let support = process.env.SUPPORT;
let password = process.env.PASSWORD;
let logInPage = process.env.LOGIN_PAGE;

describe('support', function() {
	this.timeout(300000);
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
	it('support', async function() {
		console.log('Support can access some user information for user verification');
		console.log('Test name: support');
		console.log('Step # | name | target | value');
		console.log('1 | open | /login | ');
		await driver.get(logInPage);
		console.log(' 2 | echo | \'Supervisor can access all deposit, withdrawals and approval settings\' |'); 
		await sleep(5000);
		console.log(' 3 | type | name=email |'+support);
		await driver.findElement(By.name('email')).sendKeys(support);
		console.log(' 4 | type | name=password | password!');
		await driver.findElement(By.name('password')).sendKeys(password);
		await sleep(5000);
		console.log(' 5 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(5000);

		console.log('6 | click | css=a > .pl-1 | ');
		await driver.findElement(By.css('a > .pl-1')).click();
		console.log('7 | click | css=.role-section > div:nth-child(2) | ');
		await driver.findElement(By.css('.role-section > div:nth-child(2)')).click();
		console.log('8 | assertText | css=.sub-label | Support');
		assert(await driver.findElement(By.css('.sub-label')).getText() == 'Support');
		console.log('9 | click | linkText=Users | ');
		await driver.findElement(By.linkText('Users')).click();
		console.log('10 | click | name=id | ');
		await driver.findElement(By.name('id')).click();
		console.log('11 | type | name=id | 1');
		await driver.findElement(By.name('id')).sendKeys('1');
		console.log('12 | sendKeys | name=id | ${KEY_ENTER}');
		await driver.findElement(By.name('id')).sendKeys(Key.ENTER);
		console.log('13 | click | css=.ant-btn | ');
		await driver.findElement(By.css('.ant-btn')).click();
		console.log('14 | click | css=div:nth-child(2) > .ant-btn-sm > span | ');
		await sleep(5000);
		await driver.findElement(By.css('div:nth-child(2) > .ant-btn-sm > span')).click();
		console.log('15 | assertNotEditable | name=email | ');
		{
			const element = await driver.findElement(By.name('email'));
			assert(!await element.isEnabled());
		}
		console.log('16 | click | closing| ');
		await sleep(5000);
		await driver.findElement(By.xpath('/html/body/div[4]/div/div[2]/div/div[2]/button')).click();
		console.log('17 | click | linkText=Financials | ');
		await driver.findElement(By.linkText('Financials')).click();
		console.log('18 | click | css=.app_container-content > .ant-alert | ');
		await sleep(5000);
		await driver.findElement(By.css('.app_container-content > .ant-alert')).click();
		console.log('19 | assertText | css=.app_container-content > .ant-alert > .ant-alert-description | Access denied: User is not authorized to access this endpoint');
		assert(await driver.findElement(By.css('.app_container-content > .ant-alert > .ant-alert-description')).getText() == 'Access denied: User is not authorized to access this endpoint');
		console.log('20 | click | css=.ant-card-body > .ant-alert | ');
		await driver.findElement(By.css('.ant-card-body > .ant-alert')).click();
		console.log('21 | assertText | css=.ant-card-body .ant-alert-description | Access denied: User is not authorized to access this endpoint');
		assert(await driver.findElement(By.css('.ant-card-body .ant-alert-description')).getText() == 'Access denied: User is not authorized to access this endpoint');
		console.log('22 | click | css=#rc-tabs-3-panel-summary > .app_container-content | ');
		await sleep(5000);
		console.log('23 | click | id=rc-tabs-2-tab-assets | ');
		await driver.findElement(By.id('rc-tabs-2-tab-assets')).click();
		console.log('24 | assertText | css=.content | To view this page you must go back to Holla Dash');
		assert(await driver.findElement(By.css('.content')).getText() == 'To view this page you must go back to Holla Dash');
		console.log('25 | click | id=rc-tabs-2-tab-deposits | ');
		//await sleep(5000)
		await driver.findElement(By.id('rc-tabs-2-tab-deposits')).click();
		console.log('26 | click | css=.ant-alert-closable | ');
		// await driver.findElement(By.css(".ant-alert-closable")).click()
		console.log('27 | assertText | css=.ant-alert-closable > .ant-alert-message | Access denied: User is not authorized to access this endpoint');
		await sleep(5000);
		assert(await driver.findElement(By.css('.ant-alert-closable > .ant-alert-message')).getText() == 'Access denied: User is not authorized to access this endpoint');
		console.log('28 | click | id=rc-tabs-2-tab-withdrawals | ');
		await driver.findElement(By.id('rc-tabs-2-tab-withdrawals')).click();
		console.log('29 | click | css=#rc-tabs-2-panel-withdrawals .app-wrapper > .ant-alert | ');
		//  await driver.findElement(By.css("#rc-tabs-2-panel-withdrawals .app-wrapper > .ant-alert")).click()
		console.log('30 |  assertText | css=.ant-alert-closable > .ant-alert-message | Access denied: User is not authorized to access this endpoint');
		await sleep(5000);
		//*[@id="rc-tabs-2-panel-withdrawals"]/div/div/div/div[2]/span[2]
		assert(await driver.findElement(By.xpath('//*[@id=\'rc-tabs-2-panel-withdrawals\']/div/div/div/div[2]/span[2]')).getText() == 'Access denied: User is not authorized to access this endpoint');
	});
});

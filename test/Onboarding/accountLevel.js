// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './../.env') });
let userName = process.env.ADMIN_USER;
let username = process.env.LEVEL_NAME;
let password = process.env.ADMIN_PASS;
let passWord = process.env.PASSWORD;
let logInPage = process.env.LOGIN_PAGE;
let Website = process.env.WEBSITE;


describe('AccountLevel', function() {
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
		//await driver.quit();
	});
	it('Account Level', async function() {
		console.log('Supervisor can access all deposit, withdrawals and approval settings');
		console.log(' Test name: Supervisor');
		console.log(' Step # | name | target | value');
		console.log(' 1 | open | /login | ');
		await driver.get(logInPage);
		await sleep(5000);
		console.log(' 2 | echo | \'Supervisor can access all deposit, withdrawals and approval settings\' |'); 
		console.log('\'Supervisor can access all deposit, withdrawals and approval settings\'');
		console.log(' 3 | type | name=email |'+userName);
		await driver.findElement(By.name('email')).sendKeys(userName);
		console.log(' 4 | type | name=password | password');
		await driver.findElement(By.name('password')).sendKeys(password);
		console.log(' 5 | click | css=.holla-button | ');
		await sleep(5000);
		await driver.findElement(By.css('.holla-button')).click();
		console.log(' 6 | click | css=a > .pl-1 | ');
		await sleep(5000);
		await driver.findElement(By.css('a > .pl-1')).click();
		console.log(' 7 | click | linkText=Users | ');
		await sleep(5000);
		// await driver.get(Website+"summary");
		// // 2 | click | css=a > .pl-1 | 
		// await driver.findElement(By.css("a > .pl-1")).click();
		// 3 | click | linkText=Users | 
		await driver.findElement(By.linkText('Users')).click();
		await sleep(3000);
		//4 | click | name=input | 
		await driver.findElement(By.name('input')).click();
		await sleep(3000);
		// 5 | type | name=input | leveltest
		await driver.findElement(By.name('input')).sendKeys('leveltest');
		// 6 | click | css=.ant-btn | 
		await driver.findElement(By.css('.ant-btn')).click();
		await sleep(3000);
		// 7 | click | css=.ml-4 > .ant-btn > span | 
		await driver.findElement(By.css('.ml-4 > .ant-btn > span')).click();
		await sleep(3000);
		// 8 | click | css=.ant-select-selector | 
		await driver.findElement(By.css('.ant-select-selector')).click();
		await sleep(3000);
		// 9 | click | xpath=//div[5]/div/div/div/div[2]/div[1]/div/div/div[4]/div/div/div[2] | 
		// /div[4]={1,..9}
		let level=Math.floor(Math.random() * 9)+1;
		console.log('level : '+String(level))
		
		if (level > 4){
			//driver.executeScript("window.scrollBy(0," +10+ ")");
			console.log('ready for srcowload')
			{
				const element = await driver.findElement(By.xpath('//div[5]/div/div/div/div[2]/div[1]/div/div/div['+level+']/div/div/div[2]'))
				await driver.executeScript('arguments[0].scrollIntoView(true);', element)
			  }
			await driver.findElement(By.xpath('//div[5]/div/div/div/div[2]/div[1]/div/div/div['+level+']/div/div/div[2]')).click();
			await sleep(3000);
			await driver.findElement(By.css('.w-100 > span')).click();
			await sleep(3000);
		
		}else{
			await driver.findElement(By.xpath('//div[5]/div/div/div/div[2]/div[1]/div/div/div['+level+']/div/div/div[2]')).click();
			await sleep(3000);
			await driver.findElement(By.css('.w-100 > span')).click();
			await sleep(3000);
		}
	
		// 10 | open | website/summary | 
		await driver.get(Website+'summary');
		await sleep(3000);
		// 11 | click | css=.w-100 > span | 

		// 12 | click | css=.app-bar-account-content > div:nth-child(2) | 
		await driver.findElement(By.css('.app-bar-account-content > div:nth-child(2)')).click();
		await sleep(3000);
		// 13 | click | css=.app-bar-account-menu-list:nth-child(10) > .edit-wrapper__container:nth-child(3) | 
		await driver.findElement(By.css('.app-bar-account-menu-list:nth-child(10) > .edit-wrapper__container:nth-child(3)')).click();
		await sleep(3000);
		// 14 | assertText | css=.trader-account-wrapper .summary-block-title | Level 4 Account

		await driver.get(logInPage);
		await driver.sleep(5000);
		const title = await driver.getTitle();
		console.log(title);
		console.log('entring'+ logInPage);
		console.log(' Step # | action | target | value');
    
		console.log(' 1 | type | name=email |'+ username);
		await driver.wait(until.elementLocated(By.name('email')), 5000);
		await driver.findElement(By.name('email')).sendKeys(username);
    
		console.log(' 2 | type | name=password | PASSWORD');
		//await driver.wait(until.elementLocated(By.name('password')), 5000);
		await driver.findElement(By.name('password')).sendKeys(passWord);
    
		console.log(' 3 | click | css=.auth_wrapper | ');
		//await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.auth_wrapper'))), 5000);
		await driver.findElement(By.css('.auth_wrapper')).click();
		//when login    
		console.log(' 5 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(5000)
		assert(await driver.findElement(By.css('.trader-account-wrapper .summary-block-title')).getText() == 'Level '+String(level)+' Account');
		// 15 | storeText | css=.trader-account-wrapper .summary-block-title | level
		vars['level'] = await driver.findElement(By.css('.trader-account-wrapper .summary-block-title')).getText();
		// 16 | echo | ${level} | 
		console.log(vars['level']);
	});
});

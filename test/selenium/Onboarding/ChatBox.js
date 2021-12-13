
// Generated by Selenium IDE
//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const { expect } = require('chai');
const { Console } = require('console');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
let userName = process.env.ADMIN_USER;
let passWord = process.env.ADMIN_PASS;
let logInPage = process.env.LOGIN_PAGE;
let Remot = process.env.SELENIUM_REMOTE_URL;
let browser = process.env.BROWSER;
describe('Orders', function() {
	this.timeout(30000);
	let driver;
	let vars;
	function sleep(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	} 
	beforeEach(async function() {
		//driver.manage().window().maximize();
           
	});
	afterEach(async function() {
	//	await driver.quit();
	});
  
	it('firefox', async function() {
    	//	driver = await new Builder().forBrowser('browser').build();
		driver = await new Builder().forBrowser('firefox').usingServer(Remot).build();
  

		//driver = await new RemoteWebDriver(new URL("https://3.37.238.142:4444/wd/hub"), capability);
           
	
		vars = {};
           
		// Test name: Untitled
		// Step # | name | target | value
		// 1 | open | /account | 
		await driver.get(logInPage);
		await sleep(10000);
		// 2 | type | name=email | USER@bitholla.com
		// await driver.wait(until.elementLocated(await driver.findElement(By.name("email"))), 5000);
		await driver.findElement(By.name('email')).sendKeys(userName);
		// 3 | type | name=password | bitholla@bitholla.com
		//await driver.wait(until.elementLocated(await driver.findElement(By.name("password"))),5000);
		await driver.findElement(By.name('password')).sendKeys(passWord);
		// 4 | click | name=email | 
          
		await sleep(3000);
		await driver.findElement(By.name('email')).click();
		// 5 | click | css=.holla-button | 
		await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.holla-button'))), 50000);
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(10000)
		{
			const elements = await driver.findElements(By.xpath('/html/body/div[10]/div[1]/img'))
			assert(elements.length)
		}
	})
	it('browser', async function() {
    		// driver = await new Builder().forBrowser('browser').build();
		driver = await new Builder().forBrowser('browser').usingServer(Remot).build();
  

		//driver = await new RemoteWebDriver(new URL("https://3.37.238.142:4444/wd/hub"), capability);
           
		driver.manage().window().maximize();
           
		vars = {};
           
		// Test name: Untitled
		// Step # | name | target | value
		console.log(" 1 | open | /account |") 
		await driver.get(logInPage);
		await sleep(10000);
		// 2 | type | name=email | USER@bitholla.com
		// await driver.wait(until.elementLocated(await driver.findElement(By.name("email"))), 5000);
		await driver.findElement(By.name('email')).sendKeys(userName);
		// 3 | type | name=password | bitholla@bitholla.com
		//await driver.wait(until.elementLocated(await driver.findElement(By.name("password"))),5000);
		await driver.findElement(By.name('password')).sendKeys(passWord);
		// 4 | click | name=email | 
          
		await sleep(3000);
		await driver.findElement(By.name('email')).click();
		// 5 | click | css=.holla-button | 
		await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.holla-button'))), 50000);
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(10000)
        //driver.takeScreenshot();
		{
			const elements = await driver.findElements(By.xpath('/html/body/div[10]/div[1]/img'))
			assert(elements.length)
		}
	})
	it('Edge', async function() {
  		// driver = await new Builder().forBrowser('browser').build();
		driver = await new Builder().forBrowser('MicrosoftEdge').usingServer(Remot).build();
  

		//driver = await new RemoteWebDriver(new URL("https://3.37.238.142:4444/wd/hub"), capability);
         
		driver.manage().window().maximize();
         
		vars = {};
         
		// Test name: Untitled
		// Step # | name | target | value
		// 1 | open | /account | 
		await driver.get(logInPage);
		await sleep(10000);
		// 2 | type | name=email | USER@bitholla.com
		// await driver.wait(until.elementLocated(await driver.findElement(By.name("email"))), 5000);
		await driver.findElement(By.name('email')).sendKeys(userName);
		// 3 | type | name=password | bitholla@bitholla.com
		//await driver.wait(until.elementLocated(await driver.findElement(By.name("password"))),5000);
		await driver.findElement(By.name('password')).sendKeys(passWord);
		// 4 | click | name=email | 
        
		await sleep(3000);
		await driver.findElement(By.name('email')).click();
		// 5 | click | css=.holla-button | 
		await driver.wait(until.elementIsEnabled(await driver.findElement(By.css('.holla-button'))), 50000);
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(10000)  
		{
			const elements = await driver.findElements(By.xpath('/html/body/div[10]/div[1]/img'))
			assert(elements.length)
		}
	})
})

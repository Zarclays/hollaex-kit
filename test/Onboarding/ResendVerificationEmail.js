//testing the login function of Hollaex Kit
//Using Selenium webderiver and Mocha/Chai
//given, when and then
const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { Console } = require('console');
const dotenv = require('dotenv');
dotenv.config();
let userName = process.env.USER_NAME;
let passWord = process.env.PASSWORD;
let webSite = process.env.WEBSITE;

if (process.env.NODE_ENV == 'test') {
	console.log('Variables are defined');
}


describe('NewUserRequest', function() {
	this.timeout(100000);
	let driver;
	let vars;
	function sleep(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}
	async function waitForWindow(timeout = 2) {
		await driver.sleep(timeout);
		const handlesThen = vars['windowHandles'];
		const handlesNow = await driver.getAllWindowHandles();
		if (handlesNow.length > handlesThen.length) {
			return handlesNow.find(handle => (!handlesThen.includes(handle)));
		}
		throw new Error('New window did not appear before timeout');
	}
	beforeEach(async function() {
		driver = await new Builder().forBrowser('chrome').build();
		vars = {};
	});
	afterEach(async function() {
		// await driver.quit();
    
	});
	it('ResendRequest', async function() {
		console.log('Test name: NewUserRequest');
		console.log(' Step # | name | target | value');
		console.log('1 | open | https://yourwebsite/verify | ');
		await driver.get(webSite+'verify');
		const title = await driver.getTitle();
		console.log(title);
		expect(title).to.equal(title);
		console.log('entring sand box');
		console.log(' Step # | action | target | value');
		console.log('2 | setWindowSize | 1050x660 | ');
      
		console.log('1| type | name=email | bob@gmail.com');
		await sleep(4000);
		await driver.findElement(By.name('email')).sendKeys(userName);
		console.log('2| click | css=.holla-button |');
		await sleep(4000);
		await driver.findElement(By.css('.holla-button')).click();
		await sleep(4000);
		console.log('assertText | css=.icon_title-text | Resent Email');
		expect(await driver.findElement(By.css('.icon_title-text')).getText()).to.equal('Resent Email');
    
		console.log('Test name: New User Email Confirmation');
		console.log('Step # | name | target | value');
		console.log('1 | open | /ServiceLogin/signinchooser?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fh%2Fwcro9khk6y0j%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin |'); 
		await driver.get('https://accounts.google.com/ServiceLogin/signinchooser?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fh%2Fwcro9khk6y0j%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin');
      
		console.log('2 | setWindowSize | 1050x660 | ');
		await driver.manage().window().setRect(1050, 660);
      
		console.log('3 | type&Enter | id=identifierId | youremail@gmail.com');
		await driver.findElement(By.id('identifierId')).sendKeys(userName);
		await driver.findElement(By.id('identifierId')).sendKeys(Key.ENTER);
    
		console.log('4 | wait | name=password | Holla!');
		await driver.wait(until.elementsLocated(By.name('password'),30000,'wait', 5000));
		console.log('sleep well for 10');
		await sleep(5000);
      
		console.log('5 | type&Enter | id=password| your password!');
		await driver.findElement(By.name('password')).sendKeys(passWord);
		await driver.findElement(By.name('password')).sendKeys(Key.ENTER);
      
		console.log('sleep well for 5');
		await sleep(5000);
      
		console.log('6 | click | linkText=Refresh | ');
		await driver.findElement(By.linkText('Refresh')).click();
      
		console.log('7 | click | css=.ts | ');
		await driver.findElement(By.css('.ts')).click();
		await driver.findElement(By.css('.h td')).click();
    
		console.log(' 8 | assertText | css=h2 b | sandbox Sign Up');
		expect(await driver.findElement(By.css('h2 b')).getText()).to.equal('sandbox Sign Up');
		console.log(' 9 | click | css=button | ');
		vars['windowHandles'] = await driver.getAllWindowHandles();
		console.log('10 | selectWindow | handle=${win9509} | ');
		await driver.findElement(By.css('button')).click();
		console.log(' 11 | click | css=.icon_title-wrapper | ');
		vars['win9509'] = await waitForWindow(5000);
		console.log('12 | assertNotText | css=.icon_title-text | Error');
		await driver.switchTo().window(vars['win9509']);
		await driver.findElement(By.css('.icon_title-wrapper')).click();
		{
			const text = await driver.findElement(By.css('.icon_title-text')).getText();
			expect(text).to.not.equal('Error');
		}
      

	});
});
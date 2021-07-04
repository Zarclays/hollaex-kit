// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const hollaTime = require('./time')
const defNewUser = require('./../Onboarding/newUser.js');
const { expect } = require('chai');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
let adminUser = process.env.ADMIN_USER;
let passWord = process.env.ADMIN_PASS;
let website = process.env.WEBSITE;
describe('smartTrade', function() {
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
		vars = {};
		defNewUser.kitLogIn(driver,adminUser,passWord);
   	});
	afterEach(async function() {
		// await driver.quit();
	});
	it('smartTrade', async function() {
    
		await sleep(15000);
		console.log(' Test name: smartTrade');
		console.log(' Step # | name | target | value');
		console.log(' 1 | open | /trade/xht-usdt | ');
		await driver.get(website+ 'trade/xht-usdt');
		await sleep(5000);
		await driver.findElement(By.css('.text-center:nth-child(1)')).click();
		console.log(' 2 | click | css=.trade-col_side_wrapper > .trade_block-wrapper:nth-child(1) | ');
		await driver.findElement(By.css('.trade-col_side_wrapper > .trade_block-wrapper:nth-child(1)')).click();
		await sleep(5000);
		await driver.findElement(By.name('size')).clear();
		await driver.findElement(By.name('size')).sendKeys('1');
		console.log(' 3 | storeText | css=.trade-col_side_wrapper > .trade_block-wrapper:nth-child(1) .trade_block-title-currency-xht | pair');
		vars['pair'] = await driver.findElement(By.css('.trade-col_side_wrapper > .trade_block-wrapper:nth-child(1) .trade_block-title-currency-xht')).getText();
		console.log(' 4 | setWindowSize | maximize| ');
		await driver.manage().window().maximize() ;
		console.log(' 5 | echo | ${pair} | ');
		console.log('The Pair is: '+vars['pair']);
		console.log(' 6 | click | css=.text-center:nth-child(1) | ');
		await driver.findElement(By.css('.text-center:nth-child(1)')).click();
		await sleep(5000);
		vars['USDT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		console.log(' 7 | storeText | css=.accordion_section:nth-child(2) .wallet_section-title-amount | HXT AMOUNT');
		vars['HXT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		console.log(' 8 | echo | ${USDT AMOUNT}, ${XHT AMOUNT} | ');
		console.log('${USDT AMOUNT} : '+vars['USDT AMOUNT'], '${XHT AMOUNT} : '+vars['HXT AMOUNT']);
		console.log(' 9 | storeValue | name=size | size');
		vars['size'] = await driver.findElement(By.name('size')).getAttribute('value');
    
		console.log(' 10 | click | css=.trade-col_action_wrapper > .trade_block-wrapper:nth-child(1)');
		vars['market'] = await driver.findElement(By.css('.text-center:nth-child(1)')).getText();
		console.log(' 11 | echo | ${market} | ');
		console.log('Market/Limit: '+vars['market']);
		console.log(' 12 | click | css=.trade_orderbook-spread-text | ');
		await driver.findElement(By.css('.trade_orderbook-spread-text')).click();
		console.log(' 13| storeText | css=.trade_orderbook-spread-text | spread');
		vars['spread'] = await driver.findElement(By.css('.trade_orderbook-spread-text')).getText();
		console.log(' 14 | echo | ${spread} | ');
		console.log('Spread: '+vars['spread']);
		console.log(' 15 | type | name=size | 1');
		let coinSize = parseInt(vars['size'],10);
		vars['Balance'] = await driver.findElement(By.css('div:nth-child(2) > .blue-link:nth-child(1)')).getText();
		let walletBalance = parseInt(vars['Balance'] ,10);
		vars['EstimatedPrice'] = await driver.findElement(By.css('.d-flex:nth-child(1) > .text-price')).getText();
		let estimatedSize = parseInt(vars['EstimatedPrice'] ,10);
		while (estimatedSize < walletBalance) {
			coinSize = coinSize+(10);

			await driver.findElement(By.name('size')).clear();
			await driver.findElement(By.name('size')).sendKeys(String(coinSize));
			console.log('Size is: '+String(coinSize));
			await driver.findElement(By.css('.trade-col_action_wrapper > .trade_block-wrapper:nth-child(1)')).click();
			vars['Balance'] = await driver.findElement(By.css('div:nth-child(2) > .blue-link:nth-child(1)')).getText();
			vars['EstimatedPrice'] = await driver.findElement(By.css('.d-flex:nth-child(1) > .text-price')).getText();
			estimatedSize = parseInt(vars['EstimatedPrice'] ,10);
			console.log('Wallet Balance: '+vars['Balance']);
			console.log('Estimated Price: '+vars['EstimatedPrice']);
			// {
			// 	const elements = await driver.findElements(By.css('.form-error'));
			// 	assert(!elements.length);
			// }
			//console.log(' 21 | verifyNotText | css=.form-error | Insufficient balance');
			// {
			//   const text = await driver.findElement(By.css(".form-error")).getText()
			//   assert(text !== "Insufficient balance")
			// }
		}
		await driver.findElement(By.css('.justify-content-end > .pointer')).click();
		await driver.findElement(By.css('.text-center:nth-child(1)')).click()
		// 4 | click | css=div:nth-child(2) > .blue-link:nth-child(1) | 
		await driver.findElement(By.css('div:nth-child(2) > .blue-link:nth-child(1)')).click()
		// 5 | click | css=.trade-col_action_wrapper | 
		await driver.findElement(By.css('.trade-col_action_wrapper')).click()
		// 6 | storeText | css=.d-flex:nth-child(1) > .text-price | BalanceEstimated
		vars['BalanceEstimated'] = await driver.findElement(By.css('.d-flex:nth-child(1) > .text-price')).getText()
		// 7 | storeValue | name=size | totalSize
		vars['totalSize'] = await driver.findElement(By.name('size')).getAttribute('value')
		// 8 | echo | ${BalanceEstimated},${totalSize} | 
		console.log(vars['BalanceEstimated'] + ' should be less than ' + vars['totalSize'])
		let BalanceEstimated = parseFloat(vars['BalanceEstimated'])
		let totalSize = parseFloat(['totalSize'])
		expect(totalSize - BalanceEstimated).to.be.above(0);
	});
	it('1xht buying', async function() {
		console.log(' Test name: 1xht buying');
		console.log(' Step # | name | target | value');
		await sleep(15000);
		await driver.manage().window().maximize() ;
		console.log(' Test name: smartTrade');
		console.log(' Step # | name | target | value');
		console.log(' 1 | open | /trade/xht-usdt | ');
		await driver.get(website+ 'trade/xht-usdt');
		await sleep(5000);
		//itrating on elms
		let elms = await driver.findElements(By.className('f-1 trade_orderbook-cell trade_orderbook-cell_total pointer'));
		for (var elm in elms){}
		await driver.findElement(By.css('.text-center:nth-child(1)')).click();
		console.log(' 2 | click | css=.trade-col_side_wrapper > .trade_block-wrapper:nth-child(1) | ');
		await driver.findElement(By.css('.trade-col_side_wrapper > .trade_block-wrapper:nth-child(1)')).click();
		await sleep(5000);
		console.log(' 2 | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDT AMOUNT');
		vars['USDT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		let USDTAmountBefore = parseFloat(vars['USDT AMOUNT']);
		console.log(' 3 | storeText | css=.accordion_section:nth-child(2) .wallet_section-title-amount | HXT AMOUNT');
		vars['XHT AMOUNT'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		let XHTAmountBefore =parseFloat(vars['XHT AMOUNT']);
		console.log(' 4 | echo | ${USDT AMOUNT}, ${XHT AMOUNT}');
		console.log('${USDT AMOUNT}:'+vars['USDT AMOUNT']+ ';${XHT AMOUNT} : '+vars['XHT AMOUNT']);
		console.log('USDT and XHT',String(XHTAmountBefore),typeof XHTAmountBefore,String(USDTAmountBefore),typeof USDTAmountBefore);
		console.log(' 5 | click | css=.text-center:nth-child(1) | ');
		await driver.findElement(By.css('.text-center:nth-child(1)')).click();
		console.log(' 6 | click | name=size | ');
		await driver.findElement(By.name('size')).click();
		console.log(' 7 | type | name=size | 1');
		await driver.findElement(By.name('size')).clear();
		await driver.findElement(By.name('size')).sendKeys('1');
		console.log(' 8 | click | css=.trade-col_action_wrapper > .trade_block-wrapper:nth-child(1) | ');
		await driver.findElement(By.css('.trade-col_action_wrapper > .trade_block-wrapper:nth-child(1)')).click();
		console.log(' 9 | storeText | css=.d-flex:nth-child(1) > .text-price | USDT');
		vars['USDT'] = await driver.findElement(By.css('.d-flex:nth-child(1) > .text-price')).getText();
		let EstimatedPrice = parseFloat(vars['USDT']);
		console.log('EstimatedPrice',String(EstimatedPrice),typeof EstimatedPrice );
		console.log(' 10 | echo | ${USDT} | ');
		console.log(vars['USDT']);
		console.log(' 11 | click | css=.holla-button | ');
		await driver.findElement(By.css('.holla-button')).click();
		console.log(' 12 | click | css=.notification-content-information > .d-flex:nth-child(1) | ');
		await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(1)')).click();
		console.log(' 13 | verifyText | css=.text-capitalize | Market Buy');
		assert(await driver.findElement(By.css('.text-capitalize')).getText() == 'Market Buy');
		console.log(' 14 | click | css=.notification-content-information > .d-flex:nth-child(2) | ');
		await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2)')).click();
		console.log(' 15 | verifyText | css=.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2) | 1 XHT');
		assert(await driver.findElement(By.css('.notification-content-information > .d-flex:nth-child(2) > .f-1:nth-child(2)')).getText() == '1 XHT');
		console.log(' 16 | click | css=.d-flex > .holla-button:nth-child(3) | ');
		await driver.findElement(By.css('.d-flex > .holla-button:nth-child(3)')).click();
		hollaTime.Hollatimestampe();
		console.log('Timestamp : '+String(hollaTime.GetHollatimestampe()));
		console.log(' 17 | click | css=.trade-col_action_wrapper > .f-1 | ');
		await sleep(3000);
		await driver.findElement(By.css('.trade-col_action_wrapper > .f-1')).click();
		await sleep(3000);
		console.log(' 18 | storeText | css=.accordion_section:nth-child(1) .wallet_section-title-amount | USDTAFTER');
		vars['USDTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(1) .wallet_section-title-amount')).getText();
		let USDTAmountAfter = parseFloat(vars['USDTAFTER']);
		console.log(vars['USDTAFTER'],typeof USDTAmountAfter,String(USDTAmountAfter));
		//console.log(' 20 | click | css=.accordion_section:nth-child(2) > .accordion_section_title | ');
   	//await driver.findElement(By.css('.accordion_section:nth-child(2) > .accordion_section_title')).click();
		console.log(' 19 | storeText | css=.accordion_section--open > .wallet_section-title-amount | XHTAFTER');
		vars['XHTAFTER'] = await driver.findElement(By.css('.accordion_section:nth-child(2) .wallet_section-title-amount')).getText();
		let XHTAmountAfter = parseFloat(vars['XHTAFTER']);
		console.log(' 20 echo | ${XHTAFTER} | ');
		console.log(vars['XHTAFTER'],typeof XHTAmountAfter,String(XHTAmountAfter));
		console.log(vars['XHTAFTER']+' - '+vars['XHT AMOUNT'],String(XHTAmountBefore - XHTAmountAfter));
		console.log(vars['USDTAFTER']+' - '+vars['USDT AMOUNT'], String(USDTAmountBefore - USDTAmountAfter));

  
	
		await driver.get(website + 'transactions' );
		await driver.manage().window().maximize() ;
		await sleep(10000);
		//await driver.findElement(By.css(".trade_block-wrapper:nth-child(2) .action_notification-text")).click()
   
		// 2 | click | css=.table_body-row:nth-child(1) > td:nth-child(7) | 
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).click()
		// 3 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(7) | timestamp
		vars['timestamp'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(7)')).getText()
		// 4 | click | css=.table_body-row:nth-child(1) > .text-uppercase | 
		await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).click()
		// 5 | storeText | css=.table_body-row:nth-child(1) > .text-uppercase | Pair
		vars['Pair'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > .text-uppercase')).getText()
		// 6 | click | css=.table_body-row:nth-child(1) | 
		await driver.findElement(By.css('.table_body-row:nth-child(1)')).click()
		// 7 | storeText | css=.table_body-row:nth-child(1) .buy | side
		vars['side'] = await driver.findElement(By.css('.table_body-row:nth-child(1) .buy')).getText()
		// 8 | click | css=.table_body-row:nth-child(1) > td:nth-child(3) | 
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).click()
		// 9 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(3) | size
		vars['size'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(3)')).getText()
		// 10 | click | css=.table_body-row:nth-child(1) > td:nth-child(4) | 
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).click()
		// 11 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(4) | price
		vars['price'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(4)')).getText()
		// 12 | click | css=.table_body-row:nth-child(1) > td:nth-child(5) | 
		await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).click()
		// 13 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(5) | amount
		vars['amount'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(5)')).getText()
		// 14 | click | css=.table_body-row:nth-child(1) | 
		await driver.findElement(By.css('.table_body-row:nth-child(1)')).click()
		// 15 | storeText | css=.table_body-row:nth-child(1) > td:nth-child(6) | fee
		vars['fee'] = await driver.findElement(By.css('.table_body-row:nth-child(1) > td:nth-child(6)')).getText()
		// 16 | echo | ${Pair},${timestamp},${side},${size},${price},${amount},${fee}}} | 
		console.log(vars['Pair'],vars['timestamp'],vars['side'],vars['size'],vars['price'],vars['amount'],vars['fee'])
		expect(vars['timestamp']).to.equal(hollaTime.GetHollatimestampe());
	});
  
//	});
});



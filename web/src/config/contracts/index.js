import Main from 'config/contracts/Main.json';
import Token from 'config/contracts/Token.json';
import Web3 from 'web3';

export const CONTRACT_ADDRESSES = {
	xht: {
		main: '0xa324C864A04c88ABAB2dE0d291B96D3cD9a17153',
		token: '0xf0D641A2f02cA52ec56d0791BC79f68da2C772A9',
	},
};

export const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

export const generateContracts = (contractsObject, web3) => {
	const contracts = {};
	Object.entries(contractsObject).forEach(([key, { token, main }]) => {
		contracts[key] = {
			token: new web3.eth.Contract(Token.abi, token),
			main: new web3.eth.Contract(Main.abi, main),
		};
	});
	return contracts;
};

export const CONTRACTS = generateContracts(CONTRACT_ADDRESSES, web3);

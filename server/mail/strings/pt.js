'use strict';

const { GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const COMMON = {
	GREETING: (name) => `Dear ${name}`,
	CLOSING: {
		1: 'Saudações',
		2: () => `${API_NAME()} equipe`
	},
	IP_ADDRESS: (ip) => `Endereço de IP: ${ip}`,
	IP_REQUEST_FROM: (ip) => ` Solicitação iniciada em: ${ip}`,
	TXID: (txid) => ` ID da transação: ${txid}`,
	FEE: (fee) => `Taxa: ${fee}`,
	AMOUNT: (amount) => ` Quantia: ${amount} `,
	ADDRESS: (address) => `Endereço: ${address}`,
	TIME: (time) => `Hora: ${time}`,
	COUNTRY: (country) => `País: ${country}`,
	DEVICE: (device) => `Dispositivo: ${device}`,
	MESSAGE: (message) => ` Mensagem: ${message}`,
	ERROR_REQUEST:
		'Se esta solicitação foi feita por engano, gentileza ignorá-la; nenhuma alteração será feita em sua conta.',
	EXPLORER:
		'Você pode ver o status de sua transação no blockchain através destes Block Explorers:',
	DEPOSIT: 'Depósito',
	WITHDRAWAL: 'Saque'
};

const FOOTER = {
	FOLLOW_US: 'Siga-nos no',
	NEED_HELP: 'Preciso de ajuda? Basta responder a este e-mail ',
	PRIVACY_POLICY: 'Política de Privacidade',
	TERMS: 'Termos e Condições',
	INVITE_YOUR_FRIENDS: 'Convide seus amigos',
	POWERED_BY: 'Powered by'
};

const ALERT = {
	TITLE: (title) => `ALERTA: ${title}`,
	BODY: {
		1: (type) => `Alerta: ${type}`
	}
};

const CONTACTFORM = {
	TITLE: 'Formulário de Contato',
	BODY: {
		1: 'Dados do formulário de contato',
		2: (email) =>
			`O cliente com e-mail ${email} enviou o formulário de contato.`,
		3: (data) => `${JSON.stringify(data, null, 2)}`
	}
};

const SMS = {
	verificationCode: (code) =>
		` Seu código de verificação é ${code}`
	,
	deposit: (currency, amount) =>
		`Seu depósito de ${currency.toUpperCase()} no valor ${amount} foi confirmado e depositado em sua carteira`
	,
	withdrawal: (currency, amount) =>
		`Seu saque de ${currency.toUpperCase()} no valor ${amount} foi confirmado`
};

const INVITEDOPERATOR = {
	TITLE: 'Convite do Operador',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		CREATED: {
			1: (role, invitingEmail) => `Você foi convidado como operador de ${API_NAME()} com a função de ${role} pelo usuário ${invitingEmail}.`,
			2: 'Segue abaixo sua senha temporária. Altere sua senha após o login para fins de segurança.',
			3: (email) => `Email: ${email}`,
			4: (password) => `Senha: ${password}`,
			5: 'Login'
		},
		EXISTING: {
			1: (role, invitingEmail) => `Sua conta ${API_NAME()} foi atualizada para a função de ${role} pelo usuário ${invitingEmail}.`,
			2: 'Login'
		}
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSIT = {
	TITLE: (currency) => `${currency.toUpperCase()} ${COMMON.DEPOSIT}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, confirmation = 1, currency) =>
			` Você tem um novo depósito de ${amount} ${currency.toUpperCase ()} pendente em sua carteira ${API_NAME ()}. Aguarde até que a transação seja confirmada e seus fundos estejam disponíveis em sua carteira. Sua transação requer ${confirmation} confirmação ou confirmações no blockchain.`,
		COMPLETED: (amount, confirmation, currency) =>
			` Seu ${currency.toUpperCase ()} O depósito de ${amount} ${currency.toUpperCase ()} foi confirmado e concluído e está disponível em sua ${currency.toUpperCase ()} carteira.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (status) => `Status: ${status}`,
		3: (address) => COMMON.ADDRESS(address),
		4: (txid) => COMMON.TXID(txid),
		5: (network) => `Network: ${network}`,
		6: (fee) => COMMON.FEE(fee),
		7: (description) => `Description: ${description}`,
		8: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWAL = {
	TITLE: (currency) =>
		`${currency.toUpperCase()} ${COMMON.WITHDRAWAL}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: (amount, address, currency) =>
			`Você fez uma solicitação de saque de $ amount} ${currency.toUpperCase()} para o endereço $ {address}. Seu status de retirada está pendente e será processado em breve.`,
		COMPLETED: (amount, address, currency) =>
			`Sua solicitação de saque de ${amount} ${currency.toUpperCase()} foi processada e transferida para o endereço $ {address}.`,
		1: (amount, currency) => `${COMMON.AMOUNT(amount)} ${currency.toUpperCase()}`,
		2: (fee) => COMMON.FEE(fee),
		3: (status) => `Status: ${status}`,
		4: (address) => COMMON.ADDRESS(address),
		5: (txid) => COMMON.TXID(txid),
		6: (network) => `Network: ${network}`,
		7: (description) => `Description: ${description}`,
		8: COMMON.EXPLORER
	},
	CLOSING: COMMON.CLOSING
};

module.exports = {
	FOOTER,
	COMMON,
	ALERT,
	SMS,
	INVITEDOPERATOR,
	CONTACTFORM,
	DEPOSIT,
	WITHDRAWAL
};


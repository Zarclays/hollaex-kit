'use strict';

const COMMON = {
	GREETING: (name) => `${name}님`,
	CLOSING: {
		1: '이용해 주셔서 감사합니다.',
		2: 'HollaEx팀'
	},
	IP_ADDRESS: (ip) => `IP 주소: ${ip}`,
	IP_REQUEST_FROM: (ip) => `요청하신곳: ${ip}`,
	TXID: (txid) => `거래 ID 확인: ${txid}`,
	FEE: (fee) => `수수료: ${fee}`,
	AMOUNT: (amount) => `금액: ${amount}`,
	TIME: (time) => `시간: ${time}`,
	COUNTRY: (country) => `국가: ${country}`,
	DEVICE: (device) => `브라우저: ${device}`,
	MESSAGE: (message) => `메세지: ${message}`,
	ERROR_REQUEST:
		'만약 이 요청을 원하지 않는다면, 회원님의 계정에는 변경사항이 없으니 본 메일을 무시해 주시기 바랍니다.',
	EXPLORER: '회원님이 요청하신 거래 상황을 이곳에서 확인하실 수 있습니다.',
	DEPOSIT: '입금',
	WITHDRAWAL: '출금',
	EUR: '유로',
	BTC: '비트코인',
	ETH: '이더리움',
	BCH: '비트코인캐시',
	XRP: '리플'
};

const FOOTER = {
	FOLLOW_US: 'Follow us on',
	NEED_HELP: '도움이 필요하시다면, 이 이메일에 회신해 주시기 바랍니다.',
	EXIR: 'HollaEx',
	BITHOLLA: '비트홀라',
	PRIVACY_POLICY: '개인정보 처리방침',
	TERMS: '이용약관',
	INVITE_YOUR_FRIENDS: '친구 초대:',
	POWERED_BY: 'Powered by'
};

const SIGNUP = {
	TITLE: '회원가입',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: `안녕하세요. HollaEx에 가입해주셔서 감사합니다.
		해당 부서에서 최대한 빠르게 회원님의 신청서를 검토 한 후 연락드리겠습니다.
		문의사항은 <a href="mailto:support@bitholla.com">support@bitholla.com</a> 로 연락주시기 바랍니다.`,
		2: '아래 버튼을 클릭하여 등록 절차를 진행하시기 바랍니다.',
		3: '나의 계정 활성화'
	},
	CLOSING: COMMON.CLOSING
};

const WELCOME = {
	TITLE: '환영합니다',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: '누구나 빠르고 쉬운 거래가 가능한 가상화폐거래소 HollaEx를 이용해주셔서 감사합니다.',
		2: (account, deposit) => `
			거래를 시작하기 위해선 먼저, 비트코인 또는 현금을 계좌에 입금하여야 합니다.
			${account} 페이지로 이동하여 ${deposit} 페이지를 방문해주시기 바랍니다.`,
		3: '계정',
		4: '입금',
		5: '문의사항은 support@bitholla.com 로 문의해주시기 바랍니다.'
	},
	CLOSING: COMMON.CLOSING
};

const LOGIN = {
	TITLE: '로그인',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: '회원님의 계정에 대한 로그인 정보가 아래와 같이 기록되어 있습니다',
		2: (time) => COMMON.TIME(time),
		3: (country) => COMMON.COUNTRY(country),
		4: (device) => COMMON.DEVICE(device),
		5: (ip) => COMMON.IP_ADDRESS(ip),
		6: '본인이 아닌 경우, HollEx에 방문하여 비밀번호 변경 및 이중인증 보안을 설정하시고 즉시, 회신하여 저희에게 문의해주시기 바랍니다.'
	},
	CLOSING: COMMON.CLOSING
};

const RESETPASSWORD = {
	TITLE: '비밀번호 재설정 요청',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: '회원님의 계정에 대한 비밀번호 재설정을 요청하셨습니다.',
		2: '아래 링크를 클릭하여 비밀번호 업데이트를 진행하시기 바랍니다.',
		3: '비밀번호 재설정',
		4: COMMON.ERROR_REQUEST,
		5: (ip) => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSIT = {
	TITLE: (currency) => `${COMMON[currency.toUpperCase()]} ${COMMON.DEPOSIT}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		PENDING: {
			1: (amount, confirmation = 1, currency) =>
				`회원님의 HollaEx 지갑으로 ${amount} ${currency} 입금이 진행 중입니다. 거래가 승인되고 지갑에 자금이 입금될 때까지 기다려주십시오. 회원님의 거래에는 비트코인 블록체인 상 ${confirmation} 개의 승인이 요구됩니다.`,
			2: (amount, currency) => `수량: ${amount} ${currency}`,
			3: '입금 상태: 비트코인 거래 승인 대기중입니다.',
			4: (txid) => COMMON.TXID(txid),
			5: COMMON.EXPLORER
		},
		COMPLETED: (amount, currency) =>
			`회원님의 ${amount} BTC 입금이 완료되었습니다. 회원님의 ${
				COMMON[currency.toUpperCase()]
			} 지갑에서 확인 및 이용하실 수 있습니다.`
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTVERIFY = {
	TITLE: '계정 인증완료',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: '축하합니다. 회원님의 신원이 확인되어 계정이 승급되었습니다. 이제 거래를 시작하기 위한 모든 준비가 되었습니다.',
		2: '거래하기'
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTUPGRADE = {
	TITLE: '계정 업그레이드완료',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (level) =>
			`축하합니다. 회원님의 계정이 레벨 ${level} 로 업그레이드 되었습니다. 이제 더 낮은 수수료와 높아진 출금한도를 비롯한 다른 프리미엄 혜택을 받으실 수 있습니다.`,
		2: '거래하기'
	},
	CLOSING: COMMON.CLOSING
};

const DEPOSITCANCEL = {
	TITLE: (currency, type) =>
		`${COMMON[currency.toUpperCase()]} ${
			COMMON[type.toUpperCase()]
		} rejected`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		DEPOSIT: (currency, date, amount) =>
			`회원님이 ${date}에 ${amount}의 ${currency} 을 입금하신 내역을 찾을 수 없거나 처리 할 수 없습니다. 해당 거래는 시스템에 의해 거부되었습니다.`,
		WITHDRAWAL: (currency, date, amount) =>
			`회원님이 ${date}에 ${amount}의 ${currency} 을 출금하신 내역을 찾을 수 없거나 처리 할 수 없습니다. 해당 거래는 시스템에 의해 거부되었으며, 보류중인 회원님의 출금금액이 HollaEx 지갑으로 환불됩니다.`,
		1: '추가 문의 사항이 있으시다면 이 이메일에 회신해주시기 바랍니다.',
		2: (txid) => COMMON.TXID(txid),
		3: (amount) => COMMON.AMOUNT(amount),
		4: '상태 : 거절됨'
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWAL = {
	TITLE: (currency) =>
		`${COMMON[currency.toUpperCase()]} ${COMMON.WITHDRAWAL}`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		FIAT: {
			PENDING: (amount) =>
				`회원님의 ${amount} 유로 출금이 요청되었습니다. 출금 대기 중이며, 곧 완료될 예정입니다.`,
			COMPLETED: (amount) =>
				`회원님의 ${amount} 유로 출금이 완료되어 회원님의 계좌로 이체되었습니다.`,
			1: (amount) => COMMON.AMOUNT(amount),
			2: (txid) => COMMON.TXID(txid)
		},
		COIN: {
			1: (amount, address, currency) =>
				`회원님은 ${amount} ${currency}를 해당 주소 ${address}로 출금하였습니다.`,
			2: (txid) => COMMON.TXID(txid),
			3: COMMON.EXPLORER
		},
		FEE: (fee) => COMMON.FEE(fee)
	},
	CLOSING: COMMON.CLOSING
};

const WITHDRAWALREQUEST = {
	TITLE: (currency) =>
		`${COMMON[currency.toUpperCase()]} ${COMMON.WITHDRAWAL} 요청`,
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (currency, amount, address) =>
			`회원님은 ${address} 로 ${amount} 의 ${currency}을 출금요청하였습니다.`,
		2: (amount) => COMMON.AMOUNT(amount),
		3: (fee) => COMMON.FEE(fee),
		4: (address) => `주소: ${address}`,
		5: '출금 요청을 완료하시려면 아래버튼을 클릭해주시기 바랍니다.',
		6: '완료',
		7: COMMON.ERROR_REQUEST,
		8: (ip) => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
};

const USERVERIFICATIONREJECT = {
	TITLE: (type) =>
		type === 'id' ? 'ID 인증 거절' : '새로운 은행정보 등록 거절',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: (type) =>
			type === 'id'
				? '회원님의 ID 인증을 진행하였으나 거절되었습니다. 아래의 메세지를 참고하여 추가 조치를 취해주시기 바랍니다:'
				: '회원님의 새로운 은행정보 등록이 진행되었으나 거절되었습니다. 아래의 메세지를 참고하여 추가 조치를 취해주시기 바랍니다:',
		2: (message) => COMMON.MESSAGE(message)
	},
	CLOSING: COMMON.CLOSING
};

const CONTACTFORM = {
	TITLE: '문의 양식',
	BODY: {
		1: 'Contact Form Data',
		2: (email) =>
			`The client with email ${email} has submitted the contact form.`,
		3: (data) => `${JSON.stringify(data, null, 2)}`
	}
};

const USERVERIFICATION = {
	TITLE: '사용자 확인',
	BODY: {
		1: 'User Verification Required',
		2: (email) =>
			`User "${email}" uploaded his documents for verification. Please verify his documents.`
	}
};

const DEPOSITDOUBLESPENT = {
	TITLE: '이중 지출',
	BODY: {
		1: 'Double spent transaction',
		2: (email) =>
			`The client with email ${email} has received a BTC deposit that is double spent.`,
		3: (txid) => COMMON.TXID(txid),
		4: 'Transaction data:',
		5: (data) => `${JSON.stringify(data)}`
	}
};

const SMS = {
	verificationCode: (code) =>
		`Your verification code is ${code}`
	,
	deposit: (currency, amount) =>
		`Your ${currency} deposit for amount ${amount} is confirmed and deposited to your wallet`
	,
	withdrawal: (currency, amount) =>
		`Your ${currency} withdrawal for amount ${amount} is confirmed`
};

module.exports = {
	FOOTER,
	COMMON,
	SIGNUP,
	WELCOME,
	LOGIN,
	RESETPASSWORD,
	DEPOSIT,
	ACCOUNTVERIFY,
	ACCOUNTUPGRADE,
	USERVERIFICATIONREJECT,
	DEPOSITCANCEL,
	WITHDRAWAL,
	WITHDRAWALREQUEST,
	USERVERIFICATION,
	DEPOSITDOUBLESPENT,
	CONTACTFORM,
	SMS
};

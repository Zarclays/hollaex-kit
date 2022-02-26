'use strict';

const { Button } = require('./helpers/common');
const { GET_EMAIL, GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['CONFIRMEMAIL']) {
		const stringDynamic = emailConfigurations[language]['CONFIRMEMAIL'];
		return {
			html: htmlDynamic(email, data, language, domain, stringDynamic),
			text: textDynamic(email, data, language, domain, stringDynamic)
		};
	}
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
	const CONFIRMEMAIL = require('../strings').getStringObject(language, 'CONFIRMEMAIL');
	return `
	<div>
		<p>
		${CONFIRMEMAIL.GREETING(email)}
		</p>
		<p>
		${CONFIRMEMAIL.BODY[1]}<br />
		<p style="font-size: 1.2rem; text-align: center;">
        ${CONFIRMEMAIL.BODY[2](data.code)}
        </p>
		${CONFIRMEMAIL.BODY[3]}
		</p>
		<p>
		${CONFIRMEMAIL.CLOSING[1]}<br />
		${CONFIRMEMAIL.CLOSING[2]()}
		</p>
	</div>
	`;
};

const text = (email, data, language, domain) => {
	const link = `${domain}/reset-password/${data.code}`;
	const RESETPASSWORD = require('../strings').getStringObject(language, 'RESETPASSWORD');
	return `
	${RESETPASSWORD.GREETING(email)}.
	${RESETPASSWORD.BODY[1]}
	${RESETPASSWORD.BODY[2]}
	${RESETPASSWORD.BODY[3]}(${link})
	${RESETPASSWORD.BODY[4]}
	${RESETPASSWORD.BODY[5](data.ip)}
	${RESETPASSWORD.CLOSING[1]}
	${RESETPASSWORD.CLOSING[2]()}
	`;
};

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	const link = `${domain}/reset-password/${data.code}`;
	const RESETPASSWORD = require('../strings').getStringObject(language, 'RESETPASSWORD');
	return `
    <div>
      <p>
        ${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : RESETPASSWORD.GREETING(email)}
      </p>
      <p>
        ${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1] : RESETPASSWORD.BODY[1]}<br />
        ${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2] : RESETPASSWORD.BODY[2]}<br />        
      </p>
      ${Button(link, (stringDynamic.BODY && stringDynamic.BODY[3]) ? stringDynamic.BODY[3] : RESETPASSWORD.BODY[3])}
      <p>
         ${(stringDynamic.BODY && stringDynamic.BODY[4]) ? stringDynamic.BODY[4] : RESETPASSWORD.BODY[4]}
      </p>
      <p>
        ${(stringDynamic.BODY && stringDynamic.BODY[5]) ? stringDynamic.BODY[5].format(data.ip) : RESETPASSWORD.BODY[5](data.ip)}
      </p>
      <p>
      	${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : RESETPASSWORD.CLOSING[1]}<br />
        	${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : RESETPASSWORD.CLOSING[2]()}
      </p>
    </div>
  `;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	const link = `${domain}/reset-password/${data.code}`;
	const RESETPASSWORD = require('../strings').getStringObject(language, 'RESETPASSWORD');
	return `
    ${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : RESETPASSWORD.GREETING(email)}.
    ${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1] : RESETPASSWORD.BODY[1]}
    ${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2] : RESETPASSWORD.BODY[2]}
    ${(stringDynamic.BODY && stringDynamic.BODY[3]) ? stringDynamic.BODY[3] : RESETPASSWORD.BODY[3]}(${link})
	 ${(stringDynamic.BODY && stringDynamic.BODY[4]) ? stringDynamic.BODY[4] : RESETPASSWORD.BODY[4]}
	 ${(stringDynamic.BODY && stringDynamic.BODY[5]) ? stringDynamic.BODY[5].format(data.ip) : RESETPASSWORD.BODY[5](data.ip)}
	 ${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : RESETPASSWORD.CLOSING[1]} ${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : RESETPASSWORD.CLOSING[2]()}
  `;
};

module.exports = fetchMessage;

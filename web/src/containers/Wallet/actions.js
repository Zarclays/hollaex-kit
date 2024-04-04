import querystring from 'query-string';
import { requestAuthenticated } from 'utils';

export const fetchBalanceHistory = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/user/balance-history?${queryValues}`);
};

export const fetchPlHistory = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/user/balance-pl?${queryValues}`);
};

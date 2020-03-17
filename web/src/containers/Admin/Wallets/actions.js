import { WS_URL } from '../../../config/constants';
import { requestAuthenticated } from '../../../utils';

export const requestTotalBalance = () => requestAuthenticated('/admin/stats');

export const requestEthSweep = (value) =>
	requestAuthenticated(`/admin/eth/sweep?wallets=${value}`);

export const requestConstants = () =>
	requestAuthenticated('/admin/constant');

export const connectVault = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values)
	};
	
	return requestAuthenticated('/plugins/vault/connect', options, null, WS_URL);
};

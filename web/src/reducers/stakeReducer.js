import {
	SET_ACCOUNT,
	SET_BLOCKCHAIN_DATA,
	SET_CURRENT_BLOCK,
	SET_STAKABLES,
	SET_PERIODS,
	SET_USER_STAKES,
} from 'actions/stakingActions';

const initialStakable = {
	symbol: 'xht',
	available: '',
	total: '',
	rate: '',
	earnings: '',
};

const initialState = {
	account: '',
	network: '',
	currentBlock: '',
	stakables: [initialStakable],
	periods: {},
	userStakes: {},
	balance: 0,
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case SET_ACCOUNT:
		case SET_BLOCKCHAIN_DATA:
		case SET_CURRENT_BLOCK:
		case SET_STAKABLES:
		case SET_PERIODS:
		case SET_USER_STAKES:
			return { ...state, ...payload };

		default:
			return state;
	}
};

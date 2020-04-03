
import { APP_TITLE } from '../../config/constants';

export const PATHS = [
	{
		path: '/admin',
		// component: Main,
		label: APP_TITLE.toUpperCase(),
		routeKey: 'main'
	},
	{
		path: '/admin/user',
		// component: User,
		label: 'User',
		routeKey: 'user'
	},
	{
		path: '/admin/wallets',
		// component: Wallets,
		label: 'Wallets',
		hideIfSupport: true,
		hideIfSupervisor: true,
		hideIfKYC: true,
		routeKey: 'wallets'
	},
	{
		path: '/admin/deposits',
		// component: Deposits,
		label: 'Deposits',
		hideIfSupport: true,
		hideIfKYC: true,
		hideIfSupervisor: false,
		pathProps: {
			type: 'deposit',
			showFilters: true
		},
		routeKey: 'deposit'
	},
	{
		path: '/admin/withdrawals',
		// component: Deposits,
		label: 'Withdrawals',
		pathProps: {
			type: 'withdrawal',
			showFilters: true
		},
		hideIfSupport: true,
		hideIfKYC: true,
		hideIfSupervisor: false,
		routeKey: 'withdrawal'
	},
	{
		path: '/admin/activeorders',
		label: 'Active Orders',
		hideIfSupport: true,
		hideIfKYC: true,
		hideIfSupervisor: true,
		routeKey: 'orders'
	},
	{
		path: '/admin/pair',
		// component: UserFees,
		label: 'Trading Pairs',
		hideIfSupport: true,
		hideIfKYC: true,
		hideIfSupervisor: true,
		routeKey: 'pair'
	},
	{
		path: '/admin/coin',
		// component: Limits,
		label: 'Coins',
		hideIfSupport: true,
		hideIfKYC: true,
		hideIfSupervisor: true,
		routeKey: 'coin'
	},
	// {
	// 	path: '/admin/chat',
	// 	// component: Chat,
	// 	label: 'Chat',
	// 	hideIfSupport: false,
	// 	hideIfKYC: true,
	// 	hideIfSupervisor: false,
	// 	routeKey: 'Chat'
	// },
	// {
	// 	path: '/admin/blockchain',
	// 	// component: BlockchainTransaction,
	// 	label: 'Vault',
	// 	routeKey: 'blockChain'
	// },
	{
		path: '/admin/broker',
		label: 'Broker',
		routeKey: 'broker'
	},
	{
		path: '/admin/plugins',
		// component: BlockchainTransaction,
		label: 'Plugins',
		routeKey: 'plugins'
	},
	{
		path: '/admin/settings',
		// component: BlockchainTransaction,
		label: 'Settings',
		routeKey: 'settings'
	},
];

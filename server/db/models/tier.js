'use strict';

module.exports = function (sequelize, DataTypes) {
	const Tier = sequelize.define(
		'Tier',
		{
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			icon: {
				type: DataTypes.STRING,
				defaultValue: ''
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false
			},
			fees: {
				type: DataTypes.JSONB,
				defaultValue: {}
			},
			note: {
				type: DataTypes.STRING,
				defaultValue: ''
			},
			deposit_limit: {
				type: DataTypes.DOUBLE,
				defaultValue: 0
			},
			withdrawal_limit: {
				type: DataTypes.DOUBLE,
				defaultValue: 0
			},
			native_currency_limit: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			}
		},
		{
			underscored: true,
			tableName: 'Tiers'
		}
	);

	return Tier;
};

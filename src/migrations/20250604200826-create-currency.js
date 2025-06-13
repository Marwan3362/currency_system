'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('currencies', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    code: {
      type: Sequelize.STRING(10),
      allowNull: false,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name_ar: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    symbol: {
      type: Sequelize.STRING(10),
      allowNull: true,
    },
    exchange_rate: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 1,
    },
    buy_rate: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    sell_rate: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    custom_rate: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('currencies');
};

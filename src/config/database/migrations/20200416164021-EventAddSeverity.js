'use strict';

const { Sequelize } = require('sequelize'); // eslint-disable-line

module.exports = {
    up: queryInterface => {
        return queryInterface
            .addColumn('events', 'severity', {
                type: Sequelize.NUMBER,
                allowNull: true,
            })
            .catch(error => {
                queryInterface.changeColumn('events', 'severity', {
                    type: Sequelize.NUMBER,
                    allowNull: true,
                });
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('events', 'severity').catch(error => {
            console.log(error);
        });
    },
};

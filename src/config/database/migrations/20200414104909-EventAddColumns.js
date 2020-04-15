'use strict';

import { Sequelize } from 'sequelize';

module.exports = {
    up: queryInterface => {
        return queryInterface
            .addColumn('events', 'application', {
                type: Sequelize.STRING,
                allowNull: true,
            })
            .catch(error => {
                queryInterface.changeColumn('events', 'application', {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            })
            .then(() => {
                queryInterface
                    .addColumn('events', 'category', {
                        type: Sequelize.STRING,
                        allowNull: true,
                    })
                    .catch(error => {
                        queryInterface.changeColumn('events', 'category', {
                            type: Sequelize.STRING,
                            allowNull: true,
                        });
                    });
            });
    },

    down: queryInterface => {
        return queryInterface
            .addColumn('events', 'application')
            .then(() => {
                queryInterface.addColumn('events', 'category');
            })
            .catch(error => {
                console.log(error);
            });
    },
};

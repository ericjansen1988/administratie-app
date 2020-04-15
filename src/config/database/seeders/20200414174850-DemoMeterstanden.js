'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('meterstanden', [
            {
                '180': 0,
                '181': 0,
                '182': 0,
                '280': 0,
                '281': 0,
                '282': 0,
                datetime: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                userId: 'fkkdEvpjgkhlhtQGqdkHTToWO233',
            },
        ]);
    },

    down: queryInterface => {
        return queryInterface.bulkDelete('meterstanden', null, {});
    },
};

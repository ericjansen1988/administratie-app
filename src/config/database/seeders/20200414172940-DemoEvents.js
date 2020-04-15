'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert('events', [
            {
                datetime: new Date(),
                userId: 'fkkdEvpjgkhlhtQGqdkHTToWO233',
                application: 'TestApp',
                category: 'Error',
                value: 'TestApp has generated an error',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                datetime: new Date(),
                userId: 'fkkdEvpjgkhlhtQGqdkHTToWO233',
                application: 'TestApp',
                category: 'Event',
                value: 'TestApp has generated an error',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                datetime: new Date(),
                userId: 'fkkdEvpjgkhlhtQGqdkHTToWO233',
                application: 'TestApp',
                category: 'Error',
                value: 'TestApp has generated an error',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                datetime: new Date(),
                userId: 'fkkdEvpjgkhlhtQGqdkHTToWO233',
                application: 'TestApp',
                category: 'Error',
                value: 'TestApp has generated an error',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                datetime: new Date(),
                userId: 'fkkdEvpjgkhlhtQGqdkHTToWO233',
                application: 'TestApp',
                category: 'Error',
                value: 'TestApp has generated an error',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                datetime: new Date(),
                userId: 'fkkdEvpjgkhlhtQGqdkHTToWO233',
                application: 'TestApp',
                category: 'Error',
                value: 'TestApp has generated an error',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: queryInterface => {
        return queryInterface.bulkDelete('events', null, {});
    },
};

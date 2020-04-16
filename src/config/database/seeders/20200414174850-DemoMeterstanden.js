'use strict';

const fs = require('fs'); //eslint-disable-line
const moment = require('moment'); // eslint-disable-line
const content = fs.readFileSync(__dirname + '/meter_readings.json');
const meterstanden = JSON.parse(content);

const date = moment().startOf('hour');
date.add(-(meterstanden.length * 5), 'minutes');

for (const meterstand of meterstanden) {
    meterstand.datetime = date.toDate();
    meterstand.updatedAt = new Date();
    meterstand.createdAt = new Date();
    date.add(5, 'minutes');
}

module.exports = {
    up: async queryInterface => {
        return queryInterface.bulkInsert('meterstanden', meterstanden);
    },

    down: queryInterface => {
        return queryInterface.bulkDelete('meterstanden', null, {});
    },
};

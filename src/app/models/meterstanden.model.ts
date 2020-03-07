import moment from 'moment';
import { Model, DataTypes } from 'sequelize';

import db from './index';

export default class Meterstand extends Model {
    public datetime: Date;
    public userId: string;
    public value: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Meterstand.init(
    {
        datetime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            get(this: Meterstand): Date {
                return moment(this.getDataValue('datetime'))
                    .tz('Europe/Amsterdam')
                    .toDate();
            },
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        180: {
            type: DataTypes.STRING,
        },
        181: {
            type: DataTypes.STRING,
        },
        182: {
            type: DataTypes.STRING,
        },
        280: {
            type: DataTypes.STRING,
        },
        281: {
            type: DataTypes.STRING,
        },
        282: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: 'meterstanden',
        sequelize: db.sequelize,
    },
);
/*
module.exports = (sequelize, Sequelize) => {
    const meterstanden = sequelize.define(
        'meterstanden',
        {
            datetime: {
                type: Sequelize.DATE,
                get: function() {
                    return Moment(this.getDataValue('datetime')).tz('Europe/Amsterdam'); //.format('YYYY-MM-DD HH:mm:ss');
                },
            },
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            180: {
                type: Sequelize.STRING,
            },
            181: {
                type: Sequelize.STRING,
            },
            182: {
                type: Sequelize.STRING,
            },
            280: {
                type: Sequelize.STRING,
            },
            281: {
                type: Sequelize.STRING,
            },
            282: {
                type: Sequelize.STRING,
            },
        },
        {
            tableName: 'meterstanden',
        },
    );

    return meterstanden;
};
*/

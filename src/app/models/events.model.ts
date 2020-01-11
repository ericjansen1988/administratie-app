import moment from 'moment';
import { Model, DataTypes } from 'sequelize';

import db from './index';

export default class Event extends Model {
    public datetime: Date;
    public userId: string;
    public application: string;
    public category: string;
    public value: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Event.init(
    {
        datetime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            get(this: Event): Date {
                return moment(this.getDataValue('datetime'))
                    .tz('Europe/Amsterdam')
                    .toDate();
            },
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        application: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'events',
        sequelize: db.sequelize,
    },
);

/*
module.exports = (sequelize, Sequelize) => {
    const Event = sequelize.define(
        'events',
        {
            datetime: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                get: function() {
                    return moment(this.getDataValue('datetime')).tz('Europe/Amsterdam');
                },
            },
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            application: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            category: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            value: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        },
        {
            scopes: {
                last_week: {
                    where: {
                        datetime: {
                            $gte: moment()
                                .subtract(7, 'days')
                                .toDate(),
                        },
                    },
                },
            },
        },
    );

    return Event;
};
*/

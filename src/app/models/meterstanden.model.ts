import moment from 'moment';
import { Model, DataTypes } from 'sequelize';

import Sequelize from './index';

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
            unique: 'compositeIndex',
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'compositeIndex',
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
        sequelize: Sequelize,
    },
);

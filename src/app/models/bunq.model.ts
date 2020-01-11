import { Model, DataTypes } from 'sequelize';
import Encryption from 'simple-encrypt-js';
const encryption = new Encryption();
const key = process.env.SEQUELIZE_ENCRYPTION_KEY;

import db from './index';

export default class Bunq extends Model {
    public userId: string;
    public access_token: string;
    public encryption_key: string;
    public environment: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Bunq.init(
    {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        access_token: { // eslint-disable-line
            type: DataTypes.STRING,
            set(this: Bunq, val: string): void {
                //const encrypted = encryption.encryptString(val, key);
                //this.setDataValue('access_token', encrypted.iv + '~' + encrypted.encryptedString);
                this.setDataValue('access_token', encryption.getEncryptionString(val, key));
            },
            get(this: Bunq): string {
                //const val = this.getDataValue('access_token');
                //return (val === undefined || val === null) ? null : encryption.decryptString(val.split('~')[1], key, val.split('~')[0])
                return encryption.getEncryptionValue(this.getDataValue('access_token'), key);
            },
        },
        encryption_key: { // eslint-disable-line
            type: DataTypes.STRING,
            set(this: Bunq, val: string): void {
                this.setDataValue('encryption_key', encryption.getEncryptionString(val, key));
            },
            get(this: Bunq): string {
                return encryption.getEncryptionValue(this.getDataValue('encryption_key'), key);
            },
        },
        environment: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: 'bunq',
        sequelize: db.sequelize,
    },
);

//import { encryption } from '../modules/Encryption';

/*
module.exports = (sequelize, Sequelize) => {
    const Bunq = sequelize.define(
        'bunq',
        {
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            access_token: {
                type: Sequelize.STRING(10000),
                set(val) {
                    //const encrypted = encryption.encryptString(val, key);
                    //this.setDataValue('access_token', encrypted.iv + '~' + encrypted.encryptedString);
                    this.setDataValue('access_token', encryption.getEncryptionString(val, key));
                },
                get() {
                    //const val = this.getDataValue('access_token');
                    //return (val === undefined || val === null) ? null : encryption.decryptString(val.split('~')[1], key, val.split('~')[0])
                    return encryption.getEncryptionValue(this.getDataValue('access_token'), key);
                },
            },
            encryption_key: {
                type: Sequelize.STRING(10000),
                set(val) {
                    this.setDataValue('encryption_key', encryption.getEncryptionString(val, key));
                },
                get() {
                    return encryption.getEncryptionValue(this.getDataValue('encryption_key'), key);
                },
            },
            environment: {
                type: Sequelize.STRING,
            },
        },
        {
            tableName: 'bunq',
            allowNull: false,
            // disable the modification of table names; By default, sequelize will automatically
            // transform all passed model names (first parameter of define) into plural.
            // if you don't want that, set the following
            freezeTableName: true,
        },
    );
    return Bunq;
};
*/

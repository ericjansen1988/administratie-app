import dotenv from 'dotenv';
dotenv.config();

type DatabaseConfig = {
    [key: string]: {
        username?: string;
        password?: string;
        database?: string;
        ssl?: boolean;
        dialect: string;
        use_env_variable?: string;
        storage?: string;
        dialectOptions?: {
            ssl: boolean;
        };
    };
};

const databases: DatabaseConfig = {
    development: {
        database: 'mainDB',
        username: '',
        password: '',
        dialect: 'sqlite',
        storage: './database.sqlite',
    },
    test: {
        database: 'mainDB',
        username: '',
        password: '',
        dialect: 'sqlite',
        storage: './database_test.sqlite',
    },
    production: {
        ssl: true,
        // eslint-disable-next-line
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        dialectOptions: {
            ssl: true,
        },
    },
};

export = databases;

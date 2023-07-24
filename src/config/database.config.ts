import {DataSource, DataSourceOptions} from 'typeorm';
import {
    Token,
    TokenPair,
    PairStatus
} from '../database/entities';



export const databaseConfig: DataSourceOptions = {
    type: (process.env.TYPEORM_CONNECTION || 'mongodb') as any,
    url: process.env.TYPEORM_URL || 'localhost',
    ssl: true,
    entities: [
        Token,
        TokenPair,
        PairStatus
    ],
    synchronize: true,
};

const dataSource = new DataSource(databaseConfig);
export default dataSource;
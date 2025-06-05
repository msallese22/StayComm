export { AppDataSource };

import {Stay} from "./entities/stay";

import {DataSource} from "typeorm";
import {Guest} from "./entities/guest";
import {Property} from "./entities/property";
import {Employee} from "./entities/employee";
import {Room} from "./entities/room";
import {CreditCard} from "./entities/credit-card";
import {RatePrice} from "./entities/rate-price";


const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'sallese03staycomm.mysql.database.azure.com',
    port: 3306,
    username: 'msallese01',
    password: 'Shiny!613',
    database: 'StayComm',
    synchronize: false,
    logging: true,
    entities: [Guest, Stay, Property, Room, CreditCard, Employee, RatePrice],
    subscribers: [],
    migrations: [],
    ssl: {rejectUnauthorized: false}

});
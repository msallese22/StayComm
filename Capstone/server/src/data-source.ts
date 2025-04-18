export { AppDataSource };

import {Stay} from "./entities/stay";

import {DataSource} from "typeorm";
import {Guest} from "./entities/guest";
import {Property} from "./entities/property";
import {Employee} from "./entities/employee";
import {Room} from "./entities/room";
import {CreditCard} from "./entities/credit-card";
import {Rate} from "./entities/rate";


const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'michaela',
    password: 'IT243Pwd!',
    database: 'StayComm',
    synchronize: false,
    logging: true,
    entities: [Guest, Stay, Property, Room, CreditCard, Employee, Rate],
    subscribers: [],
    migrations: []
});
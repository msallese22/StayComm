import express, {Express} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {AppDataSource} from "./data-source";
import {Room} from "./entities/room";
import {Stay} from "./entities/stay"
import {CreditCard} from "./entities/credit-card"
import {Guest} from "./entities/guest"
import {Employee} from "./entities/employee"
import {Property} from "./entities/property"
import {Repository} from "typeorm";

const app: Express = express();
const port: number = 3000;

app.use(cors());

app.use(bodyParser.json());//bodyParser--- look at the request, parse it as Json if possible

app.listen(port, () =>
{
    console.log(`Server is listening at http://localhost:${port}`);
});

AppDataSource.initialize()//initializing where the database is to go!
    .then(() =>
    {
        console.log("Data source has been initialized!");
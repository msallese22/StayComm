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
        const d = new Date();
        const dateObject = new Date(d.getFullYear(), d.getMonth(), d.getDate());

        console.log("Data source has been initialized!");
        app.get('/stay/departures', async (req, res) =>
        {
            //then we tell it "hey, wait for us to tell you the query. the query type is findOneBy and then the productCode's id
            const departureCount = await AppDataSource.getRepository(Stay).findAndCount({
                where: {stayCheckoutDate: dateObject}
            });
            if (!departureCount)
            {
                //truthy falsy.
                res.status(404).json({
                    message: `No departures for today found :(`
                })
            }
            else
            {
                res.json(departureCount[1]);//send the product as a json response.
            }
        });
        app.get('/stay/arrivals', async (req, res) =>
        {
            //then we tell it "hey, wait for us to tell you the query. the query type is findOneBy and then the productCode's id
            const arrivalCount = await AppDataSource.getRepository(Stay).findAndCount({
                where: {stayCheckinDate: dateObject}
            });
            if (!arrivalCount)
            {
                //truthy falsy.
                res.status(404).json({
                    message: `No arrivals for today found :(`
                })
            }
            else
            {
                res.json(arrivalCount[1]);//send the product as a json response.
            }
        });
    });
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
import {RatePrice} from "./entities/rate-price";

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
        app.get('/stay/today-arrivals', async (req, res) =>
        {
            const arrivingArrivals = await AppDataSource.getRepository(Stay).createQueryBuilder("stay")
                .innerJoinAndSelect("stay.guest", "guest")
                .where("stay.stayCheckinDate = :today", {today: dateObject})
                .getMany();
            if (!arrivingArrivals)
            {
                //truthy falsy.
                res.status(404).json({
                    message: `No arrivals for today found :(`
                })
            }
            else
            {
                res.json(arrivingArrivals);//send the product as a json response.
            }
        })// find the arrival data where stayCheckinDate = today. make variable that holds today data?
        app.get('/stay/today-departures', async (req, res) =>
        {
            const departingDepartures = await AppDataSource.getRepository(Stay).createQueryBuilder("stay")
                .innerJoinAndSelect("stay.guest", "guest")
                .where("stay.stayCheckoutDate = :today", {today: dateObject})
                .getMany();
            if (!departingDepartures)
            {
                //truthy falsy.
                res.status(404).json({
                    message: `No departures for today found :(`
                })
            }
            else
            {
                res.json(departingDepartures);//send the product as a json response.
            }
        })
        app.get('/room/room-status', async (req, res) =>
        {
            const roomStatus = await AppDataSource.getRepository(Room).find();
            res.json(roomStatus);
        })
        app.put('/room/room-status-change', async (req, res) =>
        {
            const roomList: Room[] = req.body;
            const roomStatus = AppDataSource.getRepository(Room);
            for (let room of roomList)
            {
                const existingRoom = await roomStatus.findOneBy({
                    roomId: room.roomId
                });
                if (!existingRoom)
                {
                    res.status(404).json({
                        message: ` Room Number ${room.roomId} not found`
                    });
                    return;
                }
                //
                roomStatus.merge(existingRoom, room);//merging the changes to the thing itself!
                try
                {
                    await roomStatus.save(existingRoom);
                }
                catch (error)
                {
                    console.error('Error updating room: ', error);
                    res.status(500).json({
                        message: 'Failed to update room list'
                    });
                }
            }
            const savedRoomList = await roomStatus.find();
            res.json(savedRoomList);
        })
        //getting a list of ratePrices, returning the sum of them to the stay?
       /*app.get('rate/rate-price', async (req, res) => {
            const rateList: RatePrice[] = req.body;
            const totalStayDates:
        })*/
    });
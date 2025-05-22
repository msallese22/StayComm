import express, {Express} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {AppDataSource} from "./data-source";
import {Room} from "./entities/room";
import {Stay} from "./entities/stay";
import {CreditCard} from "./entities/credit-card";
import {Guest} from "./entities/guest";
import {Employee} from "./entities/employee";
import {Property} from "./entities/property";
import {Repository} from "typeorm";
import {RatePrice} from "./entities/rate-price";
import {json} from "node:stream/consumers";

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
        //it's a dateObject because working with the dates directly? it hated it.

        console.log("Data source has been initialized!");
        app.get('/stay/departures', async (req, res) =>
        {
            const departureCount = await AppDataSource.getRepository(Stay).createQueryBuilder("stay")
                .innerJoinAndSelect("stay.guest", "guest")
                .where("stay.stayCheckoutDate = :today", {today: dateObject})
                .andWhere("stay.stayIsCanceled = false")
                .getCount();
            if (!departureCount)
            {
                //truthy falsy.
                res.status(404).json({
                    message: `No departures for today found :(`
                });
            }
            else
            {
                res.json(departureCount);//send the product as a json response.
            }
        });
        app.get('/stay/arrivals', async (req, res) =>
        {
            //then we tell it "hey, wait for us to tell you the query. the query type is findOneBy and then the productCode's id
            const arrivalCount = await AppDataSource.getRepository(Stay).createQueryBuilder("stay")
                .innerJoinAndSelect("stay.guest", "guest")
                .where("stay.stayCheckinDate = :today", {today: dateObject})
                .andWhere("stay.stayIsCheckedIn = false")
                .andWhere("stay.stayIsCanceled = false")
                .getCount();
            if (!arrivalCount)
            {
                //truthy falsy.
                res.status(404).json({
                    message: `No arrivals for today found :(`
                });
            }
            else
            {
                res.json(arrivalCount);//send the product as a json response.
            }
        });
        app.get('/stay/today-arrivals', async (req, res) =>
        {
            const arrivingArrivals = await AppDataSource.getRepository(Stay).createQueryBuilder("stay")
                .innerJoinAndSelect("stay.guest", "guest")
                .where("stay.stayCheckinDate = :today", {today: dateObject})
                .andWhere("stay.stayIsCanceled = false")
                .getMany();
            if (!arrivingArrivals)
            {
                //truthy falsy.
                res.status(404).json({
                    message: `No arrivals for today found :(`
                });
            }
            else
            {
                res.json(arrivingArrivals);//send the product as a json response.
            }
        });// find the arrival data where stayCheckinDate = today. make variable that holds today data?
        app.get('/stay/today-departures', async (req, res) =>
        {
            const departingDepartures = await AppDataSource.getRepository(Stay).createQueryBuilder("stay")
                .innerJoinAndSelect("stay.guest", "guest")
                .where("stay.stayCheckoutDate = :today", {today: dateObject})
                .andWhere("stay.stayIsCanceled = false")
                .getMany();
            if (!departingDepartures)
            {
                //truthy falsy.
                res.status(404).json({
                    message: `No departures for today found :(`
                });
            }
            else
            {
                res.json(departingDepartures);//send the product as a json response.
            }
        });

        app.get('/stay/checked-in-count', async (req, res) =>
        {
            const inHouseCount = await AppDataSource.getRepository(Stay).createQueryBuilder("stay")
                .where("stay.stayIsCheckedIn = true")
                .getCount();
            if (!inHouseCount)
            {
                //truthy falsy.
                res.status(404).json({
                    message: `No check ins for today found :(`
                });
            }
            else
            {
                res.json(inHouseCount);//send the product as a json response.
            }
        });

        app.get('/stay/checked-in-stays', async (req, res) =>
        {
            const checkedInGuests = await AppDataSource.getRepository(Stay).createQueryBuilder("stay")
                .innerJoinAndSelect("stay.guest", "guest")
                .where("stay.stayIsCheckedIn = true")
                .getMany();
            if (!checkedInGuests)
            {
                //truthy falsy.
                res.status(404).json({
                    message: `No check ins found :(`
                });
            }
            else
            {
                res.json(checkedInGuests);//send the product as a json response.
            }
        });

        app.get('/room/room-status', async (req, res) =>
        {
            const roomStatus = await AppDataSource.getRepository(Room).find();
            res.json(roomStatus);
        });
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
        });
        //Nick is put request right
        app.put('/room/assign-a-room', async (req, res ) =>
        {
            const roomData = req.body;
            const roomRepository = AppDataSource.getRepository(Room);
            const existingRoom = await roomRepository.findOneBy({
                roomId: roomData.id
            });
            if (!existingRoom)
            {
                res.status(404).json({
                    message: `Room with id ${roomData.id} not found`
                });
                return;
            }

            roomRepository.merge(existingRoom, roomData);
            //forcing the objects to merge!!
            existingRoom.stay = roomData.stay;
            console.log(roomData);
            try
            {
                const updatedRoom = await roomRepository.save(existingRoom);
                res.json(updatedRoom);
            }
            catch (error)
            {
                console.error('Error updating room: ', error);
                res.status(500).json({
                    message: 'Failed to update room'
                });
            }
        });

        app.get('/room/get-room-by-stayid/:id', async (req, res) =>
        {
            const id = req.params.id;

            const roomByStayId = await AppDataSource.getRepository(Room).createQueryBuilder("room")
                .innerJoinAndSelect("room.stay", "stay")
                .where("room.stay.stayId = :id", {id: id})
                .getOne();

            if (!roomByStayId)
            {
                res.status(404).json({
                    message: `Stay with ID ${id} not found.`
                });
            }
            else
            {
                res.json(roomByStayId);
            }
        })
        app.post('/stay/save-new-stay/', async (req, res) =>
        {
            const stayData = req.body;
            stayData.stayCheckinDate = new Date(stayData.stayCheckinDate);
            stayData.stayCheckoutDate = new Date(stayData.stayCheckoutDate);
            stayData.propertyId = 1;


            const stayRequiredFields = [
                'stayCheckinDate',
                'stayCheckoutDate',
            ];

            const guestRequiredFields = [
                'guestFname',
                'guestLname',
                'guestPhone',
                'guestEmail',
            ];

            const creditCardRequiredFields = [
                'creditCardNum',
                'creditCardExp',
                'creditCardCvv'
            ];

            if (stayRequiredFields.some(field => stayData[field] === undefined
                    || stayData[field] === null) ||
                guestRequiredFields.some(field => stayData.guest[field] === undefined
                    || stayData.guest[field] === null)
                || creditCardRequiredFields.some(field => stayData.guest.creditCards[0][field] === undefined
                    || stayData.guest.creditCards[0][field] === null))
            {
                res.status(400).json({
                    message: 'Values are required for all columns'
                });
                return;
            }

            const stayRepository: Repository<any> = AppDataSource.getRepository(Stay);

            if (stayData.guest.guestId === 0)
            {
                stayData.guest.guestId = undefined;
                //make a new guest, bestie!
            }

            if (stayData.guest.creditCards[0].creditCardId === 0)
            {
                stayData.guest.creditCards[0].creditCardId = undefined;
                //smallest Russian doll
            }

            if (stayData.stayId === 0)
            {
                const maxId = await stayRepository.maximum("stayId");
                stayData.stayId = maxId ? maxId + 1 : 100;
            }

            try
            {
                const newStay = stayRepository.create(stayData);
                const savedStay: Stay = await stayRepository.save(newStay);

                res.status(201).json(savedStay);
            }
            catch (error)
            {
                console.error('Error creating Stay', error);
                res.status(500).json({
                    message: 'Failed to create Stay.', error
                });
            }
        });
        app.get('/guest-info/:id', async (req, res) =>
        {
            const id = +req.params.id;
            const guest = await AppDataSource.getRepository(Guest).createQueryBuilder("guest")
                .innerJoinAndSelect("guest.creditCards", "creditCard")
                .where("guest.guestId = :id", {id: id})
                .getOne();
            if (!guest)
            {
                //truthy falsy.
                res.status(404).json({
                    message: `Guest with ID ${id} not found :(`
                });
            }
            else
            {
                res.json(guest);//send the product as a json response.
            }
        });


        //getting a list of ratePrices, returning the sum of them to the stay?
        app.post('/rate/rate-price', async (req, res) =>
        {
            console.log(req.body);
            const checkinDate = new Date(req.body.checkinDate);
            const checkoutDate = new Date(req.body.checkoutDate);

            checkoutDate.setDate(checkoutDate.getDate() - 1);


            //this is broken. somewhere


            const totalRate = await AppDataSource.getRepository(RatePrice).createQueryBuilder("ratePrice")
                .where("ratePrice.rateDate >= :checkinDate AND ratePrice.rateDate <= :checkoutDate", {
                    checkinDate: checkinDate,
                    checkoutDate: checkoutDate
                })
                .getMany();
            const defaultRate = await AppDataSource.getRepository(RatePrice).createQueryBuilder("ratePrice")
                .where("ratePrice.rateDate = :checkinDate", {checkinDate: "1901-11-11"})
                .getOne();

            const dates = getDatesInRange(checkinDate, checkoutDate);
            const totalCost: RatePrice[] = [];

            if (totalRate)
            {

                for (let i = 0; i < dates.length; i++)
                {
                    const matchingRate = totalRate.find(rate => rate.rateDate === dates[i]);
                    if (matchingRate)
                    {
                        totalCost.push(matchingRate);
                    }
                    else
                    {
                        totalCost.push({
                            rateDate: dates[i],
                            ratePricePrice: defaultRate!.ratePricePrice,
                            ratePriceId: 0,
                            stays: []
                        });
                    }
                }
            }
            else
            {
                dates.forEach(date =>
                {
                    totalCost.push({
                        rateDate: date,
                        ratePricePrice: defaultRate!.ratePricePrice,
                        ratePriceId: 0,
                        stays: []
                    });
                });
            }
            res.json(totalCost);
        });

        app.get('/stay/:id', async (req, res) =>
        {
            const id = req.params.id;

            const stayById = await AppDataSource.getRepository(Stay).createQueryBuilder("stay")
                .innerJoinAndSelect("stay.guest", "guest")
                .innerJoinAndSelect("guest.creditCards", "creditCard")
                .where("stay.stayId = :id", {id: id})
                .getOne();

            if (!stayById)
            {
                res.status(404).json({
                    message: `Stay with ID ${id} not found.`
                });
            }
            else
            {
                res.json(stayById);
            }
        });

        app.put('/stay/:id', async (req, res) =>
        {
            const id = req.params.id;
            const stayData = req.body;
            const stayRepository = AppDataSource.getRepository(Stay);
            const existingStay = await stayRepository.findOneBy({
                stayId: +id
            });
            if (!existingStay)
            {
                res.status(404).json({
                    message: `Stay with id ${id} not found`
                });
                return;
            }

            stayRepository.merge(existingStay, stayData);

            try
            {
                const updatedStay = await stayRepository.save(existingStay);
                res.json(updatedStay);
            }
            catch (error)
            {
                console.error('Error updating stay: ', error);
                res.status(500).json({
                    message: 'Failed to update stay'
                });
            }
        });
    });


function getDatesInRange(checkinDate: Date, checkoutDate: Date)
{
    const date = new Date(checkinDate.getTime());

    const dates = [];

    while (date <= checkoutDate)
    {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }

    return dates;
}


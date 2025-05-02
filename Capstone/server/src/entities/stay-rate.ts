export { StayRate }

import {Column, Entity, PrimaryColumn } from "typeorm";

//composite table of RATE_PRICE and STAY. Because many stays can return many rates and many rates can be returned by man stays.
@Entity("STAY_RATE")

class StayRate
{
    @PrimaryColumn({name: 'STAY_ID', type: 'int', unsigned: true})
    stayId!: number;

    @PrimaryColumn({name: 'RATE_PRICE_ID', type: 'int', unsigned: true})
    ratePriceId!: number;
}
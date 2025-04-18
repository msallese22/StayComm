export { Rate }

import {Column, Entity, PrimaryColumn } from "typeorm";

@Entity("RATE")

class Rate
{
    @PrimaryColumn({name: 'RATE_ID', type: 'int', unsigned: true})
        rateId!: number;

    @Column({name: 'RATE_PRICE', type: 'double', unsigned: true})
    ratePrice!: number;

    @Column({name: 'RATE_DATE', type: 'date'})
    rateDate!: Date;

    @Column({name: 'STAY_ID', type: 'int', unsigned: true})
    stayId!: number;
}
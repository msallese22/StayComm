
export { RatePrice }

import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {Stay} from "./stay";


@Entity("RATE_PRICE")

class RatePrice
{
    @PrimaryColumn({name: 'RATE_PRICE_ID', type: 'int', unsigned: true})
    ratePriceId!: number;

    @Column({name: 'RATE_PRICE_PRICE', type: 'decimal', nullable: true ,unsigned: true, default: 99})
    ratePricePrice!: number;

    @Column({name: 'RATE_DATE', type: 'date'})
    rateDate!: Date;

   @ManyToMany(() => Stay)
    @JoinTable()
    stays!: Stay[]
}
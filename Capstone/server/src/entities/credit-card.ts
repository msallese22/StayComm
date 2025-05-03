import {Guest} from "./guest";

export { CreditCard }

import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";

@Entity("CREDIT_CARD")

class CreditCard
{
    @PrimaryColumn({name: 'CREDIT_CARD_ID', type: 'int', unsigned: true})
    creditCardId!: number;

    @Column({name: 'CREDIT_CARD_NUM', type: 'int', unsigned: true })
    creditCardNum!: number;

    @Column({name: 'CREDIT_CARD_EXP_DATE', type: 'date'})
    creditCardExp!: Date;

    @Column({name: 'CREDIT_CARD_CVV', type: 'int', unsigned: true})
    creditCardCvv!: number;

    @ManyToOne(() => Guest, guest => guest.creditCards)
    guest!: Guest;
}
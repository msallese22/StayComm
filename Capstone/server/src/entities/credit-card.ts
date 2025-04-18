export { CreditCard }

import {Column, Entity, PrimaryColumn } from "typeorm";

@Entity("CREDIT_CARD")

class CreditCard
{
    @PrimaryColumn({name: 'CREDIT_CARD_ID', type: 'int', unsigned: true})
    creditCardId!: number;

    @Column({name: 'CREDIT_CARD_NUM', type: 'int', length: 16, unsigned: true })
    creditCardNum!: number;

    @Column({name: 'CREDIT_CARD_EXP_DATE', type: 'date'})
    creditCardExp!: Date;

    @Column({name: 'CREDIT_CARD_CVV', type: 'int', length: 3, unsigned: true})
    creditCardCvv!: number;

    @Column({name: 'GUEST_ID', type: 'int', unsigned: true})
    guestId!: number;
}
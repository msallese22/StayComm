export { Stay }

import {Column, Entity, PrimaryColumn } from "typeorm";

@Entity("Stay")

class Stay
{
    @PrimaryColumn({name: 'STAY_ID', type: 'int', unsigned: true})
    stayId!: number;

    @Column({name: 'STAY_CHECKIN_DATE', type: 'date'})
    stayCheckinDate!: Date;

    @Column({name: 'STAY_CHECKOUT_DATE', type: 'date'})
    stayCheckoutDate!: Date;

    @Column({name: 'PROPERTY_ID', type: 'int', unsigned: true})
    propertyId!: number;

    @Column({name: 'GUEST_ID', type: 'int', unsigned: true})
    guestId!: number;

}
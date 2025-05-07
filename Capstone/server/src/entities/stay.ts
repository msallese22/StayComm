import {type} from "node:os";

export { Stay }

import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import { Guest } from "./guest";
import {Room} from "./room";

@Entity("STAY")

class Stay
{
    @PrimaryColumn({name: 'STAY_ID', type: 'int', unsigned: true})
    stayId!: number;

    @Column({name: 'STAY_CHECKIN_DATE', type: 'date'})
    stayCheckinDate!: Date;

    @Column({name: 'STAY_CHECKOUT_DATE', type: 'date'})
    stayCheckoutDate!: Date;

    @Column({name: 'STAY_IS_CHECKED_IN', type: 'boolean'})
    stayIsCheckedIn!: boolean;

    @Column({name: 'PROPERTY_ID', type: 'int', unsigned: true})
    propertyId!: number;

    @ManyToOne(() => Guest, guest => guest.stays)
    @JoinColumn({name: 'GUEST_ID'})
    guest!: Guest;
    //creates a new type, fixes the circular dependency wowowowow

    //when you save a stay, update the room, too.
    @OneToMany(() => Room, room => room.stays, {cascade:true})
    @JoinColumn({name: 'STAY_ID'})
    room!: Room;

}
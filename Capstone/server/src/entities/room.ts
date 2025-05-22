
export { Room }

import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Stay} from "./stay";

@Entity("ROOM")

class Room
{
    @PrimaryColumn({ name: 'ROOM_ID', type: 'int', unsigned: true})
    roomId!: number;

    @Column({ name: 'ROOM_TYPE', type: 'char', length: 1})
    roomType!: string;

    @Column({ name: 'ROOM_IS_CLEAN', type: 'boolean'})
    roomIsClean!: boolean;

    @Column({ name: 'ROOM_IS_BLOCKED', type: 'boolean'})
    roomIsBlocked!: boolean;

    @Column({ name: 'PROPERTY_ID', type: 'int', unsigned: true})
    propertyId!: number;

    //problem might be here, Nick?
    @ManyToOne(() => Stay, stay => stay.room, {cascade:["update"]})
    @JoinColumn({name: 'STAY_ID'})
    stay!: Stay;
}
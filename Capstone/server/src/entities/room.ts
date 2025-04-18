export { Room }

import {Column, Entity, PrimaryColumn } from "typeorm";

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

    @Column({name: 'STAY_ID', type: 'int', nullable: true, unsigned: true})
    stayId!: number | null;

    @Column({ name: 'PROPERTY_ID', type: 'int', unsigned: true})
    propertyId!: number;
}
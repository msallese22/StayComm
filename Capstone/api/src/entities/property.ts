export { Property }

import {Column, Entity, PrimaryColumn } from "typeorm";

@Entity("PROPERTY")

class Property
{
    @PrimaryColumn({ name: 'PROPERTY_ID', type: 'int', unsigned: true})
    propertyId!: number;

    @Column({ name: 'PROPERTY_NAME', type: 'varchar', length: 64})
    propertyName!: string;

    @Column({name: 'PROPERTY_STREET_ADDR', type: 'varchar', length: 64})
    propertyStreetAddr!: string;

    @Column({name: 'PROPERTY_CITY', type: 'varchar', length: 64})
    propertyCity!: string;

    @Column({name: 'PROPERTY_STATE', type: 'char', length: 2})
    propertyState!: string;

    @Column({name: 'PROPERTY_KING_ROOMS', type: 'int', unsigned: true})
    propertyKingRooms!: number;

    @Column({name: 'PROPERTY_QUEEN_ROOMS', type: 'int', unsigned: true})
    propertyQueenRooms!: number;
}
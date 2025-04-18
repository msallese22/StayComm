export { Guest }

import {Column, Entity, PrimaryColumn } from "typeorm";

@Entity("GUEST")

class Guest
{
    @PrimaryColumn({ name: 'GUEST_ID', type: 'int', unsigned: true})
    guestId!: number;

    @Column({ name: 'GUEST_LNAME', type: 'varchar', length: 64})
    guestLname!: string;

    @Column({name: 'GUEST_FNAME', type: 'varchar', length: 64})
    guestFname!: string;

    @Column({name: 'GUEST_EMAIL', type: 'varchar', length: 64})
    guestEmail!: string;

    @Column({name: 'GUEST_PHONE', type: 'char', length: 10})
    guestPhone!: string;

    @Column({name: 'GUEST_PASSWORD', type: 'varchar', length: 64})
    guestPassword!: string;
}
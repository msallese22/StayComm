export { Employee }

import {Column, Entity, PrimaryColumn } from "typeorm";

@Entity("EMPLOYEE")

class Employee
{
    @PrimaryColumn({ name: 'EMPLOYEE_ID', type: 'int', unsigned: true})
    employeeId!: number;

    @Column({ name: 'EMPLOYEE_LNAME', type: 'varchar', length: 64})
    employeeLname!: string;

    @Column({name: 'EMPLOYEE_FNAME', type: 'varchar', length: 64})
    employeeFname!: string;

    @Column({name: 'EMPLOYEE_EMAIL', type: 'varchar', length: 64})
    employeeEmail!: string;

    @Column({name: 'EMPLOYEE_PHONE', type: 'char', length: 10})
    employeePhone!: string;

    @Column({name: 'EMPLOYEE_PASSWORD', type: 'varchar', length: 64})
    employeePassword!: string;

    @Column({name: 'PROPERTY_ID', type: 'int'})
    propertyId!: number;
}
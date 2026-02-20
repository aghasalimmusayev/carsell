import { Report } from "src/reports/report.entity";
import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[]

    // logger ucun hooklar
    @AfterInsert()
    logInsert() {
        console.log('Inserted User with ID', this.id)
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Updated User with ID', this.id)
    }

    @AfterRemove()
    logRemove() {
        console.log('Removed User with ID', this.id)
    }
}
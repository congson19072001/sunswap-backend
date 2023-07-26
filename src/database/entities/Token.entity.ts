import { Entity, ObjectId, ObjectIdColumn, Column } from "typeorm"

@Entity()
export class Token {
    @ObjectIdColumn()
    id: ObjectId

    @Column()
    network: number

    @Column()
    name: string

    @Column()
    symbol: string

    @Column()
    address: string

    @Column()
    decimals: number

}
import { Entity, ObjectId, ObjectIdColumn, Column } from "typeorm"

@Entity()
export class PairStatus {
    @ObjectIdColumn()
    id: ObjectId

    @Column()
    network: number

    @Column()
    address: string

    @Column()
    token0: string

    @Column()
    token1: string

    @Column()
    price: number

    @Column()
    timestamp: number

    @Column()
    reserve1: number

    @Column()
    reserve2: number
}
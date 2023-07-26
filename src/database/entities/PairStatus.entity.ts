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
    reserve0: string

    @Column()
    reserve1: string

    @Column()
    decimals0: number

    @Column()
    decimals1: number

    @Column()
    ratio: string
}
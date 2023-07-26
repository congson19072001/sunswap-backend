import { Entity, ObjectId, ObjectIdColumn, Column } from "typeorm"

@Entity()
export class TokenPair {
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
    name0: string

    @Column()
    name1: string

    @Column()
    decimals0: number

    @Column()
    decimals1: number
}
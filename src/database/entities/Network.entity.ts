import { Entity, ObjectId, ObjectIdColumn, Column } from "typeorm"

@Entity()
export class Network {
    @ObjectIdColumn()
    id: ObjectId

    @Column()
    network: number

    @Column()
    name: string

    @Column()
    rpc: string

    @Column()
    currencySymbol: string

    @Column()
    explorerUrl: string
}
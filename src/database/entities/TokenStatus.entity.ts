import { Entity, ObjectId, ObjectIdColumn, Column } from "typeorm"

@Entity()
export class TokenStatus {
    @ObjectIdColumn()
    id: ObjectId

    @Column()
    network: number

    @Column()
    address: string

    @Column()
    timestamp: number

    @Column()
    reserve: string
}
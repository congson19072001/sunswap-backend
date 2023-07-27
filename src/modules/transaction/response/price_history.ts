import { ApiProperty } from "@nestjs/swagger";

export class Price {
    @ApiProperty({
        type: Number,
        example: 1690362900000,
    })
    time: number;

    @ApiProperty({
        type: Number,
        example: "1699.69778",
    })
    price: string;
}
export class PriceHistoryResponse {
    @ApiProperty({
        type: Number,
        example: 69,
    })
    totalItems: number;

    @ApiProperty({
        type: [Price], // Define the array type as Price[]
        example: [{ price: "1699.69778", time: 1690389057000 }, { price: "1700.12345", time: 1690400000000 }], // Example array of Price objects
    })
    prices: Price[];
}
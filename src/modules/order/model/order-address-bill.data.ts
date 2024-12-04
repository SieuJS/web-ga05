import { ApiProperty, OmitType } from "@nestjs/swagger";
import { OrderAdressBill } from "@prisma/client";

export class OrderAdressBillData {
    @ApiProperty({description : 'The id of the address', example : '123213-123123-123123'})
    id : string;

    @ApiProperty({description : 'The order id', example : '123213-123123-123123'})
    orderId : string;

    @ApiProperty({description : "first name", example : "John"})
    firstName : string;

    @ApiProperty({description : "last name", example : "Doe"})
    lastName : string;

    @ApiProperty({description : "company", example : "FPT"})
    company : string;

    @ApiProperty({description : "country", example : "Vietnam"})
    country : string;

    @ApiProperty({description : "address", example : "1234 Main Street"})
    address : string;

    @ApiProperty({description : "postcode", example : "123456"})
    postCode : string;

    @ApiProperty({description : "City", example : "Hanoi"})
    city : string;

    @ApiProperty({description : "Province", example : "Hanoi"})
    province : string;

    @ApiProperty({description : "Phone", example : "0123456789"})
    phone : string;

    @ApiProperty({description : "Email", example : " test@test.com"})
    email : string;

    constructor (orderAdressBill : OrderAdressBill) {
        this.id = orderAdressBill.id;
        this.orderId = orderAdressBill.orderId;
        this.firstName = orderAdressBill.firstName;
        this.lastName = orderAdressBill.lastName;
        this.company = orderAdressBill.company;
        this.country = orderAdressBill.country;
        this.address = orderAdressBill.address;
        this.postCode = orderAdressBill.postCode;
        this.city = orderAdressBill.city;
        this.province = orderAdressBill.province;
        this.phone = orderAdressBill.phone;
        this.email = orderAdressBill.email;
    }
}

export class OrderAddressBillInput extends OmitType(OrderAdressBillData, ['id']) {}
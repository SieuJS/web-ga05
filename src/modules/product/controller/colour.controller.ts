import { Controller, Get, Query } from "@nestjs/common";
import { ProductService } from "../service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller('colour')
@ApiTags('Colour')
export class ColourController {
    constructor(private productService: ProductService) {}

    @Get("/all")
    @ApiResponse({ status: 200, description: 'Get all colour' , type : Array<String>})
    async getAllColour() {
        return this.productService.getAllColour();
    }

    @Get('/list')
    @ApiResponse({ status: 200, description: 'Get all colour' , type : Array<String>})
    async getListColour(@Query('limit') limit : number = 10) : Promise<string[]> {
        return await this.productService.getListColour(limit);
    }
}
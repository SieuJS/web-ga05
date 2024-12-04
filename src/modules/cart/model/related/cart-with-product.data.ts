import { CartData } from '../cart.data';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { ProductData } from '../../../product';

export class ProductMiniData extends PickType( ProductData, ['id', 'image', 'name', 'price']) {}


export class CartWithProductData extends CartData {
    @ApiProperty({description : 'The product data', type : ProductMiniData})
    products_in_cart : ProductMiniData;

    constructor (cartData : CartData, productData : ProductData) {
        super(cartData);

        this.products_in_cart = {
            id : productData.id,
            image : productData.image,
            name : productData.name,
            price : productData.price
        }
    }
}
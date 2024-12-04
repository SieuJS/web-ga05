import { OmitType } from "@nestjs/swagger";
import { CartData } from "./cart.data";

export class CartInput extends OmitType(CartData, ['id']) {

}
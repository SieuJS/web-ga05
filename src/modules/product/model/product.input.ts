import { ProductData } from "./product.data";
import { OmitType } from "@nestjs/swagger";

export class ProductInput extends OmitType(ProductData, ['id'] as const) {}
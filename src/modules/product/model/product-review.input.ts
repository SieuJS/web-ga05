import { OmitType } from "@nestjs/swagger";
import { ProductReviewData } from "./product-review.data";


export class ProductReviewInput extends OmitType(ProductReviewData, ['id'] as const) {}
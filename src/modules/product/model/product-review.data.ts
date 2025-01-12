import { ApiProperty } from "@nestjs/swagger"
import { ProductReview } from "@prisma/client"
import { PaginationMeta } from "../../paginate"
export class ProductReviewData {
@ApiProperty({ type: 'string', format: 'uuid' })
  id: string
  @ApiProperty({ type: 'string', format: 'uuid' })
  productId: string
    @ApiProperty({ type: 'string', format: 'uuid' })
  userId: string
  @ApiProperty({ type: 'number' })
  rating: number
  @ApiProperty({ type: 'string' })
  review: string

  constructor(productReview : ProductReview){
    this.id = productReview.id
    this.productId = productReview.productId
    this.userId = productReview.userId
    this.rating = productReview.rating
    this.review = productReview.review
  }
}

export class PaginatedReview {
    @ApiProperty({ type: ProductReviewData, isArray: true })
    data: ProductReviewData[]

    @ApiProperty({description : "The meta of pagination", type: PaginationMeta})
    meta : PaginationMeta;
}
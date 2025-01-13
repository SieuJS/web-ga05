import { ApiProperty } from "@nestjs/swagger"
import { ProductReview } from "@prisma/client"
import { PaginationMeta } from "../../paginate"
import {  UserInSession } from "../../user"
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

export class ProductReviewWithUser extends ProductReviewData {
  @ApiProperty({ type: UserInSession })
  user: UserInSession
}

export class PaginatedProductReview {
    @ApiProperty({ type: ProductReviewData, isArray: true })
    data: ProductReviewWithUser[]

    @ApiProperty({description : "The meta of pagination", type: PaginationMeta})
    meta : PaginationMeta;
}
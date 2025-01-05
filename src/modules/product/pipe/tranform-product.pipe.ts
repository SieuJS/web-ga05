import { Injectable, PipeTransform } from "@nestjs/common";
import { ProductInput } from "../model";

@Injectable()
export class TranformProductPipe implements PipeTransform {
    async transform(value: ProductInput) :Promise<ProductInput> {
        return {
            ...value,
            price: parseFloat(value.price as any) as any,
            quantity: parseFloat(value.quantity as any),
        }
    }
}
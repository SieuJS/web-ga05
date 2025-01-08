import { Injectable, PipeTransform } from "@nestjs/common";
import { ProductInput } from "../model";

@Injectable()
export class TranformProductPipe implements PipeTransform {
    async transform(value: any) :Promise<ProductInput> {

        return  {
            ...value,
            masterCategory : undefined,
            subCategory : undefined,
            price: parseFloat(value.price as any) as any,
            quantity: parseFloat(value.quantity as any),
            year : `${value.year}`,
            image : value.images[0],
        } ;
    }
}
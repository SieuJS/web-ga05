import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

import { Injectable } from "@nestjs/common";

const fields = ['id', 'name', 'description', 'price', 'season', 'baseColour', 'quantity'];

@Injectable()
export class SortOrderProductPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        if (value.orderBy && !fields.includes(value.orderBy)) {
            throw new Error(`Invalid orderBy field: ${value.orderBy}`);
        }
        let 
            orderBy : any = {
                id : 'desc'

        }
        if(value.orderBy) {
                orderBy = {
                    [value.orderBy] : value.order || 'asc'
                }
            
        }
        return orderBy;
    }
}
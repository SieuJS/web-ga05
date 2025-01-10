import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

const fields = [
    'name', 
    'email',
    'createdAt',
]

@Injectable()
export class SortOrderUserPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        if (value.orderBy && !fields.includes(value.orderBy)) {
            throw new Error(`Invalid orderBy field: ${value.orderBy}`);
        }
        let orderBy : any = {
            createdAt : 'desc'
        }
        if(value.orderBy) {
                orderBy = {
                    [value.orderBy] : value.order || 'asc'
                }
            
        }
        return orderBy;
    }
}
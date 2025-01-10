import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

import { Injectable } from "@nestjs/common";


@Injectable()
export class SearchUserPipe implements PipeTransform{
    async transform(value: any, metadata: ArgumentMetadata) {
        let query = {
            name : value.name || '',
            email : value.email || '',
        }
        return query;
    }
}
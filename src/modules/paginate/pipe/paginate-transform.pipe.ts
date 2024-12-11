import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { PaginationArgs } from "../model";

@Injectable()
export class PaginateTransformPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) : PaginationArgs {
        return {
            page : parseInt(value.page) || 1,
            perPage : parseInt(value.limit) || 10
        } as PaginationArgs;
    }
}
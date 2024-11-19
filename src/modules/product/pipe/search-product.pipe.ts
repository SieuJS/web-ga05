import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { CategoryService } from "../../category/service";

@Injectable()
export class SearchProductPipe implements PipeTransform {
    constructor(private categoryService : CategoryService) {}
    async transform(value: any, metadata: ArgumentMetadata) {

        let query = {
            search : value.search || '',
            season : value.season || '',
            baseColor : value.color || '',
            minPrice : 0,
            maxPrice : 10000000,
        }
        let queryWithCate = null;
        if(value.price) {
            query = {
                ...query,
                minPrice : value.price.split('-')[0] || 0,
                maxPrice : value.price.split('-')[1] || 10000000
            }
        }

        if(value.master) {
            let subArray : string[] = []
            if(typeof value.master === 'string') {
                subArray = [value.master]
            }
            else {
                subArray = [...value.master ]
            }
            const masterList = await this.categoryService.getListCategoryByMaster(subArray);
            queryWithCate = {
                ...query,
                categoryId : {
                    in : masterList.map(item => item.id)
                }
            }
        }

        if(value.sub) {
            let subArray : string[] = []
            if(typeof value.sub === 'string') {
                subArray = [value.sub]
            }
            else {
                subArray = [...value.sub ]
            }
            const subList = await this.categoryService.getListCategoryBySub(subArray);
            queryWithCate = {
                ...query,
                categoryId : {
                    in : subList.map(item => item.id)
                }
            }
        }

        return queryWithCate || query;
    }
}
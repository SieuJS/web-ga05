import { OmitType } from "@nestjs/swagger";
import { CategoryData } from "./category.data";

export class CategoryInput extends OmitType(CategoryData, ['id'] as const) {}
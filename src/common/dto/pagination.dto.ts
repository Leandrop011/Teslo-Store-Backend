import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive } from "class-validator";

// ! DTO QUE SE USA PARA LA PAGINATION / RESIVIR Y TRANSPORTAR QUERY PARAMS
export class PaginationDTO{

    @IsOptional()
    @IsPositive()
    @Type(() => Number) // ? realizar la transformacion con el transformer class
    public limit?: number;
    
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    public offset?: number;

}

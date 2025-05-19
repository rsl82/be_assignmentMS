import { IsMongoId, IsOptional, IsString } from "class-validator";

export class CreateRequestDto {
    @IsMongoId()
    eventId: string;

    @IsOptional()
    @IsString()
    couponCode?: string;
}

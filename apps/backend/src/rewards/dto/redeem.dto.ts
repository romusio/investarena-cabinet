import { IsOptional, IsString } from "class-validator";

export class RedeemDto {
    @IsString()
    rewardId!: string;

    // для мерча (опционально)
    @IsOptional()
    @IsString()
    deliveryName?: string;

    @IsOptional()
    @IsString()
    deliveryPhone?: string;

    @IsOptional()
    @IsString()
    deliveryAddress?: string;
}
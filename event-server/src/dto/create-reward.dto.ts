import { IsEnum, IsMongoId, IsNumber, IsString, Min } from 'class-validator';
import { RewardType } from 'common';

export class CreateRewardDto {
  @IsMongoId()
  event: string;

  @IsEnum(RewardType)
  type: RewardType;

  @IsString()
  name: string; // 추후 name 을 고유 아이템 ID로 바꾼다던가 그런 느낌으로

  @IsNumber()
  @Min(1)
  quantity: number;
}

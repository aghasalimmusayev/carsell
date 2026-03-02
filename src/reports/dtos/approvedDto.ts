import { IsBoolean } from "class-validator";

export class ApprovedDto {
    @IsBoolean()
    approved: boolean
}
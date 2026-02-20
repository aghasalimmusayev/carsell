import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { createReportDto } from './dtos/createReportDto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { reportDto } from './dtos/reportDto';

@Controller('reports')
export class ReportsController {
    constructor(private reportService: ReportsService) { }
    
    @Post()
    @UseGuards(AuthGuard)
    @Serialize(reportDto)
    createReport(@Body() body: createReportDto, @CurrentUser() user: User) {
        return this.reportService.create(body, user)
    }

    @Get()
    @UseGuards(AuthGuard)
    findReports(@CurrentUser() user: User) {
        return this.reportService.getReports(user)
    }
}

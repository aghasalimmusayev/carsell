import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { createReportDto } from './dtos/createReportDto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) { }

    async create(data: createReportDto, user: User) {
        const report = this.repo.create(data)
        report.user = user
        return await this.repo.save(report)
    }

    async getReports(user: User) {
        const reports = await this.repo.find({ where: { user: { id: user.id } } })
        if (reports.length === 0) throw new NotFoundException('No reports exist')
        return reports
    }
}

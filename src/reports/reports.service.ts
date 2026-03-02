import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { createReportDto } from './dtos/createReportDto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/getEstimateDto';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) { }

    createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
        return this.repo
            .createQueryBuilder()
            .select('AVG(price)', 'price')
            .where('make = :make', { make })
            .andWhere('model = :model', { model })
            .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
            .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
            .andWhere('year - :year BETWEEN -3 AND 3', { year })
            .andWhere('approved is TRUE')
            .orderBy('ABS(mileage - :mileage)', 'DESC')
            .setParameters({ mileage })
            .limit(3)
            .getRawOne()
    }

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

    async changeApproval(id: number, approved: boolean) {
        const report = await this.repo.findOne({ where: { id } })
        if (!report) throw new NotFoundException('Report not found')
        report.approved = approved
        return this.repo.save(report)
    }


}

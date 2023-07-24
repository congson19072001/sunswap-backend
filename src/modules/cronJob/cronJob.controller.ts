import {
    Controller,
} from '@nestjs/common';
import { CronJobService } from './cronJob.service';

@Controller()
export class CronJobController {
    constructor(
        private readonly cronJobService: CronJobService
    ) { }

    
}

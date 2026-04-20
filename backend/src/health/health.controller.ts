import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Public } from '@/metadata';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check — returns service and DB status' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  check(): { status: string; database: string; timestamp: string } {
    const dbOk = this.dataSource.isInitialized;
    return {
      status: 'ok',
      database: dbOk ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
    };
  }
}

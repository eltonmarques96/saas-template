import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthorsService } from './authors.service';
import { ReturnAuthorDto } from './dto/return-author.dto';
import { Public } from '@/metadata';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all authors' })
  @ApiResponse({
    status: 200,
    description: 'List of authors',
    type: [ReturnAuthorDto],
  })
  async findAll(): Promise<ReturnAuthorDto[]> {
    const authors = await this.authorsService.findAll();
    return authors.map((a) => new ReturnAuthorDto(a));
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get an author by UUID' })
  @ApiParam({ name: 'id', description: 'Author UUID' })
  @ApiResponse({
    status: 200,
    description: 'Author found',
    type: ReturnAuthorDto,
  })
  @ApiResponse({ status: 404, description: 'Author not found' })
  async findOne(@Param('id') id: string): Promise<ReturnAuthorDto> {
    const author = await this.authorsService.findOne(id);
    return new ReturnAuthorDto(author);
  }
}

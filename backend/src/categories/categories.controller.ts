import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { ReturnCategoryDto } from './dto/return-category.dto';
import { Public } from '@/metadata';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all categories' })
  @ApiResponse({
    status: 200,
    description: 'List of categories',
    type: [ReturnCategoryDto],
  })
  async findAll(): Promise<ReturnCategoryDto[]> {
    const categories = await this.categoriesService.findAll();
    return categories.map((c) => new ReturnCategoryDto(c));
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a category by UUID' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({
    status: 200,
    description: 'Category found',
    type: ReturnCategoryDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id') id: string): Promise<ReturnCategoryDto> {
    const category = await this.categoriesService.findOne(id);
    return new ReturnCategoryDto(category);
  }
}

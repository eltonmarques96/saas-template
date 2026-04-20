import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { ReturnCollectionDto } from './dto/return-collection.dto';

@ApiTags('collections')
@ApiBearerAuth()
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all collections for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of collections',
    type: [ReturnCollectionDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Request() req): Promise<ReturnCollectionDto[]> {
    const userId: string = req.user?.sub ?? req.user?.id;
    const collections = await this.collectionsService.findAllByUser(userId);
    return collections.map((c) => new ReturnCollectionDto(c));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new collection' })
  @ApiResponse({
    status: 201,
    description: 'Collection created',
    type: ReturnCollectionDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() dto: CreateCollectionDto,
    @Request() req,
  ): Promise<ReturnCollectionDto> {
    const userId: string = req.user?.sub ?? req.user?.id;
    const collection = await this.collectionsService.create(dto, userId);
    return new ReturnCollectionDto(collection);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a collection by ID (ownership enforced)' })
  @ApiParam({ name: 'id', description: 'Collection UUID' })
  @ApiResponse({
    status: 200,
    description: 'Collection found',
    type: ReturnCollectionDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ReturnCollectionDto> {
    const userId: string = req.user?.sub ?? req.user?.id;
    const collection = await this.collectionsService.findOne(id, userId);
    return new ReturnCollectionDto(collection);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a collection name (ownership enforced)' })
  @ApiParam({ name: 'id', description: 'Collection UUID' })
  @ApiResponse({
    status: 200,
    description: 'Collection updated',
    type: ReturnCollectionDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCollectionDto,
    @Request() req,
  ): Promise<ReturnCollectionDto> {
    const userId: string = req.user?.sub ?? req.user?.id;
    const collection = await this.collectionsService.update(id, dto, userId);
    return new ReturnCollectionDto(collection);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a collection (ownership enforced)' })
  @ApiParam({ name: 'id', description: 'Collection UUID' })
  @ApiResponse({ status: 200, description: 'Collection deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async remove(
    @Param('id') id: string,
    @Request() req,
  ): Promise<{ message: string }> {
    const userId: string = req.user?.sub ?? req.user?.id;
    await this.collectionsService.remove(id, userId);
    return { message: 'Collection deleted successfully' };
  }

  @Post(':id/books/:bookId')
  @ApiOperation({ summary: 'Add a book to a collection (ownership enforced)' })
  @ApiParam({ name: 'id', description: 'Collection UUID' })
  @ApiParam({ name: 'bookId', description: 'Book UUID' })
  @ApiResponse({
    status: 201,
    description: 'Book added',
    type: ReturnCollectionDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Collection or book not found' })
  async addBook(
    @Param('id') id: string,
    @Param('bookId') bookId: string,
    @Request() req,
  ): Promise<ReturnCollectionDto> {
    const userId: string = req.user?.sub ?? req.user?.id;
    const collection = await this.collectionsService.addBook(
      id,
      bookId,
      userId,
    );
    return new ReturnCollectionDto(collection);
  }

  @Delete(':id/books/:bookId')
  @ApiOperation({
    summary: 'Remove a book from a collection (ownership enforced)',
  })
  @ApiParam({ name: 'id', description: 'Collection UUID' })
  @ApiParam({ name: 'bookId', description: 'Book UUID' })
  @ApiResponse({
    status: 200,
    description: 'Book removed',
    type: ReturnCollectionDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  async removeBook(
    @Param('id') id: string,
    @Param('bookId') bookId: string,
    @Request() req,
  ): Promise<ReturnCollectionDto> {
    const userId: string = req.user?.sub ?? req.user?.id;
    const collection = await this.collectionsService.removeBook(
      id,
      bookId,
      userId,
    );
    return new ReturnCollectionDto(collection);
  }
}

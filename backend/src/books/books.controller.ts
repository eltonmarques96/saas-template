import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';
import { Public } from '@/metadata';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // NOTE: Specific routes are declared before :id to avoid route conflicts.

  @Public()
  @Get('popular')
  @ApiOperation({ summary: 'Get popular books ordered by view count' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Max results (default 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of popular books',
    type: [ReturnBookDto],
  })
  async findPopular(@Query('limit') limit?: string): Promise<ReturnBookDto[]> {
    const books = await this.booksService.findPopular(
      limit ? Number(limit) : 10,
    );
    return books.map((b) => new ReturnBookDto(b));
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Full-text search books via Elasticsearch' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiResponse({ status: 200, description: 'List of matching books' })
  async search(@Query('q') q: string): Promise<any[]> {
    return await this.booksService.search(q || '');
  }

  @Public()
  @Get('isbn/:isbn')
  @ApiOperation({
    summary: 'Get a book by ISBN (fetches from OpenLibrary if not cached)',
  })
  @ApiParam({ name: 'isbn', description: 'Book ISBN' })
  @ApiResponse({ status: 200, description: 'Book found', type: ReturnBookDto })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async findByIsbn(@Param('isbn') isbn: string): Promise<ReturnBookDto> {
    const book = await this.booksService.findByIsbn(isbn);
    if (!book) {
      throw new NotFoundException(`Book with ISBN ${isbn} not found`);
    }
    return new ReturnBookDto(book);
  }

  @Public()
  @Get('category/:id')
  @ApiOperation({ summary: 'Get books by category ordered by average stars' })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({
    status: 200,
    description: 'List of books',
    type: [ReturnBookDto],
  })
  async findByCategory(@Param('id') id: string): Promise<ReturnBookDto[]> {
    const books = await this.booksService.findByCategory(id);
    return books.map((b) => new ReturnBookDto(b));
  }

  @Public()
  @Get('author/:id')
  @ApiOperation({ summary: 'Get books by author' })
  @ApiParam({ name: 'id', description: 'Author UUID' })
  @ApiResponse({
    status: 200,
    description: 'List of books',
    type: [ReturnBookDto],
  })
  async findByAuthor(@Param('id') id: string): Promise<ReturnBookDto[]> {
    const books = await this.booksService.findByAuthor(id);
    return books.map((b) => new ReturnBookDto(b));
  }

  @Public()
  @Get('openlibrary/:workId')
  @ApiOperation({
    summary:
      'Get a book by OpenLibrary work ID (fetches and caches if not found locally)',
  })
  @ApiParam({
    name: 'workId',
    description: 'OpenLibrary work ID (e.g. OL123W)',
  })
  @ApiResponse({ status: 200, description: 'Book found', type: ReturnBookDto })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async findByOpenLibraryId(
    @Param('workId') workId: string,
  ): Promise<ReturnBookDto> {
    const book = await this.booksService.findByOpenLibraryId(workId);
    if (!book) {
      throw new NotFoundException(
        `Book with OpenLibrary ID ${workId} not found`,
      );
    }
    await this.booksService.incrementViewCount(book.id);
    return new ReturnBookDto(book);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a book by UUID (increments view count)' })
  @ApiParam({ name: 'id', description: 'Book UUID' })
  @ApiResponse({ status: 200, description: 'Book found', type: ReturnBookDto })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async findById(@Param('id') id: string): Promise<ReturnBookDto> {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id,
      );

    const book = isUuid
      ? await this.booksService.findById(id)
      : await this.booksService.findByOpenLibraryId(id);

    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    await this.booksService.incrementViewCount(book.id);
    return new ReturnBookDto(book);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a book (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Book created',
    type: ReturnBookDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() dto: CreateBookDto): Promise<ReturnBookDto> {
    const book = await this.booksService.create(dto);
    return new ReturnBookDto(book);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a book (admin only)' })
  @ApiParam({ name: 'id', description: 'Book UUID' })
  @ApiResponse({
    status: 200,
    description: 'Book updated',
    type: ReturnBookDto,
  })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBookDto,
  ): Promise<ReturnBookDto> {
    const book = await this.booksService.update(id, dto);
    return new ReturnBookDto(book);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a book (admin only)' })
  @ApiParam({ name: 'id', description: 'Book UUID' })
  @ApiResponse({ status: 200, description: 'Book deleted' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.booksService.remove(id);
    return { message: 'Book deleted successfully' };
  }
}

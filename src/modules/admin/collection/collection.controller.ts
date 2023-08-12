import {
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post, Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CollectionService } from './collection.service';
import { IPagination, Pagination } from 'src/decorators/pagination.decorators';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CollectionDto } from './collection.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ImageService } from '../../image/image.service';
import { IMAGES_FOLDER } from 'src/constants/images';

@ApiTags('Admin Collections')
@Controller('')
export class CollectionController {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly imageService: ImageService,
  ) {
  }

  @Get()
  @ApiOperation({ summary: 'Возвращает список коллекций' })
  @HttpCode(HttpStatus.OK)
  @AuthGuard()
  async getCollectionList(@Pagination() pagination: IPagination) {
    const collections = await this.collectionService.getCollectionList(pagination);

    return { data: collections };
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, description: 'ID товара', example: '5' })
  @ApiOperation({ summary: 'Возвращает расширенную информацию по конкретной коллекции' })
  @HttpCode(HttpStatus.OK)
  @AuthGuard()
  async getCollectionByID(@Param('id') id: number) {
    const collection = await this.collectionService.getCollectionByID(id);

    return { data: collection };
  }

  @Post()
  @ApiOperation({ summary: 'Создание новой коллекции' })
  @ApiBearerAuth('token')
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  @AuthGuard()
  @UseInterceptors(AnyFilesInterceptor())
  async createCollection(
    @Body() payload: CollectionDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const collection = await this.collectionService.createCollection(payload);

    const pathToSave = `${IMAGES_FOLDER.COLLECTIONS}/${collection.id}`;
    await this.imageService.uploadImage(pathToSave, files);

    return { data: collection };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновление коллекции' })
  @ApiBearerAuth('token')
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(AnyFilesInterceptor())
  async updateCollection(
    @Param('id') id: number,
    @Body() payload: CollectionDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const collection = await this.collectionService.updateCollection(id, payload);

    const pathToSave = `${IMAGES_FOLDER.COLLECTIONS}/${collection.id}`;
    await this.imageService.uploadImage(pathToSave, files);

    return { data: collection };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление конкретной коллекции' })
  @ApiBearerAuth('token')
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async deleteCollection(@Param('id') id: number) {
    await this.collectionService.deleteCollection(id);

    const pathToRemove = `${IMAGES_FOLDER.COLLECTIONS}/${id}`;
    await this.imageService.removeImages(pathToRemove);

    return { data: { status: true } };
  }
}

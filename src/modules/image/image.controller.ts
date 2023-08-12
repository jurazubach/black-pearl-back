import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { AuthGuard } from '../admin/auth/guards/auth.guard';
import { Auth } from '../../decorators/auth.decorators';
import { IJwtToken } from '../admin/auth/auth.interfaces';

@ApiTags('Images')
@Controller('images')
export class ImageController {
  constructor(private imageService: ImageService) {
  }

  @Get('download-from-s3')
  @ApiOperation({ summary: 'Скачивания и разворачивание всех картинок из s3' })
  @ApiBearerAuth('token')
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async downloadFromS3(@Auth() auth: IJwtToken) {
    const imagesZip = await this.imageService.downloadImagesFromS3();
    await this.imageService.unzipImages(imagesZip);

    return { data: { success: true } };
  }

  @Get('upload-to-s3')
  @ApiOperation({ summary: 'Архивирование и отправка всех картинок на s3' })
  @ApiBearerAuth('token')
  @AuthGuard()
  @HttpCode(HttpStatus.OK)
  async uploadToS3(@Auth() auth: IJwtToken) {
    const imagesZipPath = await this.imageService.compactImagesToZip();
    await this.imageService.uploadImagesToS3(imagesZipPath);

    return { data: { success: true } };
  }

  // @Post('files')
  // @UseInterceptors(AnyFilesInterceptor())
  // async uploadFiles(
  //   @Body() payload: any,
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  // ) {
  // }

  // @Post('file')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(@UploadedFile() file: Express.Multer.File) {
  // }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { Express } from 'express';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';

@Injectable()
export class ImageService {
  constructor(
    private readonly configService: ConfigService
  ) {}

  async uploadImage(pathToSave: string, files: Array<Express.Multer.File>) {
    if (Array.isArray(files) && files.length === 0) {
      return true;
    }

    const fullPath = path.join(__dirname, '../../../..', 'public', 'images', pathToSave);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
    }

    return Promise.all(files.map((file) => {
      return writeFile(`${fullPath}/${file.originalname}`, file.buffer, 'binary');
    }));
  }

  async removeImages(pathToRemove: string) {
    const fullPath = path.join(__dirname, '../../../..', 'public', 'images', pathToRemove);
    if (existsSync(fullPath)) {
      rmSync(fullPath, { recursive: true, force: true });
    }

    return true;
  }

  async unzipImages(imagesZip: any) {
    // TODO: тут мы разахривируем зип архив, удаляем всё из папки images и всё ложим в папки с картинками из архива
  }

  async compactImagesToZip() {
    // TODO: тут собираем все папки и картинки, и архивируем их в 1 архив, ложим кудато, и отдаём ссылку на архив
    return '';
  }

  // TODO: вызывается из админки
  async downloadImagesFromS3() {
    // тут мы заходим на S3 и скачиваем архивы все и их распрарсиваем и ложим все картинки
    return null;
  }

  async syncImages() {
    // берёт все папки и смотрит с записями в бд, и удаляем не нужные папки, если таких записей уже нету
    // и пишет наоборот если запись есть а папок нету
  }

  // TODO: вызывается из админки
  async uploadImagesToS3(imagesZipPath: string) {
  // async uploadImagesToS3(dataBuffer: Buffer, fileName: string) {
    // тут мы загружаем на s3
    const s3 = new S3();

    const uploadResult = await s3.upload({
      ACL: 'public-read',
      Bucket: this.configService.get<string>('AWS_BUCKET_NAME') as string,
      Body: 'dataBuffer',
      Key: `${uuid()}-${'fileName'}`,
    }).promise();
  }
}

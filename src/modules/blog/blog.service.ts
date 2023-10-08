import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from 'src/decorators/pagination.decorators';
import { ARTICLE_STATUS, ArticleEntity } from 'src/entity/article.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {
  }

  async getArticleList(pagination: IPagination) {
    return this.articleRepository
      .createQueryBuilder('a')
      .select(
        `
        a.id,
        a.alias,
        a.title,
        a.imageSrc,
        a.createdAt
        `,
      )
      .where(`a.status = :status`, { status: ARTICLE_STATUS.ACTIVE })
      .orderBy('a.createdAt', 'DESC')
      .limit(pagination.limit)
      .offset(pagination.offset)
      .getRawMany<ArticleEntity>();
  }

  async getArticle(alias: string) {
    const article = await this.articleRepository
      .createQueryBuilder('a')
      .select(
        `
        a.id,
        a.alias,
        a.title,
        a.imageSrc,
        a.text,
        a.lang,
        a.createdAt
        `,
      )
      .where(`a.alias = :alias AND a.status = :status`, { alias, status: ARTICLE_STATUS.ACTIVE })
      .getRawOne<ArticleEntity>();

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    return article;
  }
}

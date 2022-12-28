import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import crypto from "crypto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import qs from "querystring";
import { ShortUrlEntity } from "src/entity/shortUrl.entity";

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(ShortUrlEntity)
    private readonly shortUrlRepository: Repository<ShortUrlEntity>,
    private readonly configService: ConfigService
  ) {}

  generateRandomHash() {
    return crypto.randomBytes(4).toString("hex");
  }

  generateShortUrl(hash: string) {
    const protocol = this.configService.get<string>("API_PROTOCOL");
    const host = this.configService.get<string>("API_HOST");
    const port = this.configService.get<string>("API_PORT");
    const routePrefix = this.configService.get<string>("ROUTE_PREFIX");

    const portPart = port ? `:${port}` : "";
    const hostname = `${protocol}://${host}${portPart}/${routePrefix}`;

    return `${hostname}/url/s/${hash}`;
  }

  async createShortUrl(url: string): Promise<string | never> {
    const hash = this.generateRandomHash();

    const shortUrl = new ShortUrlEntity();
    Object.assign(shortUrl, { hash, url: encodeURIComponent(url) });

    await this.shortUrlRepository.save(shortUrl);

    return this.generateShortUrl(hash);
  }

  async getShortUrlByHash(hash: string) {
    const shortUrl:
      | ShortUrlEntity
      | undefined = await this.shortUrlRepository.findOne({
      where: { hash },
    });

    if (!shortUrl) {
      throw new HttpException("Incorrect short link", HttpStatus.BAD_REQUEST);
    }

    return shortUrl;
  }

  async decodeHash(hash: string): Promise<string | never> {
    const shortUrl: ShortUrlEntity = await this.getShortUrlByHash(hash);

    return decodeURIComponent(shortUrl.url);
  }

  async upLinkReview(hash: string) {
    const shortUrl: ShortUrlEntity = await this.getShortUrlByHash(hash);

    return this.shortUrlRepository
      .createQueryBuilder()
      .update({ review: shortUrl.review + 1 })
      .where("hash = :hash", { hash })
      .execute();
  }

  getFrontBaseUrl(path?: string, queryParams?: { [key: string]: any }) {
    const protocol = this.configService.get("APP_PROTOCOL");
    const host = this.configService.get("APP_HOST");
    const port = this.configService.get("APP_PORT");

    const delimited = path && path.includes("?") ? "&" : "?";
    const stringifyQueryParams = queryParams
      ? `${delimited}${qs.stringify(queryParams)}`
      : "";

    return `${protocol}://${host}${port ? `:${port}` : ""}${
      path || ""
    }${stringifyQueryParams}`;
  }

  getApiBaseUrl(path?: string, queryParams?: { [key: string]: any }) {
    const protocol = this.configService.get("API_PROTOCOL");
    const host = this.configService.get("API_HOST");
    const port = this.configService.get("API_PORT");

    const delimited = path && path.includes("?") ? "&" : "?";
    const stringifyQueryParams = queryParams
      ? `${delimited}${qs.stringify(queryParams)}`
      : "";

    return `${protocol}://${host}${
      port ? `:${port}` : ""
    }/api${path}${stringifyQueryParams}`;
  }
}

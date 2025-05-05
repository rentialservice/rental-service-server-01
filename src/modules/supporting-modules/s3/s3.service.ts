import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { v4 as uuidv4 } from "uuid";
import { Repository } from "typeorm";
import { Buyer } from "../../users/buyer/entities/buyer.entity";

@Injectable()
export class S3Service {
  constructor(
    @InjectRepository(Buyer)
    private readonly buyerRepository: Repository<Buyer>,
  ) {}
  bucketName = process.env.S3_BUCKET_NAME;
  s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
    region: process.env.S3_REGION,
  });

  // let folderPath = 'ProfileImages/';     // for sample
  async uploadImageS3(file: any, folderPath: string) {
    const originalFilename = file.originalname.replace(/\s+/g, "");
    const fileExtension = originalFilename.split(".").pop();
    const baseFilename = originalFilename.replace(`.${fileExtension}`, "");
    const uniqueFilename = `${baseFilename}_${uuidv4()}.${fileExtension}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Body: file.buffer,
      Key: folderPath + uniqueFilename,
      ACL: "public-read",
      ContentDisposition: "inline",
    });
    await this.s3.send(command);
    const fileURL = `https://s3.${process.env.S3_REGION}.amazonaws.com/${process.env.S3_BUCKET_NAME}/${folderPath}${uniqueFilename}`;
    return fileURL;
  }

  async deleteImageS3(fileURL: string, folderPath: string) {
    let uniqueFilename = fileURL.split(folderPath)[1];
    let command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: folderPath + uniqueFilename,
    });
    await this.s3.send(command);
    return { message: "Media deleted successfully" };
  }
}

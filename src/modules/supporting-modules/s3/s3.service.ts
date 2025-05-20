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
    private readonly buyerRepository: Repository<Buyer>
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
    // Validate file type
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
    const allowedExtensions = [".jpeg", ".jpg", ".png"];

    const originalFilename = file.originalname.replace(/\s+/g, "");
    const fileExtension = originalFilename.split(".").pop().toLowerCase();
    const mimeType = file.mimetype.toLowerCase();

    // Check both extension and mime type for security
    if (
      !allowedExtensions.includes(`.${fileExtension}`) ||
      !allowedMimeTypes.includes(mimeType)
    ) {
      throw new Error("Only JPEG, JPG, and PNG images are allowed");
    }

    const baseFilename = originalFilename.replace(`.${fileExtension}`, "");
    const uniqueFilename = `${baseFilename}_${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Body: file.buffer,
      Key: folderPath + uniqueFilename,
      ACL: "public-read",
      ContentDisposition: "inline",
      ContentType: mimeType, // Set proper content type
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

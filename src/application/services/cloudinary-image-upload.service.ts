import { ImageRepository } from '@domain/repositories/image.repository';
import {
  ImageUploaderService,
  ImageUploadResponse,
  UsersImageUploadsResponse,
} from './image-uploader.service';
import { createHash } from 'node:crypto';
import { ImageUploadRepository } from '@domain/repositories/image-upload.repository';
import { ImageUpload } from '@domain/entities/image-upload';
import { Image } from '@domain/entities/image';
import { CloudinaryService } from 'nestjs-cloudinary';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { generateSlugFromFilename } from '@app/utils/generate-slug-from-filename';
import { UUID } from '@domain/value-objects/uuid';
import { UserRepository } from '@domain/repositories/user.repository';

@Injectable()
// TODO: decouple this service from the implemetation of cloudinary
export class CloudinaryImageUploadService implements ImageUploaderService {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly userRepository: UserRepository,
    private readonly imageUploadRepository: ImageUploadRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async findImageById(
    imageUploadId: UUID,
    userId: UUID,
  ): Promise<ImageUploadResponse> {
    const imageUpload =
      await this.imageUploadRepository.findById(imageUploadId);
    if (imageUpload === null) {
      throw new NotFoundException({
        message: 'Image not found',
      });
    }
    if (!imageUpload.owner.id.equals(userId)) {
      throw new UnprocessableEntityException({
        message: 'You are not the owner of this image',
      });
    }

    return {
      id: imageUpload.id.value,
      url: imageUpload.image.url,
      status: imageUpload.status,
    };
  }
  async deleteImage(imageUploadId: UUID, userId: UUID): Promise<void> {
    const imageUpload =
      await this.imageUploadRepository.findById(imageUploadId);
    if (imageUpload === null) {
      throw new UnprocessableEntityException({
        message: 'Image not found',
      });
    }
    if (!imageUpload.owner.id.equals(userId)) {
      throw new UnprocessableEntityException({
        message: 'You are not the owner of this image',
      });
    }

    await this.imageUploadRepository.delete(imageUploadId);
    // TODO: check if image has any other reference besides the current user,
    // otherwise, delete the image from storage. Do this asyncronously, with a
    // NodeJS stream
  }
  async findAllByUserId(userId: UUID): Promise<UsersImageUploadsResponse> {
    const uploads = await this.imageUploadRepository.findByUser(userId);
    return {
      userId: userId.value,
      uploads: uploads.map((imageUpload) => {
        return {
          id: imageUpload.id.value,
          url: imageUpload.image.url,
          status: imageUpload.status,
        };
      }),
    };
  }
  async uploadImage(
    file: Express.Multer.File,
    filename: string,
    userId: UUID,
  ): Promise<ImageUploadResponse> {
    const fileHash = createHash('sha256').update(file.buffer).digest('hex');
    // If the image is already in the database, return the url

    const existingImage = await this.imageRepository.findByHash(fileHash);
    const user = await this.userRepository.findById(userId);
    if (existingImage !== null) {
      const imageUploaded = await this.imageUploadRepository.save(
        new ImageUpload({
          status: 'success',
          image: existingImage,
          uploadedBy: user,
          uploadedAt: new Date(),
        }),
      );
      return {
        id: imageUploaded.id.value,
        url: existingImage.url,
        status: imageUploaded.status,
      };
    }

    // Upload the image to cloudinary
    // TODO: handle this asyncronously in a NodeJs stream
    const uploadReponse = await this.cloudinaryService.uploadFile(file);
    if ('http_code' in uploadReponse) {
      throw new UnprocessableEntityException(
        {
          statusCode: 422,
          message: 'Image upload failed, try again later',
        },
        {
          description: 'Image upload failed, try again later',
          cause: uploadReponse.message,
        },
      );
    }

    let uploadedImage = new Image({
      url: uploadReponse.secure_url,
      hash: fileHash,
      filename: filename,
    });
    uploadedImage.setExternalIdentity(uploadReponse.public_id);
    uploadedImage.setSlug(generateSlugFromFilename(filename));
    uploadedImage.setUpdatedAt(new Date());
    uploadedImage.setCreatedAt(new Date());

    uploadedImage = await this.imageRepository.create(uploadedImage);
    let imageUpload = uploadedImage.prepareUpload(user);
    imageUpload.changeStatusToSucess();

    imageUpload = await this.imageUploadRepository.save(imageUpload);
    return {
      id: imageUpload.id.value,
      url: uploadedImage.url,
      status: imageUpload.status,
    };
  }
}

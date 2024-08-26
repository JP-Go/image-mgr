import { Image } from './image';
import { User } from './user';
import { UUID } from '@domain/value-objects/uuid';

export class ImageUpload {
  private _id: UUID;
  private _image: Image;
  private _uploadedBy: User;
  private _uploadedAt: Date;
  private _status: 'pending' | 'success' | 'failed';
  constructor({
    id,
    image,
    status,
    uploadedBy,
    uploadedAt,
  }: {
    id?: UUID;
    image: Image;
    status?: 'pending' | 'success' | 'failed';
    uploadedBy: User;
    uploadedAt: Date;
  }) {
    this._uploadedAt = uploadedAt;
    this._uploadedBy = uploadedBy;
    this._image = image;
    this._id = id === undefined ? UUID.new() : id;
    this._status = status === undefined ? 'pending' : status;
  }

  get id() {
    return this._id;
  }

  get image() {
    return this._image;
  }

  get status() {
    return this._status;
  }

  get owner() {
    return this._uploadedBy;
  }
  get uploadedAt() {
    return this._uploadedAt;
  }

  set owner(user: User) {
    this._uploadedBy = user;
  }

  private changeStatus(status: 'pending' | 'success' | 'failed') {
    this._status = status;
    this._uploadedAt = new Date();
  }

  changeStatusToSucess() {
    this.changeStatus('success');
  }

  changeStatusToFailed() {
    this.changeStatus('failed');
  }
}

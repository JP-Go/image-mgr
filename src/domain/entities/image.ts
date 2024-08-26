import { UUID } from '@domain/value-objects/uuid';
import { ImageUpload } from './image-upload';
import { User } from './user';

export class Image {
  private _id: UUID;
  private _filename: string;
  private _url: string;
  private _hash: string;
  private _slug: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _externalIdentity: string;

  constructor({
    id,
    filename,
    url,
    hash,
  }: {
    id?: UUID;
    filename: string;
    url: string;
    hash: string;
  }) {
    this._id = id;
    this._filename = filename;
    this._url = url;
    this._hash = hash;
  }

  get id() {
    return this._id;
  }
  get filename() {
    return this._filename;
  }
  get url() {
    return this._url;
  }
  get hash() {
    return this._hash;
  }
  get slug() {
    return this._slug;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  get externalIdentity() {
    return this._externalIdentity;
  }

  setCreatedAt(created_at: Date) {
    this._createdAt = created_at;
  }
  setExternalIdentity(identity: string) {
    this._externalIdentity = identity;
  }
  setUpdatedAt(updated_at: Date) {
    this._updatedAt = updated_at;
  }
  setSlug(slug: string) {
    this._slug = slug;
  }
  setHash(hash: string) {
    this._hash = hash;
  }
  setFilename(filename: string) {
    this._filename = filename;
  }
  setUrl(url: string) {
    this._url = url;
  }
  setId(id: UUID) {
    this._id = id;
  }

  isSameAs(other: Image): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (other === this) {
      return true;
    }

    if (other.hash === this.hash) {
      return this._id.equals(other.id);
    }

    return false;
  }

  prepareUpload(user: User) {
    return new ImageUpload({
      uploadedAt: new Date(),
      image: this,
      uploadedBy: user,
      status: 'pending',
    });
  }
}

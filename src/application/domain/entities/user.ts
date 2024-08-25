import { UserId } from '../value-objects/user-id';

export class User {
  private _id: UserId;
  private _username: string;
  private _email: string;
  private _password: string;
  constructor({
    username,
    email,
    password,
    id,
  }: {
    username: string;
    email: string;
    password: string;
    id?: string;
  }) {
    this._username = username;
    this._email = email;
    this._password = password;
    this._id = new UserId(id);
  }

  get id() {
    return this._id;
  }

  get username() {
    return this._username;
  }
  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }
}

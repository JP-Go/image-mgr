export class User {
  constructor(
    private _username: string,
    private _email: string,
    private _password: string,
  ) {}

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

export class User {
  public id: string;
  public name: string;
  public email: string;
  public password: string;
  public role: "personal";

  constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    role: "personal"
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}

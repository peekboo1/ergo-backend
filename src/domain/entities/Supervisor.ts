export class Supervisor {
  public id: string;
  public name: string;
  public email: string;
  public password: string;
  public role?: "supervisor";
  public companyId?: string;

  constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    role?: "supervisor",
    companyId?: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.companyId = companyId;
  }
}

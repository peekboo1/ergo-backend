export class Company {
  constructor(
    public id: string,
    public name: string,
    public phone: string,
    public address: string,
    public email: string,
    public website: string
  ) {}

  static fromModel(model: any): Company {
    return new Company(
      model.id,
      model.name,
      model.phone,
      model.address,
      model.email,
      model.website
    );
  }
}

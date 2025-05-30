export class Employee {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: "employee",
    public companyId: string,
    public divisionId: string,
    public supervisorId: string,
    public divisionName?: string,
    public companyName?: string,
    
  ) {}
}

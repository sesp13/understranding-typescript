abstract class Department {
  // private id: string;
  // private name: string;
  protected employees: string[] = [];
  static fiscalYear = 2020;

  constructor(public name: string, protected readonly id: string) {
    // this.name = n;
  }

  abstract describe(this: Department): void;

  addEmploye(employee: string) {
    this.employees.push(employee);
  }

  printEmployeeInformation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }

  static createEmployee(name: string) {
    return { name };
  }
}

class ItDepartment extends Department {
  admins: string[];
  constructor(id: string, admins: string[]) {
    super(id, 'IT');
    this.admins = admins;
  }

  describe(): void {
    console.log(`It department ${this.id}`);
  }
}

class AccountingDepartment extends Department {
  private lastReport: string;
  private static instance: AccountingDepartment;

  get mostRecentReport() {
    if (this.lastReport) {
      return this.lastReport;
    }

    throw new Error('No report found');
  }

  set mostRecentReport(value: string) {
    if (!value) {
      throw new Error('Please pass a valid value for the report');
    }
    this.addReport(value);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AccountingDepartment('C1', []);
    }
    return this.instance;
  }

  private constructor(id: string, private reports: string[]) {
    super(id, 'Accounting');
    this.lastReport = this.reports[0];
  }

  addReport(text: string) {
    this.reports.push(text);
    this.lastReport = text;
  }

  printReport() {
    console.log(this.reports);
  }

  addEmploye(employee: string): void {
    if (employee == 'Max') {
      return;
    }
    this.employees.push(employee);
  }

  describe(): void {
    console.log(`Accounting department ${this.id}`);
  }
}

const employe1 = Department.createEmployee('Max');
console.log(employe1, Department.fiscalYear);

const it = new ItDepartment('Accounting', ['Max']);
it.addEmploye('Max');
it.addEmploye('Manu');
it.describe();
it.printEmployeeInformation();
console.log(it);

const accounting = AccountingDepartment.getInstance();
const accounting2 = AccountingDepartment.getInstance();
console.log(accounting, accounting2);

accounting.mostRecentReport = '';
accounting.addReport('Something went wrong');
console.log(accounting.mostRecentReport);
accounting.printReport();
accounting.addEmploye('Max');
accounting.addEmploye('Manu');
accounting.printEmployeeInformation();
accounting.describe();

// const accountingCopy = { name: 'copy', describe: accounting.describe };
// accountingCopy.describe();

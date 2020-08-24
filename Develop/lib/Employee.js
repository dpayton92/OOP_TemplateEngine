// TODO: Write code to define and export the Employee class
// create an employee class
class Employee{
    constructor(name, id, email){
        this.name = name;
        this.id = id;
        this.email = email;
    }

    getname(){
        return this.name;
    }

    getId(){
        return this.id;
    }

    getEmail(){
        return this.email;
    }

    getRole(){
        return "Employee"
    }
}
// export the employee

module.exports = Employee;
# EmployeeTracker
This Command Line application allows you to build and track a company.  Within the application, the user has the following actions at his/her disposal:


  * Add Departments 
  * Add Roles
  * Add Employees
  * View Departments
  * View Roles
  * View Employees
  * Update Employee Roles

## Features/Technology/Requirments.

* This application does not need to be seeded as if there are no employees/roles or departments and you try to view one of these categories, it will tell you that none exist and are provided an option to add.

* The application is built out enough so that it will adjust to the required dependencies.  For example, Roles require a Department.  However, if the user chooses to Add a Role before a Department, the application is smart enough to check and see if Departments exist in this example, display that information and offer the change to Add a Department instead of going back to the initial Menu choices.

* The application uses Node with the additional packages of [InquirerJs](https://www.npmjs.com/package/inquirer/v/0.2.3), [MySQL](https://www.npmjs.com/package/mysql), and [console.table](https://www.npmjs.conpm/package/console.table).  So these will need to be installed prior to the execution of the application.  Included in the Repository is the `schema.sql` file that illustrates the database and table design.

* The application is written in Javascript (ES6 mostly) with extensive usage of functions, and occasional usage of Template Literals.

* Below is the link to the application in Github.

 [Github Repository](https://github.com/kurt-austin/employeeTracker)



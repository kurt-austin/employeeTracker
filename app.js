const mysql = require('mysql')
const inquirer = require('inquirer')
let tableName = ' ';

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'employee_db',
})

connection.connect(err => {
  if (err) throw err
  console.log(`Connect on thread ${connection.threadId}`)
  initialPrompts()
})



// Build a command-line application that at a minimum allows the user to:

//   * Add departments, roles, employees

//   * View departments, roles, employees

//   * Update employee roles

// Bonus points if you're able to:

//   * Update employee managers

//   * View employees by manager

//   * Delete departments, roles, and employees

//   * View the total utilized budget of a department -- ie the combined salaries of all employees in that department



function initialPrompts() {

  inquirer.prompt([
    {
      name: 'action',
      message: 'What do you want to do?',
      type: 'list',
      choices: [
        'Add Departments',
        'Add Roles',
        'Add Employees',
        'View Departments',
        'View Roles',
        'View Employees',
        'Update Employee Roles',
        // 'Update Employee Managers',
        // 'View Employees by Manager',
        // 'Delete Departments',
        // 'Delete Roles',
        // 'Delete Employees',
        // 'View Budget by Department',
        'EXIT',
      ]
    }
  ]).then(answer => {
    switch (answer.action) {
      case 'Add Departments':
        // let tableName = 'department';
        // addDepts(tableName);
        addDepts();
        break;
      case 'Add Roles':
        // let tableName = 'role';
        // addRoles(tableName);
        addRoles();
        break;
      case 'Add Employees':
        // let tableName = 'employee';
        // addEmployees(tableName);
        addEmployees();
        break;
      case 'View Departments':
        // let tableName = 'department';
        // viewDepts(tableName);
        viewDepts();
        break;
      case 'View Roles':
        // let tableName = 'role';
        // viewRoles(tableName);
        viewRoles();
        break;
      case 'View Employees':
        // let tableName = 'employee';
        // viewEmployees();
        viewEmployees();
        break;
      case 'Update Employee Roles':
        updEmpRoles();
        break;
      // case 'Update Employee Managers':
      //     updEmpMgrs()
      // break
      // case 'View Employees by Manager':
      //     viewEmpbyMgrs()
      // break
      // case 'Delete Departments':
      //     delDepts()
      // break
      // case 'Delete Roles':
      //     delRoles()
      // break
      // case 'Delete Employees':
      //     delEmp()
      // break
      // case 'View Budget by Department':
      //     viewBudget()
      // break
      default:
        connection.end()
        process.exit()
    }
  })

};


function addDepts() {
  inquirer.prompt([{
    message: 'Enter Department Name you want to add',
    name: 'newdept',
  }]).then(answers => {
    console.log(answers);
    console.log("'" + `${answers.newdept}` + "'")

    connection.query(
      "INSERT INTO department (name) values ('" + `${answers.newdept}` + "')",
      (err, newDeptRow) => {
        console.log(newDeptRow);
        if (err) throw err;
        console.table(newDeptRow);
        initialPrompts();
      }
    )
  })

};

function addRoles() {
  connection.query('SELECT COUNT (*) FROM department', (err, countDept) => {
    if (err) throw err;
    if (countDept === 0) {
      console.log("There are no departments");
      inquirer.prompt([
        {
          name: 'add_dept',
          type: 'list',
          message: 'Do you want to add a Department?',
          choices: ['Yes', 'No']
        }
      ]).then(answers => {
        switch (answers.add_dept) {
          case 'Yes':
            addDepts();
            break;
          case 'No':
            initialPrompts();
            break;
        }
      })
    } else {

      inquirer.prompt([
        {
          name: 'title',
          message: "Enter the Role Name you want to add.",
        },
        {
          name: 'salary',
          type: 'number',
          message: "What is the salary?"
        },
        {
          name: 'department_id',
          type: 'number',
          message: "What is the department ID this role belongs to?"
        }
      ]).then(answers => {
        connection.query(
          "INSERT INTO role (title,salary,department_id) values ('" + `${answers.title}` + "','" + `${answers.salary}` + "','" + `${answers.department_id}` + "')",
          (err, newRoleRow) => {
            if (err) throw err
            console.table(newRoleRow)
            initialPrompts()
          }
        )
      })

    }});

  }
 function addEmployees() {
   connection.query('SELECT COUNT (*) FROM role', (err, countRole) => {
     if (err) throw err;

   

   if (countRole === 0) {
     console.log("There are no Roles")

     inquirer.prompt([
       {
         name: 'add_role',
         type: 'list',
         message: 'Do you want to add a Role?',
         choices: ['Yes', 'No']

       }
     ]).then(answers => {
       switch (answers.add_role) {
         case 'Yes':
           addRoles();
           break;
         case 'No':
           initialPrompts();
           break;
       }
     })
   } else {


   inquirer.prompt([
       {
         name: 'first_name',
         message: "Enter the First Name of the employee you want to add.",
       },
       {
         name: 'last_name',
         message: "Enter the Last Name of the employee you want to add."
       },
       {
         name: 'role_id',
         type: 'number',
        //  type: 'list',
         message: "What is role ID this role belongs to?",
        //  choices:
       },
       {
         name: 'manager_id',
         type: 'number',
        //  type: 'list',
         message: "What is the Manager ID this role belongs to?",
        //  choices:
       }
     ]).then(answers => {
       connection.query(
         "INSERT INTO employee (first_name,last_name,role_id,manager_id) values ('"+`${answers.first_name}`+"','"+`${answers.last_name}`+"','"+`${answers.role_id}`+"','"+`${answers.manager_id}`+"')",
         (err, newEmplRow) => {
           if (err) throw err
           console.table(newEmplRow)
           initialPrompts()
         }
       )
     })
    }});
 };


 function viewDepts() {
   connection.query('SELECT COUNT (*) as total FROM department', (err, countDept) => {
     if (err) throw err;
   console.log(countDept[0].total);
   
   if (countDept[0].total === 0) {
     console.log("There are no departments");
     inquirer.prompt([
       {
         name: 'add_dept',
         type: 'list',
         message: 'Do you want to add a Department?',
         choices: ['Yes', 'No']
       }
     ]).then(answers => {
       switch (answers.add_dept) {
         case 'Yes':
           addDepts();
           break;
         case 'No':
           initialPrompts();
           break;
       }
     })
   } else {
   connection.query('SELECT id, name FROM department',
     (err, viewDepts) => {
       if (err) throw err;
       console.table(viewDepts);
       initialPrompts();
    }
   )
 }});
 };


 function viewRoles() {
   connection.query('SELECT COUNT (*) as total FROM role', (err, countRole) => {
     if (err) throw err;


   if (countRole[0].total === 0) {
     console.log("There are no roles");
     inquirer.prompt([
       {
         name: 'add_role',
         type: 'list',
         message: 'Do you want to add a Role?',
         choices: ['Yes', 'No']
       }
     ]).then(answers => {
       switch (answers.add_role) {
         case 'Yes':
           addRoles();
           break;
         case 'No':
           initialPrompts();
           break;
       }
     })
   } else {
   connection.query('SELECT id, title, salary, department_id FROM role',
     (err, viewRoles) => {
       if (err) throw err;
       console.table(viewRoles);
       initialPrompts();
     }
   )
 }   });
 };


 function viewEmployees() {
   connection.query('SELECT COUNT (*) as total FROM employee', (err, countEmp) => {
     if (err) throw err;

   
   if (countEmp[0].total === 0) {
     console.log("There are no Employees");
     inquirer.prompt([
       {
         name: 'add_emp',
         type: 'list',
         message: 'Do you want to add an Employee?',
         choices: ['Yes', 'No']
       }
     ]).then(answers => {
       switch (answers.add_emp) {
         case 'Yes':
           addEmployees();
           break;
         case 'No':
           initialPrompts();
           break;
       }
     })
   } else {
   connection.query('SELECT id, first_name, last_name, role_id, manager_id FROM employee',
     (err, viewEmp) => {
       if (err) throw err;
       console.table(viewEmp);
       initialPrompts();
     }
   )
 }});
};

 function updEmpRoles() {


 };


// function updEmpMgrs(){

// };

// function viewEmpbyMgrs(){


// };

// function delEmp(){


// };


// function delRoles(){


// };

// function delDepts(){


// };


// function viewBudget(){


// };
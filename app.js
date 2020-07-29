// require Node packages MySQL and Inquirer

const mysql = require('mysql')
const inquirer = require('inquirer')
let tableName = ' ';

// Establish Database Connection and test.

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


//   * Update employee roles


// Initial prompt of what the user wants to do

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
         'EXIT',
      ]
    }
  ]).then(answer => {
    switch (answer.action) {
      case 'Add Departments':
        addDepts();
        break;
      case 'Add Roles':
        addRoles();
        break;
      case 'Add Employees':
        addEmployees();
        break;
      case 'View Departments':
        tableName = 'department';
        view(tableName);
        break;
      case 'View Roles':
        tableName = 'role';
        view(tableName);
        break;
      case 'View Employees':
        tableName = 'employee';
        view(tableName);
        break;
      case 'Update Employee Roles':
        updEmpRoles();
        break;
      default:
        connection.end()
        process.exit()
    }
  })

};

// Add Departments.


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

// Adding roles with checking to see if Departments exist first with the option of adding a Department.

function addRoles() {
  connection.query('SELECT COUNT (*) as total FROM department', (err, countDept) => {
    if (err) throw err;
    if (countDept[0].total === 0) {
      console.log("There are no departments, please add department first.");
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
      // connection.query("SELECT NAME FROM department",(err, deptName){
      //     if (err) throw err;

      // })
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
          // type: 'list',
          // choices:
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

  // Add Employees, checking if Roles exist.  If they do not prompt to add Role before adding Employees.

 function addEmployees() {
   connection.query('SELECT COUNT (*) as total FROM role', (err, countRole) => {
     if (err) throw err;

     

   if (countRole[0].total === 0) {
     console.log("There are no Roles, please add Role first.")

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
  //   connection.query("SELECT title FROM role",(err, title){
  //     if (err) throw err;

  // })

//   connection.query("SELECT last_name FROM employee",(err, deptName){
//     if (err) throw err;

// })

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

// View function table name passed from call to console log the results or with the option to add or seed the data.

 function view(tableName) {
   connection.query('SELECT COUNT (*) as total FROM '+ tableName +"", (err, count) => {
     if (err) throw err;
   if (count[0].total === 0) {
     console.log("There are no "+ tableName + "s");
     inquirer.prompt([
       {
         name: 'add',
         type: 'list',
         message: "Do you want to add a "+ tableName + "?",
         choices: ['Yes', 'No']
       }
     ]).then(answers => {
       switch (answers.add) {
         case 'Yes':
           if (tableName==="role"){
             addRoles();
           } else if (tableName==="department"){
             addDepts();
           } else {
             addEmployees();
           };
           break;
         case 'No':
           initialPrompts();
           break;
       }
     })
   } else {
   connection.query("SELECT * FROM "+ tableName +"",
     (err, viewData) => {
       if (err) throw err;
       console.table(viewData);
       initialPrompts();
    }
   )
 }});
 };

 function updEmpRoles() {
  //  connection.query('select first_name, last_name from employee',(err, empchg)=>{
  //    if (err) throw err;
  //  })
  inquirer.prompt([
    {
      name: 'emplchg',
      type: 'list',
      message: "Which Employee do you want to update?",
      choices: ['Yes', 'No']
    }]).then (answers=>{


    });

//  connection.query('select title from role',(err, rolechg)=>{
  //    if (err) throw err;
  //  })

    inquirer.prompt([
      {
        name: "rolechg",
        type: "list",
        message: "Which Role are we changing to?",
        choices: ['Yes','No']
      }
    ]).then (answers2 =>{
      connection.query('UPDATE employee set title = where id = ',(err, update)=>{
         if (err) throw err;
      })
    })

 };


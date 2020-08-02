// require Node packages MySQL, Inquirer, and Console Table

const mysql = require('mysql')
const inquirer = require('inquirer')
const cTable = require('console.table');
let tableName = ' ';
let mgrFnd = ' ';

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
    connection.query(
      "INSERT INTO department (name) values ('" + `${answers.newdept}` + "')",
      (err, newDeptRow) => {
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
      connection.query("SELECT name FROM department", (err, deptName) => {
        if (err) throw err;
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
            name: 'name',
            type: 'list',
            choices: function () {
              const choiceDeptArray = [];
              for (let i = 0; i < deptName.length; i++) {
                choiceDeptArray.push(deptName[i].name);
              }
              return choiceDeptArray
            },
            message: "What is the department this role belongs to?"
          }
        ]).then(answers => {
          connection.query("SELECT id from department WHERE name='" + `${answers.name}` + "'", (err, deptId) => {
            if (err) throw err;
            connection.query(
              
              "INSERT INTO role (title, salary,department_id) values ('" + `${answers.title}` + "','" + `${answers.salary}` + "','" + deptId[0].id + "')",
              (err, newRoleRow) => {
                if (err) throw err
                console.table(newRoleRow)
                initialPrompts()
              }
            )
          });
        })
      })
    }
  });
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
      connection.query("SELECT title FROM role", (err, title) => {
        if (err) throw err;
      connection.query("SELECT id FROM role where title ='Manager'",(err, mgrId)=>{
     
        if (err) throw err;
      
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
            name: 'title',
            type: 'list',
            choices: function () {
              const choiceArray = [];
              for (let i = 0; i < title.length; i++) {
                choiceArray.push(title[i].title);
              }
              return choiceArray
            },
            message: "What role are we assiging to the employee?"
          },

          {
            name: 'manager_id',
            type: 'list',
            choices: function () {
             const choiceMgrArray = ["None"];
              
               if (mgrId.length > 0){
               for (let i = 0; i < mgrId.length; i++ ){
                 choiceMgrArray.push(mgrId[i].id)
               }
              }
               return choiceMgrArray;
            },
            message: "What Manager ID are we assiging this employee to?"
          }
        ]).then(answers => {
          connection.query("SELECT id from role WHERE title='" + `${answers.title}` + "'", (err, roleId) => {
            if (err) throw err;
            if (answers.manager_id === "None"){
              answers.manager_id = null
            }
            connection.query(
              "INSERT INTO employee (first_name,last_name,role_id,manager_id) values ('" + `${answers.first_name}` + "','" + `${answers.last_name}` + "','" + roleId[0].id + "'," + `${answers.manager_id}` + ")",
              (err, newEmplRow) => {
                if (err) throw err
                console.table(newEmplRow)
                initialPrompts()
              }
            )
          });
        })
      })
      })
    }
  
  });
};

// View function table name passed from call to console log the results or with the option to add or seed the data.

function view(tableName) {
  connection.query('SELECT COUNT (*) as total FROM ' + tableName + "", (err, count) => {
    if (err) throw err;
    if (count[0].total === 0) {
      console.log("There are no " + tableName + "s");
      inquirer.prompt([
        {
          name: 'add',
          type: 'list',
          message: "Do you want to add a " + tableName + "?",
          choices: ['Yes', 'No']
        }
      ]).then(answers => {
        switch (answers.add) {
          case 'Yes':
            if (tableName === "role") {
              addRoles();
            } else if (tableName === "department") {
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
      connection.query("SELECT * FROM " + tableName + "",
        (err, viewData) => {
          if (err) throw err;
          console.table(viewData);
          initialPrompts();
        }
      )
    }
  });
};

// Function Update Employee Roles.  Asking which Employee and then which Role.

function updEmpRoles() {
  connection.query('SELECT COUNT (*) AS total from employee',(err, countUpdEmpl)=>{
     if (err) throw err;
     if (countUpdEmpl[0].total===0){
       console.log("There are no employees, please choose another option");
       initialPrompts();
     } else {
  
  connection.query('select first_name, last_name from employee', (err, empchg) => {
    if (err) throw err;
    inquirer.prompt([
      {
        name: 'emplchg',
        type: 'list',
        message: "Which Employee do you want to update?",
        choices: function () {
          const choiceEmplArray = [];
          for (let i = 0; i < empchg.length; i++) {
            choiceEmplArray.push(empchg[i].first_name + " " + empchg[i].last_name)
          }
          return choiceEmplArray;
        }
      }]).then(answers => {
        var arrayAnswers = answers.emplchg.split(" ");
        for (let j = 0; j < arrayAnswers.length; j++) {
          var firstName = arrayAnswers[0]
          var lastName = arrayAnswers[1]
        };
        connection.query("SELECT id FROM employee where first_name ='" + firstName + "' AND last_name ='" + lastName + "'", (err, findId) => {
          if (err) throw err;
          connection.query('SELECT title from role', (err, roleChange) => {
            if (err) throw err
            inquirer.prompt([
              {
                name: "rolechg",
                type: "list",
                message: "Which Role are we changing to?",
                choices: function () {
                  const choiceRoleArray = [];
                  for (let i = 0; i < roleChange.length; i++) {
                    choiceRoleArray.push(roleChange[i].title)
                  }
                  return choiceRoleArray;
                }
              }
            ]).then(answers2 => {
              connection.query("SELECT id FROM role WHERE title ='" + answers2.rolechg + "'", (err, roleId) => {
                if (err) throw err;
                connection.query('UPDATE employee set role_id =' + roleId[0].id + ' where id = ' + findId[0].id + '', (err,update) => {
                  if (err) throw err;
                  initialPrompts();
                })
              })
            })
          })
        });
      });
  })
}
})
};


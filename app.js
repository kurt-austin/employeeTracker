const mysql = require('mysql')
const inquirer = require('inquirer')

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'top_songsDB',
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



function initialPrompts(){

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
            addDepts();
            break;
          case 'Add Roles':
            addRoles();
            break;
          case 'Add Employees':
            addEmployees();
            break;
          case 'View Departments':
            viewDepts();
            break;
            case 'View Roles':
                viewRoles();
            break;
            case 'View Employees':
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


function addDepts(){
    inquirer.prompt([{
        message: 'Enter Department Name you want to add',
        name: 'newdept',
      }]).then(answers => {
        connection.query(
          `INSERT INTO department (name) values (${answers.newdept})`,  
          (err, newDeptRow) => {
            if (err) throw err;
            console.table(newDeptRow);
            initialPrompts();
          }
        )
      })


};

function addRoles(){
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
          `INSERT INTO role (title,salary,department_id) values (${answers.title},${answers.salary},${answers.department_id})`,
          (err, newRoleRow) => {
            if (err) throw err
            console.table(newRoleRow)
            initialPrompts()
          }
        )
      })


};

function addEmployees(){
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
            message: "What is role ID this role belongs to?"
          },
          {
              name: 'manager_id',
              type: 'number',
              message: "What is the Manager ID this role belongs to?"
            }
      ]).then(answers => {
        connection.query(
          `INSERT INTO employee (first_name,last_name,role_id,manager_id) values (${answers.first_name},${answers.last_name},${answers.role_id},${answers.manager_id})`,
          (err, newEmplRow) => {
            if (err) throw err
            console.table(newEmplRow)
            initialPrompts()
          }
        )
      })



};


function viewDepts(){
    connection.query('SELECT id, name FROM department', 
        (err, viewDepts) => {
          if (err) throw err;
          console.table(viewDepts);
          initialPrompts();
        }
      )

};


function viewRoles(){
    connection.query('SELECT id, title, salary, department_id FROM role', 
        (err, viewRoles) => {
          if (err) throw err;
          console.table(viewRoles);
          initialPrompts();
        }
      )


};


function viewEmployees(){
    connection.query('SELECT id, first_name, last_name, role_id, manager_id FROM employee', 
        (err, viewEmp) => {
          if (err) throw err;
          console.table(viewEmp);
          initialPrompts();
        }
      )


};

function updEmpRoles(){


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
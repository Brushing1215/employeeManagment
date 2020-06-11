var mysql = require("mysql");
var inquirer = require("inquirer");
const logo = require("asciiart-logo");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootroot",
  database: "EmpManagement_DB",
});

const viewAllDQuery = (cb) => {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    cb(results);
  });
};

const updateEmp = () => {
  connection.query(
    "SELECT first_name, last_name, id FROM employee",
    (err, results) => {
      if (err) throw err;
      const employees = results.map((emp) => {
        return { name: `${emp.first_name} ${emp.last_name}`, value: emp.id };
      });
      connection.query("SELECT title, id FROM role", (err, results) => {
        const roles = results.map((role) => {
          return { name: role.title, value: role.id };
        });
        inquirer
          .prompt([
            {
              type: "list",
              name: "id",
              message: "Which employess would you like to update?",
              choices: employees,
            },
            {
              type: "list",
              name: "role_id",
              message: "What is the new role?",
              choices: roles,
            },
          ])
          .then((answers) => {
            connection.query(
              "UPDATE employee SET role_id = ? WHERE id = ?",
              [answers.role_id, answers.id],
              (err) => {
                if (err) throw err;
                console.log("successfully updated");
                startQuestion();
              }
            );
          });
      });
    }
  );
};
const addRole = () => {
  viewAllDQuery((results) => {
    const departments = results.map((dep) => {
      return { name: dep.name, value: dep.id };
    });
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the role title",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the roles salary",
        },
        {
          type: "list",
          name: "department_id",
          message: "What department is this role in?",
          choices: departments,
        },
      ])
      .then((answers) => {
        answers.salary = parseFloat(answers.salary);
        connection.query("INSERT INTO role SET ? ", answers);
        startQuestion();
      });
  });
};
const viewAllD = () => {
  viewAllDQuery((results) => {
    console.table(results);
    startQuestion();
  });
};

const addDep = () => {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the department name?",
      },
    ])
    .then((answer) => {
      connection.query("INSERT INTO department SET? ", answer, (err) => {
        if (err) throw err;
        startQuestion();
      });
    });
};
const viewRole = () => {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    console.table(results);
    startQuestion();
  });
};
const viewEmp = () => {
  connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",
   (err, results) => {
    if (err) throw err;
    console.table(results);
    startQuestion();
  });
};
const addEmp = () => {
  connection.query(
    "SELECT first_name, last_name, id FROM employee",
    (err, results) => {
      if (err) throw err;
      const manager = results.map((emp) => {
        return { name: `${emp.first_name} ${emp.last_name}`, value: emp.id };
      });
      connection.query("SELECT title, id FROM role", (err, results) => {
        const roles = results.map((role) => {
          return { name: role.title, value: role.id };
        });
        inquirer
          .prompt([
            {
              type: "input",
              name: "first_name",
              message: "What is the first name of employee",
            },
            {
              type: "input",
              name: "last_name",
              message: "What is the last name of employee",
            },
            {
              type: "list",
              name: "role_id",
              message: "What is the employees role?",
              choices: roles,
            },
            {
              type: "list",
              name: "manager_id",
              message: "Who is the employees manager?",
              choices: manager,
            },
          ])
          .then((answers) => {
            connection.query("INSERT INTO employee SET ? ", answers);
            startQuestion();
          });
      });
    }
  );
};
const startQuestion = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "What would you like to do?",
        choices: [
          {
            name: "View All Employees",
            value: "viewAllE",
          },
          {
            name: "View All Roles",
            value: "viewRole",
          },
          {
            name: "View All Departments",
            value: "viewDepartment",
          },
          {
            name: "Add Employee",
            value: "addEmp",
          },
          {
            name: "Add Role",
            value: "addRole",
          },
          {
            name: "Update Employee",
            value: "updateEmp",
          },
          {
            name: "Add Department",
            value: "addDept",
          },
          "exit",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.options) {
        case "viewAllE":
          return viewEmp();

        case "addEmp":
          return addEmp();
        case "viewRole":
          return viewRole();
        case "viewDepartment":
          return viewAllD();
        case "addRole":
          return addRole();
        case "addDept":
          return addDep();
        case "updateEmp":
          return updateEmp();
        case "exit":
          return process.exit(0);
        default:
          startQuestion();
      }
    });
};

const init = () => {
  const logorender = logo({ name: "Employee Manager" }).render();
  console.log(logorender);
  startQuestion();
};

connection.connect(function (err) {
  if (err) throw err;
  init();
});

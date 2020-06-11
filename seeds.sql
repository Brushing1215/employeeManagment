USE EmpManagement_DB;

INSERT INTO department (name) 
VALUES
    ('Sales'),
    ('Engineering')

INSERT INTO role (title, salary, department_id) 
VALUES
    ('Sales Lead', 60000, 1),
    ('Engineering Lead', 150000, 2),
    ('Engineering Junior', 70000, 2)

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES
    ('Joe','Bob', 1, 3),
    ('Max','A', 2, null),
    ('Brett','R', 3, 2)
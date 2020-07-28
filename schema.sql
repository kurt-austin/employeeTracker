-- USE employee_db;

-- -- CREATE TABLE department (
-- --  id INTEGER (10) auto_increment NOT NULL,
-- --  name varchar (30),
-- --  primary key (id)


-- -- )
-- -- CREATE TABLE role (
-- -- 	id integer (10) auto_increment not null,
-- --     salary decimal(10,2),
-- --     department_id integer (10),
-- --     primary key (id),
-- --     foreign key (department_id) references department (id)
-- -- )

-- CREATE TABLE employee (
-- id INTEGER(10) auto_increment NOT NULL,
-- first_name varchar (30),
-- last_name varchar(30),
-- role_id INTEGER (5),
-- manager_id INTEGER(5),
-- primary key (id),
-- foreign key (role_id) references role(id),
-- foreign key (manager_id) references role(id) 
-- )



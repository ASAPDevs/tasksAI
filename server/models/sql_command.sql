CREATE TABLE users(
    id serial PRIMARY KEY,
    username varchar NOT NULL UNIQUE,
    password varchar NOT NULL
);

ALTER TABLE users ADD COLUMN email VARCHAR constraint;

CREATE TABLE tasks(
    id serial PRIMARY KEY,
    task_name varchar NOT NULL,
    task_description varchar,
    date varchar NOT NULL,
    time_start varchar NOT NULL,
    time_finished varchar NOT NULL,
    completed boolean NOT NULL,
    user_id integer NOT NULL
);

INSERT INTO tasks (task_name, task_description, date, time_start, time_finished, completed, user_id) VALUES ('make portfolio', 'create a portfolio', 1670518800000, 1670518800000, 1670522400000, FALSE, 1);

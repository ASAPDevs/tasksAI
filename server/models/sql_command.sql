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
    date BIGINT NOT NULL,
    time_start BIGINT NOT NULL,
    time_finished BIGINT NOT NULL,
    completed boolean NOT NULL,
    user_id integer NOT NULL
);

INSERT INTO tasks (task_name, task_description, date, time_start, time_finished, completed, user_id) VALUES ('make portfolio', 'create a portfolio', 1670518800000, 1670518800000, 1670522400000, FALSE, 1);

UPDATE tasks SET task_name = 'make portfolio', task_description = 'make a portfolio', date = 1670518800000, time_start = 1670518800000, time_finished = 1670522400000, completed = true WHERE id = 1;
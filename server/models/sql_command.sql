CREATE TABLE users(
    id serial PRIMARY KEY,
    username varchar NOT NULL UNIQUE,
    password varchar NOT NULL,
    lastgeneration varchar(255)
);

-- CREATE TABLE recommendations(
--     id serial PRIMARY KEY,
--     rec_text VARCHAR NOT NULL,
--     expiry_time TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 minute',
--     user_id integer NOT NULL
-- );

CREATE TABLE metrics(
    id serial PRIMARY KEY,
    recommendations TEXT[] NOT NULL,
    expiry_time TIMESTAMPTZ DEFAULT NOW(),
    metrics VARCHAR,
    user_id integer NOT NULL
);


-- CREATE RULE recommendations_expire AS ON DELETE TO recommendations WHERE (NOW() > expiry_time)
-- DO INSTEAD NOTHING;

-- CREATE TRIGGER recommendations_expire_trigger
-- AFTER INSERT OR UPDATE OF expiry_time
-- ON recommendations
-- EXECUTE FUNCTION recommendations_expire_trigger()

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

-- new tasks TABLE
CREATE TABLE tasks(
    id serial PRIMARY KEY,
    task_name VARCHAR NOT NULL,
    task_description VARCHAR,
    category integer DEFAULT 1,
    date BIGINT NOT NULL,
    time_start BIGINT NOT NULL,
    time_finished BIGINT NOT NULL,
    time_of_day integer DEFAULT 1,
    completed boolean NOT NULL,
    completed_on_time integer DEFAULT 0,
    user_id integer NOT NULL
);

ALTER TABLE table_name ADD COLUMN new_column_name data_type constraint;

ALTER TABLE tasks ADD COLUMN category integer 
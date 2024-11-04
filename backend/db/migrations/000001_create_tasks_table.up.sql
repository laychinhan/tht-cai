CREATE TABLE IF NOT EXISTS tasks
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(300)             NOT NULL,
    description TEXT                     NOT NULL,
    name_search TSVECTOR GENERATED ALWAYS AS ( TO_TSVECTOR('english', name) ) STORED,
    due_date    TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX task_due_date_index ON tasks (due_date);

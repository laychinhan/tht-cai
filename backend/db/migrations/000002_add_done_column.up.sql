ALTER TABLE tasks ADD COLUMN is_done TIMESTAMP WITH TIME ZONE DEFAULT NULL;
CREATE INDEX task_is_done_index ON tasks (is_done);
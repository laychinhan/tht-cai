ALTER TABLE tasks DROP COLUMN is_done;
DROP INDEX IF EXISTS task_is_done_index;
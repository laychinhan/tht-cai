-- name: GetPagedTasks :many
SELECT id, name, description, due_date
FROM tasks
WHERE ((CASE WHEN @unchecked::boolean THEN true ELSE false END) AND (is_done IS NULL))
ORDER BY CASE
             WHEN NOT @reverse::boolean AND @order_by::text = 'due_date' THEN due_date
             END ASC,
         CASE
             WHEN NOT @reverse::boolean AND @order_by::text = 'id' THEN id
             END ASC,
         CASE
             WHEN @reverse::boolean AND @order_by::text = 'due_date' THEN due_date
             END DESC,
         CASE
             WHEN @reverse::boolean AND @order_by::text = 'id' THEN id
             END DESC
LIMIT $1 OFFSET $2;

-- name: GetPagedTasksByName :many
SELECT id, name, description, due_date
FROM tasks
WHERE name_search @@ to_tsquery('english', $1)
ORDER BY id
LIMIT $2 OFFSET $3;

-- name: CreateTask :one
INSERT INTO tasks (name, description, due_date)
VALUES($1, $2, $3)
RETURNING id, name, description, due_date;

-- name: UpdateTask :one
UPDATE tasks
SET name        = $1,
    description = $2,
    due_date    = $3
WHERE id = $4
RETURNING id, name, description, due_date;
;

-- name: SetTaskDone :one
UPDATE tasks SET is_done = true WHERE id = $1 RETURNING id, name, description, due_date;

-- name: DeleteTask :one
DELETE
FROM tasks
WHERE id = $1
RETURNING id;


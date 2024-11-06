-- name: GetPagedTasks :many
SELECT id, name, description, due_date, is_done, created_at
FROM tasks
WHERE (
    (CASE WHEN @unchecked::boolean THEN is_done is NULL ELSE (is_done is NULL or is_done is Not null) END)
    AND (CASE WHEN @search::text = '' THEN true ELSE name_search @@ to_tsquery('english', @search) END)
    )
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

-- name: GetTotalTasks :one
SELECT COUNT(*) AS total from tasks;

-- name: GetPagedTasksByName :many
SELECT id, name, description, due_date
FROM tasks
WHERE name_search @@ to_tsquery('english', $1)
ORDER BY id
LIMIT $2 OFFSET $3;

-- name: CreateTask :one
INSERT INTO tasks (name, description, due_date)
VALUES ($1, $2, $3)
RETURNING id, name, description, due_date;

-- name: UpdateTask :one
UPDATE tasks
SET name        = $1,
    description = $2,
    due_date    = $3
WHERE id = $4
RETURNING id, name, description, due_date;
;

-- name: ToggleTaskDone :one
UPDATE tasks
SET is_done = CASE WHEN is_done IS NULL THEN CURRENT_TIMESTAMP ELSE NULL END
WHERE id = $1
RETURNING id, name, description, due_date, is_done;

-- name: DeleteTask :one
DELETE
FROM tasks
WHERE id = $1
RETURNING id;


package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"herman/tht-cai/src/postgresql/checkbox_tht"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5/middleware"
)

const ConnectionString = "postgres://postgres:123@localhost:5432/checkbox_tht?sslmode=disable"

type ServiceHandler struct {
	conn *pgx.Conn
	ctx  context.Context
}

type CreateTaskRequest struct {
	Name        string             `json:"name" validate:"required"`
	Description string             `json:"description" validate:"required"`
	DueDate     pgtype.Timestamptz `json:"due_date" validate:"required"`
}

func main() {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	ctx := context.Background()
	conn, err := pgx.Connect(ctx, ConnectionString)

	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
		w := http.ResponseWriter(nil)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	defer conn.Close(ctx)

	serviceHandler := &ServiceHandler{conn: conn, ctx: ctx}

	r.Get("/", serviceHandler.getTasks)
	r.Post("/", serviceHandler.createTask)
	r.Delete("/{id}", serviceHandler.deleteTask)
	r.Put("/{id}", serviceHandler.updateTask)
	r.Post("/{id}/toggle", serviceHandler.toggleTaskDone)
	http.ListenAndServe(":3000", r)
}

func (serviceHandler *ServiceHandler) getTasks(w http.ResponseWriter, r *http.Request) {

	queries := checkbox_tht.New(serviceHandler.conn)

	pageParam := r.URL.Query().Get("page")
	sortParam := r.URL.Query().Get("sort") == "desc"
	orderParam := r.URL.Query().Get("order")
	unchecked := r.URL.Query().Get("unchecked") == "true"

	if orderParam != "due_date" {
		orderParam = "id"
	}

	page, err := strconv.ParseInt(pageParam, 10, 32)
	if err != nil {
		page = 1
	}

	log.Printf("page: %d, sort: %v, order: %s", page, sortParam, orderParam)

	tasks, err := queries.GetPagedTasks(serviceHandler.ctx, checkbox_tht.GetPagedTasksParams{
		Limit:     5,
		Offset:    int32((page - 1) * 10),
		Reverse:   sortParam,
		OrderBy:   orderParam,
		Unchecked: unchecked,
	})

	if err != nil {
		w.WriteHeader(422)
		w.Write([]byte(fmt.Sprintf("error fetching tasks %v", err)))
		return
	}

	jsonTasks, err := json.Marshal(tasks)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte(fmt.Sprintf("error marshaling tasks to JSON %v", err)))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonTasks)
}

func (serviceHandler *ServiceHandler) createTask(w http.ResponseWriter, r *http.Request) {
	var task checkbox_tht.CreateTaskParams
	err := json.NewDecoder(r.Body).Decode(&task)

	if err != nil {
		w.WriteHeader(400)
		w.Write([]byte(fmt.Sprintf("error decoding task %v", err)))
		return
	}

	validate := validator.New(validator.WithRequiredStructEnabled())

	createUserRequest := &CreateTaskRequest{
		Name:        task.Name,
		Description: task.Description,
		DueDate:     task.DueDate,
	}

	err = validate.Struct(createUserRequest)

	if err != nil {
		w.WriteHeader(400)
		w.Write([]byte(fmt.Sprintf("invalid task create request: %v", err)))
		return
	}

	queries := checkbox_tht.New(serviceHandler.conn)

	createdTask, err := queries.CreateTask(serviceHandler.ctx, task)
	if err != nil {
		w.WriteHeader(400)
		w.Write([]byte(fmt.Sprintf("error creating task %v", err)))
		return
	}

	jsonTasks, err := json.Marshal(createdTask)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte(fmt.Sprintf("error marshaling tasks to JSON %v", err)))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonTasks)
}

func (ServiceHandler *ServiceHandler) deleteTask(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 32)
	if err != nil {
		w.WriteHeader(400)
		w.Write([]byte(fmt.Sprintf("error parsing task id %v", err)))
		return
	}

	queries := checkbox_tht.New(ServiceHandler.conn)

	deletedId, err := queries.DeleteTask(ServiceHandler.ctx, int32(id))
	if err != nil {
		w.WriteHeader(400)
		w.Write([]byte(fmt.Sprintf("error deleting task %v", err)))
		return
	}

	type deletedTaskResponse struct {
		Id int32 `json:"id"`
	}

	response := &deletedTaskResponse{
		Id: deletedId,
	}

	deletedTaskId, err := json.Marshal(response)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte(fmt.Sprintf("error marshaling tasks to JSON %v", err)))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(deletedTaskId)
}

func (ServiceHandler *ServiceHandler) updateTask(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 32)
	if err != nil {
		w.WriteHeader(400)
		w.Write([]byte(fmt.Sprintf("error parsing task id %v", err)))
		return
	}

	var task checkbox_tht.UpdateTaskParams
	err = json.NewDecoder(r.Body).Decode(&task)
	task.ID = int32(id)

	if err != nil {
		w.WriteHeader(400)
		w.Write([]byte(fmt.Sprintf("error decoding task %v", err)))
		return
	}

	queries := checkbox_tht.New(ServiceHandler.conn)

	updatedTask, err := queries.UpdateTask(ServiceHandler.ctx, task)
	if err != nil {
		w.WriteHeader(400)
		w.Write([]byte(fmt.Sprintf("error updating task %v", err)))
		return
	}

	jsonTasks, err := json.Marshal(updatedTask)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte(fmt.Sprintf("error marshaling tasks to JSON %v", err)))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonTasks)
}

func (ServiceHandler *ServiceHandler) toggleTaskDone(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 32)
	if err != nil {
		w.WriteHeader(400)
		w.Write([]byte(fmt.Sprintf("error parsing task id %v", err)))
		return
	}

	queries := checkbox_tht.New(ServiceHandler.conn)

	doneTask, err := queries.ToggleTaskDone(ServiceHandler.ctx, int32(id))
	if err != nil {
		w.WriteHeader(400)
		w.Write([]byte(fmt.Sprintf("error setting task done %v", err)))
		return
	}

	jsonDoneTask, err := json.Marshal(doneTask)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte(fmt.Sprintf("error marshaling done tasks to JSON %v", err)))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonDoneTask)
}

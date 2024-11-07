# Task Management
Simple task management written in golang and next.js

# Installations

## Repository
Git clone the repository into your local machine.
As prerequisite, make sure that you have yarn and golang installed on your local machine.
```bash
git clone git@github.com:laychinhan/tht-cai.git
```
## Frontend
Change your active directory to the `frontend` folder and run the following command:
```bash 
yarn install
```
To make it run on dev mode, run the following command:
```bash
yarn dev
```
or to build the application, run the following command:
```bash
yarn build && yarn start
```
The next.js application will be running on `localhost:3000`

## Backend
### Using docker compose
Change active dir to `/backend` and just run
```bash
docker-compose up -d
```
skip the Manual Installations part below, and go to the Migrations part.
You can try access the API by accessing `http://localhost:3003` on your browser.

It should show something like this after the migrations ran:
```json
{
  "tasks": null,
  "count": 0
}
```
### Manual Installations
#### Compiling golang
Change your active directory to the `backend/src` folder and run the following command:
```bash
go build -o ../bin/task-management
```
*Important* If you run your database directly from your machine or somewhere other than the docker compose file, make sure to set the connection URL in the main.go file.

run the server by running the following command if you are on linux or mac:
```bash
../bin/task-management
```
or if you are on windows, run the following command:
```bash
..\bin\task-management.exe
```
#### Database
If you have docker installed on your machine, you can run the docker-compose file to run the postgres database.
```bash
docker-compose up -d
```
Or you can run the postgres database on your local machine and create a database named `checkbox_tht` and create a user with the following credentials:
`postgres:123` and grant all the privileges of the database to the user.

### Migrations
Run the following command to run the migrations:
First, set the environment variable `POSTGRESQL_URL` to the postgres database url.
```bash
export POSTGRESQL_URL='postgres://postgres:123@localhost:5432/checkbox_tht?sslmode=disable'
```
```bash
migrate -database ${POSTGRESQL_URL} -path db/migrations up
```
The migrations should create a table named `tasks` on the `checkbox_tht` database.

### Dummy data for initial seed
```sql
INSERT INTO tasks (name, description, due_date)
VALUES
    ('Buy Groceries', 'Purchase milk, eggs, and bread from the supermarket', '2023-10-01T10:00:00Z'),
    ('Finish Report', 'Complete the quarterly financial report for the company', '2023-10-02T11:00:00Z'),
    ('Doctor Appointment', 'Visit Dr. Smith for the annual check-up', '2023-10-03T12:00:00Z'),
    ('Team Meeting', 'Attend the project status meeting with the team', '2023-10-04T13:00:00Z'),
    ('Workout', 'Go to the gym for a workout session', '2023-10-05T14:00:00Z'),
    ('Read Book', 'Read the new novel by your favorite author', '2023-10-06T15:00:00Z'),
    ('Call Parents', 'Have a phone call with your parents', '2023-10-07T16:00:00Z'),
    ('Plan Vacation', 'Plan the itinerary for the upcoming vacation', '2023-10-08T17:00:00Z'),
    ('Pay Bills', 'Pay the monthly utility and credit card bills', '2023-10-09T18:00:00Z'),
    ('Clean House', 'Do a thorough cleaning of the house', '2023-10-10T19:00:00Z'),
    ('Grocery Shopping', 'Buy groceries for the week', '2023-10-11T10:00:00Z'),
    ('Prepare Presentation', 'Prepare slides for the upcoming presentation', '2023-10-12T11:00:00Z'),
    ('Visit Dentist', 'Go for a dental check-up', '2023-10-13T12:00:00Z'),
    ('Client Meeting', 'Meet with the client to discuss project details', '2023-10-14T13:00:00Z'),
    ('Yoga Class', 'Attend a yoga class at the local studio', '2023-10-15T14:00:00Z'),
    ('Write Blog Post', 'Write a new post for your blog', '2023-10-16T15:00:00Z'),
    ('Update Resume', 'Update your resume with recent job experiences', '2023-10-17T16:00:00Z'),
    ('Car Maintenance', 'Take the car for regular maintenance', '2023-10-18T17:00:00Z'),
    ('Team Lunch', 'Have lunch with the team at a nearby restaurant', '2023-10-19T18:00:00Z'),
    ('Watch Movie', 'Watch the latest movie release', '2023-10-20T19:00:00Z'),
    ('Attend Webinar', 'Attend an online webinar on industry trends', '2023-10-21T10:00:00Z'),
    ('Organize Files', 'Organize files and documents on your computer', '2023-10-22T11:00:00Z'),
    ('Volunteer Work', 'Participate in a community volunteer event', '2023-10-23T12:00:00Z'),
    ('Family Dinner', 'Have dinner with family at home', '2023-10-24T13:00:00Z'),
    ('Meditation', 'Spend time meditating and relaxing', '2023-10-25T14:00:00Z'),
    ('Project Deadline', 'Submit the project by the deadline', '2023-10-26T15:00:00Z'),
    ('Grocery Shopping', 'Buy groceries for the week', '2023-10-27T16:00:00Z'),
    ('Prepare Presentation', 'Prepare slides for the upcoming presentation', '2023-10-28T17:00:00Z'),
    ('Visit Dentist', 'Go for a dental check-up', '2023-10-29T18:00:00Z'),
    ('Client Meeting', 'Meet with the client to discuss project details', '2023-10-30T19:00:00Z'),
    ('Yoga Class', 'Attend a yoga class at the local studio', '2023-10-31T10:00:00Z'),
    ('Write Blog Post', 'Write a new post for your blog', '2023-11-01T11:00:00Z'),
    ('Update Resume', 'Update your resume with recent job experiences', '2023-11-02T12:00:00Z'),
    ('Car Maintenance', 'Take the car for regular maintenance', '2023-11-03T13:00:00Z'),
    ('Team Lunch', 'Have lunch with the team at a nearby restaurant', '2023-11-04T14:00:00Z'),
    ('Watch Movie', 'Watch the latest movie release', '2023-11-05T15:00:00Z'),
    ('Attend Webinar', 'Attend an online webinar on industry trends', '2023-11-06T16:00:00Z'),
    ('Organize Files', 'Organize files and documents on your computer', '2023-11-07T17:00:00Z'),
    ('Volunteer Work', 'Participate in a community volunteer event', '2023-11-08T18:00:00Z'),
    ('Family Dinner', 'Have dinner with family at home', '2023-11-09T19:00:00Z'),
    ('Meditation', 'Spend time meditating and relaxing', '2023-11-10T10:00:00Z'),
    ('Project Deadline', 'Submit the project by the deadline', '2023-11-11T11:00:00Z'),
    ('Grocery Shopping', 'Buy groceries for the week', '2023-11-12T12:00:00Z'),
    ('Prepare Presentation', 'Prepare slides for the upcoming presentation', '2023-11-13T13:00:00Z'),
    ('Visit Dentist', 'Go for a dental check-up', '2023-11-14T14:00:00Z'),
    ('Client Meeting', 'Meet with the client to discuss project details', '2023-11-15T15:00:00Z'),
    ('Yoga Class', 'Attend a yoga class at the local studio', '2023-11-16T16:00:00Z'),
    ('Write Blog Post', 'Write a new post for your blog', '2023-11-17T17:00:00Z'),
    ('Update Resume', 'Update your resume with recent job experiences', '2023-11-18T18:00:00Z'),
    ('Car Maintenance', 'Take the car for regular maintenance', '2023-11-19T19:00:00Z');
```

# Architecture
## Sequence Diagrams
![ask Management Architecture](https://mermaid.ink/svg/pako:eNptksFOwzAMhl_FymlIgwfIYdJKgSFNaDCOuZjEbcNapyTpYJr27iR0E0MsFzvO5992kr3QzpCQItDHQKyptFh77BRDWj36aLXtkSPctpaSwXDyJoV3n4H81X_2ib5-yGxv3kNC76ByHu6940hsLqQ8uBa5zklHb1Kg3lxmyyJzKxdi7Wn9vFQ8tnQ9m-WKEuZaUwiwcB3BCmtSnOPpeNSWcE9RN7C0IYKr4BXDBrYWYb56VDwyCS4LCS8UvaUtQZ41szGzlXcdlBjxDUMSL4sz6ZNoTjgTGxs7HWaVAJ5C7zj8tjeOkauyIQ_IBhY74zHS314dQ5Nm69NoYio68h1akx5xn-9KidhQR0rI5BqqcGijEooPCcUhuvWOtZDRDzQV3g11I2SFbUi7oTep1PEHHKOHb7WwvIM "Task Management Architecture")

## How the application works in general
When the client (browser) make a request to the Next.js application, the Next.js make an API call to the Golang (backend) to retrieve list of tasks (or when creating task).
The Golang (backend) then connect to the database and do some operations (based on the API request).
The retrieved data, then parsed and constructed into JSON format and sent back to the Next.js (frontend).
The Next.js then render the data (React server component) to the browser and then later hydrating the page for interactivity.

The pagination, filter, and sorting is done in the node server of the Next.js applications. None of the request made from the clients goes directly to the Golang (backend) server.

## Stacks
- Frontend: 
  - React 
  - Next.js (backend for frontend)
  - Tailwindcss
  - Shadcn UI
- Backend
  - Golang
  - Chi (router)
  - PGX (Postgres driver)
  - SQLC (typesafe code generator)

## Data Structure
The final structure of the table after the migrations should look like the following:
```sql

create table tasks
(
  id          serial
    primary key,
  name        varchar(300)             not null,
  description text                     not null,
  name_search tsvector generated always as (to_tsvector('english'::regconfig, (name)::text)) stored,
  due_date    timestamp with time zone not null,
  is_done     timestamp with time zone,
  created_at  timestamp with time zone default now()
);

alter table tasks
  owner to postgres;

create index task_due_date_index
  on tasks (due_date);

create index task_is_done_index
  on tasks (is_done);

```
The `name_search` columns is used for FTS when there is a search params added to the request made to the GET endpoint.

The `due_date` and `created_at` columns is used to store the due date of the task, in timestamp with timezone format, to make sure that the both columns value always presented in the clients timezone.

The `task_due_date_index` created to optimize the query when the results is ordered by the `due_date` column value. 

As for the `created_at` column is not indexed, since we can use the `id` column to sort the query result when we need to order the result by the order of the creations of the row.

The `is_done` column is used to mark the task as done. If the task is done, the `is_done` column will have a timestamp value, otherwise it will be null. This feature is not yet implemented.

## Approach on the should have requirements and the performance
### sort tasks by due date/created at date
For the due date, we will use the due date column to sort the task, to improve the performance of the query, we will create an index on the due date column.

As for sorting the task in the order of the task created, we can use the `id` column, and store the timestamp into unindexed column named `created_at`.

As for the presentations on the clients side, since the value of the `due_date` and `created_at` is stored in the timestamp with timezone format, we can convert the value into the clients timezone to make sure that the value is presented in the clients timezone.

### Search tasks by name
For efficiency, we use the FTS feature of the Postgresql, where we store the name of the task in to `name` column and the tokens into `name_search` column. We can then use the `name_search` column to search the task by name using the `ts_query` command. 

### Performance
As to improve the performance of the application, the list of the tasks is paginated. As for the write query, it would not be a problem. There will be some performance issues on the `update` operations since there is no ownership (and authorization) mechanism for the tasks created. 

## Potential improvements (in the order of priority)
- Refactor the Golang code by separating the route handler and extracting the model into different files.
- Extracting variables and secrets (i.e. database url, backend API URL) into the environment variables and .env file.
- Add unit tests to the Golang code.
- Dockerize the Golang and Next.js application.
- Better error handling in the Golang code and the Next.js backend code.
- Since it will be trivial to test the next.js parts (react server components), implement playwright for e2e testing would be the ideal solution.
- Implement the `is_done` feature.
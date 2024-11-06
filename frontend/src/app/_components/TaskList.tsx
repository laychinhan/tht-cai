"use client";

import { ITask } from "@/app/_components/task";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateTaskDialog from "@/app/_components/CreateTaskDialog";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import EditTaskDialog from "@/app/_components/EditTaskDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TaskList({
  tasks,
  totalPage,
  currentPage,
  sort,
  order,
}: {
  tasks: ITask[];
  totalPage: number;
  currentPage: number;
  sort?: string;
  order?: string;
}) {
  return (
    <div className="px-4">
      <div className="flex flex-wrap items-center gap-x-1 pb-4">
        <div>Sort By:</div>
        <Link href={`http://localhost:3000?page=1&sort=desc&order=id`}>
          <Button
            variant={
              sort === "desc" && order === "id" ? "secondary" : "outline"
            }
          >
            Created at (desc)
          </Button>
        </Link>
        <Link href={`http://localhost:3000?page=1&sort=asc&order=id`}>
          <Button
            variant={sort === "asc" && order === "id" ? "secondary" : "outline"}
          >
            Created at (asc)
          </Button>
        </Link>
        <Link href={`http://localhost:3000?page=1&sort=desc&order=duedate`}>
          <Button
            variant={
              sort === "desc" && order === "duedate" ? "secondary" : "outline"
            }
          >
            Due date (desc)
          </Button>
        </Link>
        <Link href={`http://localhost:3000?page=1&sort=asc&order=duedate`}>
          <Button
            variant={
              sort === "asc" && order === "duedate" ? "secondary" : "outline"
            }
          >
            Due date (asc)
          </Button>
        </Link>
      </div>
      {!!tasks && tasks.length > 0 ? (
        <>
          <CreateTaskDialog />
          <div className="grid grid-cols-1 w-full gap-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{task.name}</CardTitle>
                  <CardDescription>
                    <div className="pb-4">{task.description}</div>
                    <div className="pb-4">
                      {dayjs(task.due_date).isBefore(dayjs()) ? (
                        <Badge variant="destructive">Overdue</Badge>
                      ) : dayjs(task.due_date).isAfter(
                          dayjs().add(7, "days"),
                        ) ? (
                        <Badge variant="outline">Not Urgent</Badge>
                      ) : (
                        <Badge variant="default">Due Soon</Badge>
                      )}
                    </div>
                    <div>{`Created At: ${dayjs(task.created_at).tz().format("DD/MM/YYYY HH:mm Z")}`}</div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EditTaskDialog task={task} />
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Alert>
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Uh Oh!</AlertTitle>
          <AlertDescription>
            Looks like there are no tasks on this page!
          </AlertDescription>
        </Alert>
      )}
      <div className="flex justify-end py-4 flex-wrap gap-x-1">
        {currentPage > 1 && (
          <Link
            href={`http://localhost:3000?page=${currentPage - 1}&sort=${sort}&order=${order}`}
          >
            <Button variant="outline">Prev</Button>
          </Link>
        )}
        {currentPage < totalPage / 10 && (
          <Link
            href={`http://localhost:3000?page=${currentPage + 1}&sort=${sort}&order=${order}`}
          >
            <Button variant="outline">Next</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

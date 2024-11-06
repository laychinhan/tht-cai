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
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import EditTaskDialog from "@/app/_components/EditTaskDialog";

export default function TaskList({ tasks }: { tasks: ITask[] }) {
  return (
    <div className="px-4">
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
                  ) : dayjs(task.due_date).isAfter(dayjs().add(7, "days")) ? (
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
    </div>
  );
}

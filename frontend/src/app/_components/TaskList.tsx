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
                {dayjs(task.due_date).isBefore(dayjs()) ? (
                  <Badge variant="destructive">Overdue</Badge>
                ) : dayjs(task.due_date).isAfter(dayjs().add(7, "days")) ? (
                  <Badge variant="outline">Not Urgent</Badge>
                ) : (
                  <Badge variant="default">Due Soon</Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

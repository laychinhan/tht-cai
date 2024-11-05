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

export default function TaskList({ tasks }: { tasks: ITask[] }) {
  return (
    <div className="px-4">
      <CreateTaskDialog />
      <div className="grid grid-cols-1 w-full gap-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <CardTitle className="text-lg">{task.name}</CardTitle>
              <CardDescription>{task.description}</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

'use client'

import {ITask} from "@/app/_components/task";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function TaskList({tasks}: { tasks: ITask[] }) {
  return (
    <div className="grid grid-cols-1 w-full px-4 gap-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader>
            <CardTitle className="text-lg">{task.name}</CardTitle>
            <CardDescription>
              {task.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
          </CardContent>
        </Card>
      ))}
    </div>
  )

}

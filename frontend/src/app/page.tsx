import {ITask} from "@/app/_components/task";
import TaskList from "@/app/_components/TaskList";

export default async function Home() {
  const tasksResponse = await fetch('http://localhost:3003')
  const tasks: ITask[] = await tasksResponse.json()
  return (
    <div className="prose prose-sm max-w-full">
      <div className="pt-4 px-4">
        <h1>Tasks</h1>
      </div>
      <TaskList tasks={tasks}/>
    </div>
  );
}

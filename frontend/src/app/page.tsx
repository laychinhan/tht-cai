import { PaginatedTasks } from "@/app/_components/task";
import TaskList from "@/app/_components/TaskList";

export default async function Home({
  searchParams,
}: {
  searchParams?: { page?: string; sort?: string; order?: string };
}) {
  const params = await searchParams;
  const tasksResponse = await fetch(
    `http://localhost:3003?page=${params?.page ?? 1}&sort=${params?.sort ?? "desc"}&order=${params?.order ?? "id"}`,
  );
  const currentPage = !!params?.page ? parseInt(params.page) : 1;
  const tasksResponseJson: PaginatedTasks = await tasksResponse.json();
  return (
    <div className="prose prose-sm max-w-full">
      <div className="pt-4 px-4">
        <h1>Tasks</h1>
      </div>
      <TaskList
        tasks={tasksResponseJson.tasks}
        totalPage={tasksResponseJson.total_pages}
        currentPage={currentPage}
        sort={params?.sort ?? "asc"}
        order={params?.order ?? "id"}
      />
    </div>
  );
}

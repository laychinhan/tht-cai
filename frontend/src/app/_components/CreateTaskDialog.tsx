import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useDebounce } from "use-debounce";

import { Button } from "@/components/ui/button";
import { createTask } from "@/app/create-task-action";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  flattenValidationErrors,
  InferSafeActionFnResult,
} from "next-safe-action";
import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

dayjs.extend(utc);
dayjs.extend(timezone);
type inferredTestActionResult = InferSafeActionFnResult<typeof createTask>;

export default function CreateTaskDialog({
  onClosed,
}: {
  onClosed?: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>(dayjs().tz().toString());
  const [errors, setErrors] = useState<
    inferredTestActionResult["validationErrors"] | null
  >(null);

  const [debouncedTaskNameValue] = useDebounce(taskName, 500);
  const [debouncedDescriptionValue] = useDebounce(description, 500);
  const { toast } = useToast();
  const router = useRouter();

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(value) => {
        if (!value) {
          setIsDialogOpen(false);
          onClosed?.();
        }
      }}
    >
      <div className="mb-4">
        <Button onClick={() => setIsDialogOpen(true)}>Add New Task</Button>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new Task</DialogTitle>
          {Object.keys(flattenValidationErrors(errors)?.fieldErrors).length >
            0 && (
            <Alert>
              <CircleAlert className="h-4 w-4" />
              <AlertTitle>Uh Oh!</AlertTitle>
              <AlertDescription>
                <ul>
                  {Object.entries(
                    flattenValidationErrors(errors)?.fieldErrors,
                  ).map(([key, value]) => (
                    <li key={key}>{`${key}: ${value}`}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 gap-y-1">
            <Input
              onChange={(e) => setTaskName(e.target.value)}
              type="text"
              placeholder="Enter task name (min of 3 characters, max 100 characters)."
            />
            <Textarea
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Type task description here (min of 3 characters, max 250 characters)."
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimeField
                defaultValue={dayjs().tz()}
                onChange={(value) => {
                  if (value) {
                    setDueDate(value.toString());
                  }
                }}
              />
            </LocalizationProvider>
            <Button
              onClick={async () => {
                const res = await createTask({
                  name: debouncedTaskNameValue,
                  description: debouncedDescriptionValue,
                  due_date: dayjs(dueDate)
                    .tz()
                    .format("YYYY-MM-DDTHH:mm:ssZ")
                    .toString(),
                });
                if (!!res?.validationErrors) {
                  setErrors(res.validationErrors);
                }

                if (!!res?.data) {
                  setIsDialogOpen(false);
                  toast({
                    title: "Task added!",
                    description: "Task has been added successfully.",
                  });
                  router.refresh();
                }
              }}
            >
              Save Task
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

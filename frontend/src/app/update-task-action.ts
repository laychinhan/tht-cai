"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import ky from "ky";

// This schema is used to validate input from client.
const schema = z.object({
  id: z.number().min(1),
  name: z.string().min(3).max(100),
  description: z.string().min(3).max(250),
  due_date: z.string().datetime({ offset: true }),
});

export const createTask = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { id, name, description, due_date } }) => {
    try {
      const resp = await ky
        .put(`http://localhost:3003/${id}`, {
          json: { name, description, due_date },
        })
        .json();
      return resp;
    } catch (e: unknown) {
      console.log(e);
      return { failure: e instanceof Error ? e.message : String(e) };
    }

    return { failure: `Unable to update task ${name}` };
  });

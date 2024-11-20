import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { z } from "zod";
import { publicProcedure, router } from "./trpc.ts";


const appRouter = router({
  todos: {
      list: publicProcedure.query(async () => {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos");
        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }
        const todos = await response.json();
        const todosSchema = z.array(
          z.object({
            userId: z.number(),
            id: z.number(),
            title: z.string(),
            completed: z.boolean(),
          })
        );
        return todosSchema.parse(todos);
      }),
  },
});

// Export type router type signature, this is used by the client.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3031);

/**
 * This is the client-side code that uses the inferred types from the server
 */
import {
  createTRPCClient,
  splitLink,
  unstable_httpBatchStreamLink,
  unstable_httpSubscriptionLink,
} from "@trpc/client";
/**
 * We only import the `AppRouter` type from the server - this is not available at runtime
 */
import type { AppRouter } from "../server/index.ts";
import { bench, runBenchmarks } from "https://deno.land/std@0.106.0/testing/bench.ts";

// Initialize the tRPC client
const trpc = createTRPCClient<AppRouter>({
  links: [
     unstable_httpSubscriptionLink({
        url: "http://localhost:3000",
      })
  ],
});

const todos = await trpc.todos.list.query();
bench({
  name: "fetch todos",
  runs: 100,
  async func(b): Promise<void> {
    b.start();
    await Promise.all(Array.from({ length: 100 }, () => trpc.todos.list.query()));
    b.stop();
  },
});

await runBenchmarks();

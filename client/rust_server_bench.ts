
import { bench, runBenchmarks } from "https://deno.land/std@0.106.0/testing/bench.ts";


interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

const rust_client = {
    todos: {
        list: {
            query: async () => {
                const response = await fetch("http://localhost:3030/todos");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                // map the json to an aray of todos
                const data = await response.json();
                return data.map((item: any) => ({
                    userId: item.userId,
                    id: item.id,
                    title: item.title,
                    completed: item.completed,
                }));
            },
        },
    },
};
// Example function to fetch todos using the tRPC client
async function fetchTodos() {
    try {
        return await rust_client.todos.list.query();
    } catch (error) {
        console.error("Error fetching todos:", error);
    }
}

// Call the function to fetch todos
fetchTodos();

bench({
name: "rust fetch todos",
runs: 100,
async func(b): Promise<void> {
    b.start();
    // Run the fetchTodos function 100 times asynchronously
    await Promise.all(Array.from({ length: 100 }, () =>fetchTodos()));
    b.stop();
},
});

await runBenchmarks();

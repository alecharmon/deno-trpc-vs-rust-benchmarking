use reqwest;
use serde::{Deserialize, Serialize};
use warp::Filter;

#[derive(Deserialize, Serialize)]
struct Todo {
    // Rename the fields to match the external API
    #[serde(rename = "userId")]
    user_id: u32,
    id: u32,
    title: String,
    completed: bool,
}

#[tokio::main]
async fn main() {
    // Define the route
    let todos_route = warp::path("todos").and(warp::get()).and_then(handle_todos);

    // Start the server
    warp::serve(todos_route).run(([127, 0, 0, 1], 3030)).await;
}

async fn handle_todos() -> Result<impl warp::Reply, warp::Rejection> {
    // Fetch the todos from the external API
    let response = reqwest::get("https://jsonplaceholder.typicode.com/todos")
        .await
        .map_err(|_| warp::reject::not_found())?;

    let todos: Vec<Todo> = response
        .json()
        .await
        .map_err(|_| warp::reject::not_found())?;

    // Return the todos as JSON
    Ok(warp::reply::json(&todos))
}

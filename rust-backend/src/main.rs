use axum::{extract::State, http::StatusCode, routing::get, Json, Router};
use reqwest::{self, Client};
use serde::{Deserialize, Serialize};
use tokio::net::TcpListener;

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
    let client = Client::new();

    let app = Router::new()
        .route("/todos", get(handle_todos))
        .with_state(client);
    axum::serve(TcpListener::bind("localhost:3030").await.unwrap(), app)
        .await
        .unwrap();
}

async fn handle_todos(client: State<Client>) -> Result<Json<Vec<Todo>>, StatusCode> {
    // Fetch the todos from the external API
    let response = client
        .get("https://jsonplaceholder.typicode.com/todos")
        .send()
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    let todos: Vec<Todo> = response.json().await.map_err(|_| StatusCode::NOT_FOUND)?;

    // Return the todos as JSON
    Ok(Json(todos))
}

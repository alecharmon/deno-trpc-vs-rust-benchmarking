# Deno Benchmarks

This repository contains benchmarking scripts for Deno and Rust servers. The benchmarks measure the performance of fetching todos from both Deno and Rust servers.

## Prerequisites

- [Deno](https://deno.land/) v1.0.0 or later
- [Rust](https://www.rust-lang.org/tools/install) and Cargo

## Setup

1. install rust deps  & start the rust server
```
cd rust-backend
cargo build
```

2. run the deno server
```
cd deno
deno task start
```

3. run the benchmarks
```
cd deno
deno bench
```

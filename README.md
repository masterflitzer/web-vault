# Simple Web Vault

## Prerequisites

-   [Deno](https://deno.land/#installation)
-   [Denon](https://github.com/denosaurs/denon#install)
-   [NPM (included with NodeJS)](https://nodejs.org/en/download/current/)

npm packages

```
npm install -g npm # update to latest npm version
npm install -g typescript # install typescript
```

## Developing & Debugging

-   open folder in vs code

```
code .          # backend
code frontend   # frontend
```

-   start developing & debugging

## Build

-   only transpile frontend TS to JS because backend TS runs directly inside deno

```
cd frontend
tsc
```

## Run

```
denon start # available under http://localhost:8080/
```

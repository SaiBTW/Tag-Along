// Single import point for data access. Swap `./mock` for a fetch-based client
// once the backend endpoints exist.
export * as api from "./mock";
export { ME_ID } from "./mock";
export type * from "./types";

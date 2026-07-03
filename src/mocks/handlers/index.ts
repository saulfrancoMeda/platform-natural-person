import { authHandlers } from "./auth";
import { accountHandlers } from "./account";

export const handlers = [...authHandlers, ...accountHandlers];

import { authHandlers } from "./auth";
import { accountHandlers } from "./account";
import { profileHandlers } from "./profile";

export const handlers = [...authHandlers, ...accountHandlers, ...profileHandlers];

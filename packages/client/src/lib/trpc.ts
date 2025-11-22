import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@owlyknow/server/types";

export const trpc = createTRPCReact<AppRouter>();

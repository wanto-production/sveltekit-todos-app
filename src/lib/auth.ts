import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./server/db";
import { username, admin } from "better-auth/plugins";
import { betterAuth } from "better-auth";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  appName: "todos-svelte",
  plugins: [sveltekitCookies(getRequestEvent), admin(), username()],
  emailAndPassword: {
    enabled: true
  }
});

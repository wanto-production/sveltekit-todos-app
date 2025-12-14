import { createAuthClient } from "better-auth/svelte";
import type { auth } from "./auth.ts";
import {
  inferAdditionalFields,
  usernameClient,
  adminClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    usernameClient(),
    adminClient(),
  ],
});

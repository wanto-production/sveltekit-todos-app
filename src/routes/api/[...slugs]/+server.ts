import { Elysia } from 'elysia';
import { auth } from "$lib/auth"
import { category } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { categorySchema } from '$lib/schemas';

const betterAuth = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) return status(401);

        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });

const app = new Elysia({ prefix: "/api" })
  .use(betterAuth)
  .get("/user", ({ user }) => user, {
    auth: true,
  })
  .group('/categories', (app) => {

    return app
      .get('/', async ({ user }): Promise<typeof category.$inferSelect[]> => {
        const categories = await db
          .select()
          .from(category)
          .where(eq(category.userId, user!.id))
          .orderBy(category.createdAt);

        return categories;
      }, { auth: true })
      .post('/new', async ({ body, user }) => {
        await db.insert(category).values({
          userId: user.id,
          name: body.name,
          description: body.description,
          color: body.color,
        })

        return {
          status: 'success',
          message: 'Category created successfully!'
        }
      }, {
        auth: true,
        body: categorySchema
      })
      .delete('/remove/:id', async ({ params }) => {
        await db.delete(category).where(eq(category.id, params.id))

        return {
          status: 'success',
          message: 'Category deleted successfully!'
        }
      }, { auth: true })
  })


type RequestHandler = (v: { request: Request }) => Response | Promise<Response>
export type App = typeof app

export const fallback: RequestHandler = ({ request }) => app.handle(request)

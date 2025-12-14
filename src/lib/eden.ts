import { treaty } from '@elysiajs/eden'
import type { App } from '../routes/api/[...slugs]/+server'

export const client = treaty<App>('localhost:3000').api

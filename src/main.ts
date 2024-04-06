import express, { Application, NextFunction, Request, Response } from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import { appRouterUser, appRouterCategory } from './router'
import cors from 'cors'
import { createContextForUser, createContextForCategory } from './lib/trpc'

const app: Application = express()
app.use(cors())

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.redirect('index.html');
})

app.use(
    '/user',
    trpcExpress.createExpressMiddleware({
        router: appRouterUser,
        createContext: createContextForUser,
    })
)
app.use(express.static('public'));

app.use(
    '/category',
    trpcExpress.createExpressMiddleware({
        router: appRouterCategory,
        createContext: createContextForCategory,
    })
)

const PORT: number = Number(process.env.PORT) || 3000
app.listen(PORT, () => {
    console.log(`🚀 Server running on Port: ${PORT}`)
})

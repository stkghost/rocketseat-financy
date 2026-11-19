import 'reflect-metadata'
import 'dotenv/config'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import cors from 'cors'
import express from 'express'
import { buildSchema } from 'type-graphql'
import { buildContext } from './graphql/context'
import { AuthResolver } from './resolvers/auth.resolver'
import { CategoryResolver } from './resolvers/category.resolver'
import { TransactionResolver } from './resolvers/transaction.resolver'
import { UserResolver } from './resolvers/user.resolver'

const PORT = Number(process.env.PORT ?? 4000)
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173'

async function bootstrap() {
  const app = express()

  const schema = await buildSchema({
    resolvers: [AuthResolver, UserResolver, CategoryResolver, TransactionResolver],
    validate: { forbidUnknownValues: false },
    emitSchemaFile: './schema.graphql',
  })

  const server = new ApolloServer({ schema })
  await server.start()

  app.use(
    '/graphql',
    cors({ origin: CORS_ORIGIN.split(','), credentials: true }),
    express.json(),
    expressMiddleware(server, { context: buildContext })
  )

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/graphql`)
  })
}

bootstrap()

# RSS Dumper GraphQL

## Tech Stack

**Language** - [TypeScript](https://www.typescriptlang.org/)  
**Main Framework** - [Apollo Server](https://www.apollographql.com/docs/apollo-server/)  
**ORM** - [Prisma](https://www.prisma.io/docs/)  
**Database** - [PostgreSQL](https://www.postgresql.org/docs/)  
**GraphQL Schema Definition** - [GraphQL Nexus](https://nexusjs.org/docs/)  
**Code Formatting** - [Prettier](https://prettier.io/)  
**Linting** - [ESLint](https://eslint.org)

## Render settings

Add following environments

```env
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
NODE_VERSION=18.17.1
PORT=4000
```

> https://render.com/docs/node-version

Build command

```bash
pnpm build
```

Start command

```bash
pnpm start
```

## 🍾 Initial setups

```bash
git clone https://github.com/s-hirano-ist/rss-dumper-graphql.git
cd rss-dumper-graphql
docker compose up --build -d
pnpm i
pnpm prisma:dev
```

## API path

`/api/graphql`: graphQL endpoint

- Schema of "News" is defined by nexus-prisma (preferred)
- Schema of "NewsDetail" is defined hardcode

## 🪝 Tags

```bash
git tag vx.x.x
git push origin vx.x.x
```

## References

> https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql-nexus

# RSS Dumper GraphQL

Sample Apollo server for studying backend GraphQL server.

More high-level implementation is located [here](https://github.com/pre-GMO/backend) (Sorry for a private repository).
Therefore, there will be no updates here.

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

Use docker

```bash
docker compose --profile app up -d
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

## Sample queries

```graphql
mutation {
  register(
    email: "example@gmail.com"
    password: "PASSWORD"
    name: "Example Taro"
  ) {
    token
  }
}

mutation {
  login(email: "example@gmail.com", password: "PASSWORD") {
    token
  }
}

query Query {
  allNews {
    heading
    description
  }
  me {
    email
    admin
  }
  allUsers {
    email
    id
    name
    admin
  }
}
```

## 🪝 Tags & Realease

```bash
gh release create --generate-notes
```

## References

> https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql-nexus
>
> https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql-auth

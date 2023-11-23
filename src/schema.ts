import { Scope } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { applyMiddleware } from "graphql-middleware";
import { sign } from "jsonwebtoken";
import { makeSchema, nonNull, objectType, stringArg, enumType } from "nexus";
import {
  News as NewsType,
  User as UserType,
  NewsDetail as NewsDetailType,
} from "nexus-prisma";
import { Context } from "./context";
import { permissions } from "./permissions";
import { APP_SECRET, getUserId } from "./utils";

// REF: https://zenn.dev/mayo_dev/scraps/41be0262a6d3b7
const scopeEnum = enumType({
  name: "scope",
  members: Object.values(Scope),
});

const News = objectType({
  name: NewsType.$name,
  description: NewsType.$description,
  definition(t) {
    t.field(NewsType.id);
    t.field(NewsType.heading);
    t.field(NewsType.description);
    t.field(NewsType.scope.name, { type: scopeEnum });
    t.field(NewsType.newsDetail);
  },
});
const NewsDetail = objectType({
  name: NewsDetailType.$name,
  definition(t) {
    t.field(NewsDetailType.id);
    t.field(NewsDetailType.title);
    t.field(NewsDetailType.url);
    t.field(NewsDetailType.quote);
    t.field(NewsDetailType.published);
    t.field(NewsDetailType.favorite);
    t.field(NewsDetailType.newsId);
  },
});
// FYR: non typed code
// const NewsDetail = objectType({
//   name: "NewsDetail",
//   definition(t) {
//     t.nonNull.int("id");
//     t.nonNull.string("title");
//     t.nonNull.string("url");
//     t.string("quote");
//     t.nonNull.boolean("published");
//     t.nonNull.boolean("favorite");
//     t.nonNull.int("newsId");
//   },
// });

const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.string("token");
    t.field("user", { type: "User" });
  },
});

const User = objectType({
  name: UserType.$name,
  definition(t) {
    t.field(UserType.id);
    t.field(UserType.name);
    t.field(UserType.email);
    t.field(UserType.admin);
  },
});

const Query = objectType({
  name: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("allNews", {
      type: "News",
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.news.findMany();
      },
    });

    t.nonNull.list.nonNull.field("publicNews", {
      type: "News",
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.news.findMany({ where: { scope: Scope.PUBLIC } });
      },
    });

    t.nonNull.list.nonNull.field("allNewsDetail", {
      type: "NewsDetail",
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.newsDetail.findMany();
      },
    });

    t.nonNull.list.nonNull.field("allUsers", {
      type: "User",
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.user.findMany();
      },
    });
    t.nullable.field("singleUser", {
      type: "User",
      resolve: (_parent, _args, context: Context) => {
        const userId = getUserId(context);
        return context.prisma.user.findUnique({
          where: {
            id: Number(userId),
          },
        });
      },
    });
  },
});

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("register", {
      type: "AuthPayload",
      args: {
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, args, context: Context) => {
        const hashedPassword = await hash(args.password, 10);
        const user = await context.prisma.user.create({
          data: {
            name: args.name,
            email: args.email,
            password: hashedPassword,
          },
        });
        if (!APP_SECRET) throw new Error("No app secret");
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        };
      },
    });

    t.field("login", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, { email, password }, context: Context) => {
        const user = await context.prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (!user) throw new Error(`No user found for email: ${email}`);

        const passwordValid = await compare(password, user.password);
        if (!passwordValid) throw new Error("Invalid password");

        if (!APP_SECRET) throw new Error("No app secret");
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        };
      },
    });
  },
});

export const schemaWithoutPermissions = makeSchema({
  types: [Query, Mutation, News, NewsDetail, User, AuthPayload],
  outputs: {
    schema: __dirname + "/../schema.graphql",
    typegen: __dirname + "/generated/nexus.ts",
  },
  contextType: {
    module: require.resolve("./context"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
});

export const schema = applyMiddleware(schemaWithoutPermissions, permissions);

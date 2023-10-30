import { makeSchema, objectType } from "nexus";
import { News as NewsType } from "nexus-prisma";
import { Context } from "./context";

const News = objectType({
  name: NewsType.$name,
  description: NewsType.$description,
  definition(t) {
    t.field(NewsType.id);
    t.field(NewsType.heading);
    t.field(NewsType.description);
    t.field(NewsType.newsDetail);
  },
});
const NewsDetail = objectType({
  name: "NewsDetail",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("title");
    t.nonNull.string("url");
    t.string("quote");
    t.nonNull.boolean("published");
    t.nonNull.boolean("favorite");
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

    t.nonNull.list.nonNull.field("allNewsDetail", {
      type: "NewsDetail",
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.newsDetail.findMany();
      },
    });
  },
});

export const schema = makeSchema({
  types: [Query, News, NewsDetail],
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

import { rule, shield } from "graphql-shield";
import { Context } from "../context";
import { getUserId } from "../utils";

const rules = {
  authenticated: rule()((_parent, _args, context: Context) => {
    const userId = getUserId(context);
    return Boolean(userId);
  }),
  admin: rule()(async (_parent, args, context: Context) => {
    const userId = getUserId(context);
    const user = await context.prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });
    return user?.admin === true;
  }),
};

export const permissions = shield({
  Query: {
    singleUser: rules.authenticated,
    allNews: rules.authenticated,
    allNewsDetail: rules.authenticated,
    allUsers: rules.admin,
  },
  Mutation: {},
});

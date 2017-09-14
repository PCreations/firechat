import {
  makeExecutableSchema,
} from 'graphql-tools';

const schemaString = `
  type User {
    id: ID!
    username: String!
  }
  
  input UserInput {
    id: String!
    username: String!
  }

  type Message {
    id: ID!
    content: String!
    user: User!
  }

  type Query {
    getMessages: [Message]
  }

  type Mutation {
    submitMessage(
      content: String!
    ): Message
    createUser(
      user: UserInput
    ): User
  }

`;

const resolvers = {
  Message: {
    user({ userId }, _, context) {
      return context.Users.getById(userId);
    },
  },
  Query: {
    getMessages(root, _, context) {
      console.log('GETTING MESSAGES');
      return context.Messages.getAll();
    },
  },
  Mutation: {
    submitMessage(root, { content }, context) {
      return context.Messages
        .create({
          content,
          userId: context.auth.uid,
        });
    },
    createUser(root, { user }, context) {
      return context.Users
        .create(user)
        .then(() => context.Users.getById(user.id));
    },
  },
};

const executableSchema = makeExecutableSchema({
  typeDefs: schemaString,
  resolvers,
});

export default executableSchema;
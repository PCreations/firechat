import {
  makeExecutableSchema,
} from 'graphql-tools';
import pubsub from './pubsub'; 

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
  
  type Subscription {
    messageAdded: Message!
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
  Subscription: {
    messageAdded: {
      subscribe: () => { console.log('resolve messageAdded'); return pubsub.asyncIterator('OnMessageAdded')},
    },
  },
};

const executableSchema = makeExecutableSchema({
  typeDefs: schemaString,
  resolvers,
});

export default executableSchema;
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// my data.
const typeDefs = gql`
  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    id: ID
    title: String
    author: String
    year: Int
    createdAt: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    # ! stands for required field for query to fetch something
    book(id: ID!): Book
  }
`;

const dataSource = [
  {
    id: '1',
    title: 'The Awakening',
    author: 'Kate Chopin',
    year: 1925,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'City of Glass',
    author: 'Paul Auster',
    year: 2000,
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Getting Things Done',
    author: 'David Allen',
    year: 1967,
    createdAt: new Date(),
  },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => dataSource,
    book: (parent, args) => dataSource.find((book) => book.id === args.id),
  },
  Book: {
    createdAt: (parent) => parent.createdAt.toString(),
  },
};

// The ApolloServer constructor requires two parameters: my schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const typeDefs = gql`
  type File {
    url: String!
  }

  type Query {
    hello: String!
  }

  type Mutation {
    uploadFile(file: Upload!): File!
  }
`;

const resolvers = {
  Query: {
    hello: (parent, args) => 'Hello World',
  },
  Mutation: {
    uploadFile: async (parent, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      const { ext } = path.parse(filename);
      const nameDate = Date.now();
      const fullName = nameDate + ext;
      console.log(fullName);
      const stream = createReadStream();
      const pathName = path.join(__dirname, `/public/images/${fullName}`);

      await stream.pipe(fs.createWriteStream(pathName));

      return {
        url: `http://localhost:4000/images/${fullName}`,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();
server.applyMiddleware({ app });

app.use(express.static('public'));
app.use(cors());

app.listen({ port: 4000 }, () => {
  console.log(`Server ready at http://localhost:4000`);
});

const dotenv = require('dotenv');
const fetch = require('node-fetch');
const express = require('express');
const app = express();

dotenv.config();

app.get('/data', async (req, res) => {
  //define GraphQL query in a string

  const query = `
  {
    search(query: "stars:>50000", type: REPOSITORY, first: 10) {
      repositoryCount
      edges {
        node {
          ... on Repository {
            name
            owner {
              login
            }
            stargazers {
              totalCount
            }
          }
        }
      }
    }
  }
`;
  const url = 'https://api.github.com/graphql';

  const options = {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      authorization: 'bearer ' + process.env.API_KEY,
    },
    body: JSON.stringify({ query: query }),
  };

  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    console.error(error);
  }

  const data = await response.json();
  console.log(data);

  res.json(data);
});

app.use(express.static('public'));

//test
// app.get('/data', (req, res) => {
//   res.end('Response from the API!');
// });

app.listen(3000, () => console.log('Server ready'));

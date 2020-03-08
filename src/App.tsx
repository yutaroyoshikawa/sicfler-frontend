import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { initialState, resolvers, typeDefs } from "./localState";
import Template from "./components/Template";
import Posts from "./components/Posts";
import FaceChecker from "./components/FaceChecker";
import PointerEffect from "./components/atoms/PointerEffect";

const cache = new InMemoryCache();

cache.writeData(initialState);

const httpLink = createHttpLink({
  uri: "https://api.sicfler.com/v1/graphql",
});

const authLink = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  resolvers,
  typeDefs,
});

const App: React.FC = () => {
  return (
    <>
      <PointerEffect />
      <Router>
        <ApolloProvider client={client}>
          <ApolloHooksProvider client={client}>
            <GlobalStyle />
            <Template>
              <Posts />
              <FaceChecker />
            </Template>
          </ApolloHooksProvider>
        </ApolloProvider>
      </Router>
    </>
  );
};

export default App;

const GlobalStyle = createGlobalStyle`
  ${reset}

  body {
    cursor: none;
  }

  h1, h2, h3, h4, p, div {
    font-family: 'M PLUS 1p';
  }
`;

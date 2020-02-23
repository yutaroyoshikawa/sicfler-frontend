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

const cache = new InMemoryCache();

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
});

const App: React.FC = () => {
  return (
    <Router>
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
          <GlobalStyle />
          hoge
        </ApolloHooksProvider>
      </ApolloProvider>
    </Router>
  );
};

export default App;

const GlobalStyle = createGlobalStyle`
  ${reset}
  @import url('https://fonts.googleapis.com/css?family=M+PLUS+1p&display=swap');
`;

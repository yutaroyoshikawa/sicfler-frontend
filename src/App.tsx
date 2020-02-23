import React from "react";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const App: React.FC = () => {
  return (
  <>
    <GlobalStyle />
    hoge
  </>
  );
}

export default App;

const GlobalStyle = createGlobalStyle`
  ${reset}
`;

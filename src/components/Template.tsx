import React from "react";
import styled from "styled-components";
import SideBar from "./organisms/SideBar";

const Template: React.FC = props => {
  return (
    <Wrapper>
      <SideBar />
      <main>{props.children}</main>
    </Wrapper>
  );
};

export default Template;

const Wrapper = styled.div`
  display: flex;
  background: #F8F8F8;
`;

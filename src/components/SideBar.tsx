import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faAngleLeft} from "@fortawesome/free-solid-svg-icons";

const SideBar: React.FC = () => {
  return (
    <Wrapper>
      <BackButton>
        <BackIcon icon={faAngleLeft} />
      </BackButton>
    </Wrapper>
  );
};

export default SideBar;

const Wrapper = styled.nav`
  width: 80px;
  height: 100vh;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  background: #fff;
  z-index: 99999;
`;

const BackButton = styled.button`
  outline: none;
  border: none;
  cursor: pointer;
`;

const BackIcon = styled(FontAwesomeIcon)`
  font-size: 50px;
  color: #808080;
`

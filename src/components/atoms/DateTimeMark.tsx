import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-regular-svg-icons";

const DateTimeMark: React.FC = props => {
  return (
    <Wrap>
      <Icon icon={faFlag} />
      <MarkText>{props.children}</MarkText>
    </Wrap>
  )
};

export default DateTimeMark;

const Wrap = styled.span`
  width: 140px;
  height: 22px;
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  background: #faa44d;
  border: 2px solid #fff;
  border-radius: 30px;
  padding: 10px;
  margin-right: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 22px;
  color: #fff;
`;

const MarkText = styled.div`
  color: #fff;
  font-weight: bold;
  letter-spacing: -3px;
  font-size: 20px;
  padding-left: 7px;
`;

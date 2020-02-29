import React from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-regular-svg-icons";

interface Props {
  type?: "default" | "listItem";
}

const DateTimeMark: React.FC<Props> = props => {
  const { type = "default" } = props;

  return (
    <Wrap type={type}>
      <Icon icon={faFlag} type={type} />
      <MarkText type={type}>{props.children}</MarkText>
    </Wrap>
  )
};

export default DateTimeMark;

const Wrap = styled.span`
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  background: #faa44d;
  border: 2px solid #fff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);

  ${(props: Pick<Props, "type">) => props.type === "default" && css`
  width: 140px;
  height: 22px;
  border-radius: 30px;
  padding: 10px;
  margin-right: 10px;
  `}

  ${(props: Pick<Props, "type">) => props.type === "listItem" && css`
  width: 82px;
  height: 12px;
  border-radius: 22px;
  padding: 10px;
  margin-right: 5px;
  `}
`;

const Icon = styled(FontAwesomeIcon)`
  color: #fff;

  ${(props: Pick<Props, "type">) => props.type === "default" && css`
  font-size: 22px;
  `}

  ${(props: Pick<Props, "type">) => props.type === "listItem" && css`
  font-size: 16px;
  `}
`;

const MarkText = styled.div`
  color: #fff;
  font-weight: bold;
  letter-spacing: -3px;

  ${(props: Pick<Props, "type">) => props.type === "default" && css`
  font-size: 20px;
  padding-left: 7px;
  `}

  ${(props: Pick<Props, "type">) => props.type === "listItem" && css`
  font-size: 13px;
  padding-left: 4px;
  `}
`;

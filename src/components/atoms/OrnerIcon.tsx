import React from "react";
import styled, { css } from "styled-components";

interface Props {
  type: "default" | "listItem";
  iconUrl: string;
  ornerName: string;
}

const OrnerIcon: React.FC<Props> = props => {
  const { type = "default", iconUrl, ornerName } = props;

  return (
    <Wrap>
      <Icon iconUrl={iconUrl} type={type} />
      <Name type={type}>{ornerName}</Name>
    </Wrap>
  );
};

export default OrnerIcon;

const Wrap = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Icon = styled.figure`
  border-radius: 50%;
  object-fit: cover;
  pointer-events: none;
  background-image: url(${(props: Pick<Props, "iconUrl" | "type">) => props.iconUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  ${(props: Pick<Props, "iconUrl" | "type">) =>
    props.type === "default" &&
    css`
      width: 50px;
      height: 50px;
    `}

  ${(props: Pick<Props, "iconUrl" | "type">) =>
    props.type === "listItem" &&
    css`
      width: 31px;
      height: 31px;
    `}
`;

const Name = styled.p`
  pointer-events: none;
  margin-left: 10px;

  ${(props: Pick<Props, "type">) =>
    props.type === "default" &&
    css`
      font-size: 30px;
    `}

  ${(props: Pick<Props, "type">) =>
    props.type === "listItem" &&
    css`
      font-size: 18px;
    `}
`;

import React from "react";
import styled, { css } from "styled-components";
import moment from "moment";
import DateTimeMark from "../atoms/DateTimeMark";

interface Props {
  datetime: Date;
  markText: string;
  type?: "default" | "listItem" 
}

const DateTime: React.FC<Props> = props => {
  const { datetime, markText, type = "default" } = props;

  return (
    <Wrap type={type}>
      <DateTimeMark type={type}>{markText}</DateTimeMark>
      <TimeText type={type}>{moment(datetime).format("YYYY/MM/DD hh:mm")}</TimeText>
    </Wrap>
  )
};

export default DateTime;

const Wrap = styled.div`
  display: flex;
  align-items: center;

  ${(props: Pick<Props, "type">) => props.type === "default" && css`
  width: 472px;
  height: 43px;
  border-radius: 43px;
  border: 2px solid #D9D9D9;
  background: #fff;
  `}

  ${(props: Pick<Props, "type">) => props.type === "listItem" && css`
  width: 276px;
  height: 25px;
  `}
`;

const TimeText = styled.time`
  display: block;
  color: #707070;
  text-align: center;

  ${(props: Pick<Props, "type">) => props.type === "default" && css`
  font-size: 30px;
  `}

  ${(props: Pick<Props, "type">) => props.type === "listItem" && css`
  font-size: 18px;
  `}
`;

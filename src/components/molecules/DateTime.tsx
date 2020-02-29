import React from "react";
import styled from "styled-components";
import moment from "moment";
import DateTimeMark from "../atoms/DateTimeMark";

interface Props {
  datetime: Date;
  markText: string;
}

const DateTime: React.FC<Props> = props => {
  return (
    <Wrap>
      <DateTimeMark>{props.markText}</DateTimeMark>
      <TimeText>{moment(props.datetime).format("YYYY/MM/DD hh:mm")}</TimeText>
    </Wrap>
  )
};

export default DateTime;

const Wrap = styled.div`
  width: 472px;
  height: 43px;
  display: flex;
  align-items: center;
  border-radius: 43px;
  border: 2px solid #D9D9D9;
  background: #fff;
`;

const TimeText = styled.time`
  font-size: 30px;
  display: block;
  color: #707070;
  text-align: center;
`;

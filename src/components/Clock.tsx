import React, { useState, useEffect } from "react";
import styled from "styled-components";
import moment from "moment";

const Clock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    setTimeout(() => {
      setCurrentTime(new Date());
    }, 100);
  }, [currentTime]);

  return (
    <Time>{moment(currentTime).format("HH:mm")}</Time>
  );
};

export default Clock;

const Time = styled.time`
  display: inline-block;
  text-align: center;
  letter-spacing: 5px;
`;

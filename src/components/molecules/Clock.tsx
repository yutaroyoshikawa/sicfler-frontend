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
    <Wrapper>
      <Calender>
        {moment(currentTime).format("MM/DD")}
      </Calender>
      <Time>{moment(currentTime).format("HH:mm")}</Time>
    </Wrapper>
  );
};

export default Clock;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Calender = styled.p`
  font-size: 26px;
  color: #707070;
  display: inline-block;
  text-align: left;
  letter-spacing: 5px;
  margin-bottom: 10px;
`;

const Time = styled.time`
  font-size: 30px;
  color: #303030;
  display: inline-block;
  text-align: center;
  letter-spacing: 5px;
`;

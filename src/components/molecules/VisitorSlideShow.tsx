import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { CSSTransition } from "react-transition-group";
import { TransitionStatus } from "react-transition-group/Transition";
import { Visitor as VisitorProp } from "../../gen/graphql-client-api";
import Visitor from "../atoms/Visitor";

const TRANSITION_DURATION = 400;

const BUCKET_URL = process.env.REACT_APP_SICFLER_BUCKET_URL || "";

interface Props {
  visitors: VisitorProp[];
}

const VisitorSlideShow: React.FC<Props> = props => {
  const [isVissible, setIsVissible] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    isVissible && setTimeout(() => {
      setIsVissible(false);
    }, 4000);

    !isVissible && setTimeout(() => {
      setCurrentIndex(currentIndex === props.visitors.length - 1 ? 0 : currentIndex + 1);
      setIsVissible(true);
    }, TRANSITION_DURATION);
    // eslint-disable-next-line
  }, [isVissible]);

  return (
    <CSSTransition
      in={isVissible}
      timeout={TRANSITION_DURATION}
    >
      {status => (
        <Wrap transitionStatus={status}>
          <Visitor
            image={`${BUCKET_URL}/${props.visitors[currentIndex].sumbnail}`}
            name={props.visitors[currentIndex].visitorName || ""}
            discription={props.visitors[currentIndex].discription || ""}
          />
        </Wrap>
      )}
    </CSSTransition>
  );
};

export default VisitorSlideShow;

const Wrap = styled.div`
  ${(props: { transitionStatus: TransitionStatus }) => {
    switch (props.transitionStatus) {
      case "entering":
        return css`
          opacity: 0;
          transform: translateX(80px);
        `;
      case "entered":
        return css`
          opacity: 1;
          transform: translateX(0);
          transition: all ${TRANSITION_DURATION}ms ease;
        `;
      case "exited":
        return css`
          opacity: 1;
          transform: translateX(0);
        `;
      case "exiting":
        return css`
          opacity: 0;
          transform: translateX(80px);
          transition: all ${TRANSITION_DURATION}ms ease;
        `;
    }
  }}
`;

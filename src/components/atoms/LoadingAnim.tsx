import React from "react";
import styled, { keyframes, css } from "styled-components";
import { CSSTransition } from "react-transition-group";
import { TransitionStatus } from "react-transition-group/Transition";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const TRANSITION_DURATION = 300;

const GET_USERINFO = gql`
  query getLoadState {
    loading @client
  }
`;

const LoadingAnim: React.FC = () => {
  const { data } = useQuery(GET_USERINFO);

  return (
    <CSSTransition
      in={data.loading}
      timeout={TRANSITION_DURATION}
      mountOnEnter={true}
      unmountOnExit={true}
    >
      {status => (
        <Wrap transitionStatus={status}>
          <Image
            src={`${process.env.PUBLIC_URL}/images/sicfler_logo.svg`}
            alt="Logo"
          />
        </Wrap>
      )}
    </CSSTransition>
  );
};

export default LoadingAnim;

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  background: rgba(255, 255, 255, 0.9);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999999999999;

  ${(props: { transitionStatus: TransitionStatus }) => {
    switch (props.transitionStatus) {
      case "entering":
        return css`
          opacity: 0;
        `;
      case "entered":
        return css`
          opacity: 1;
          transition: opacity ${TRANSITION_DURATION}ms ease;
        `;
      case "exited":
        return css`
          opacity: 1;
        `;
      case "exiting":
        return css`
          opacity: 0;
          transition: opacity ${TRANSITION_DURATION}ms ease;
        `;
    }
  }}
`;

const spin = keyframes`
to {
  transform: rotate(0deg);
}
`;

const Image = styled.img`
  width: 200px;
  transform: rotate(360deg);
  animation-name: ${spin};
  animation-duration: 1.5s;
  animation-timing-function: cubic-bezier(0.74, -0.6, 0.105, 1.62);
  animation-iteration-count: infinite;
  animation-delay: 1s;
`;

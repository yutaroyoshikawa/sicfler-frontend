import React, { useState, useMemo } from "react";
import styled, { css } from "styled-components";
import gql from "graphql-tag";
import { CSSTransition } from "react-transition-group";
import { TransitionStatus } from "react-transition-group/Transition";
import { useQuery } from "@apollo/react-hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import Clock from "../molecules/Clock";
import QrShare from "../atoms/QrShare";
import * as CSS from "../../commonStyles";

const GET_LOCAL_STATE = gql`
  query getFocusPost {
    focusPost @client {
      isFocus
      geoLocation {
        lat
        lng
      }
    }
  }
`;

const BUTTON_TRANSITION_DURATION = 300;

const SideBar: React.FC = () => {
  const local = useQuery(GET_LOCAL_STATE);
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);

  useMemo(() => {
    setIsTimeOut(false);
    setTimeout(() => {
      setIsTimeOut(true);
    }, BUTTON_TRANSITION_DURATION);
    // eslint-disable-next-line
  }, [local.data.focusPost.isFocus]);

  const onClickInfocus = () => {
    local.client.writeData({
      data: {
        focusPost: {
          ...local.data.focusPost,
          isFocus: false
        }
      },
    });
  };

  return (
    <Wrapper>
      <Clock />
      <CSSTransition
        in={local.data.focusPost.isFocus && isTimeOut}
        timeout={BUTTON_TRANSITION_DURATION}
        mountOnEnter={true}
        unmountOnExit={true}
      >
        {status => (
          <IconWrapper transitionStatus={status}>
            <BackButton onClick={() => onClickInfocus()}>
              <BackIcon icon={faAngleLeft} />
              <BackText>もどる</BackText>
            </BackButton>
            <QrShare
              lat={local.data.focusPost.geoLocation.lat}
              lng={local.data.focusPost.geoLocation.lng}
            />
          </IconWrapper>
        )}
      </CSSTransition>
      <CSSTransition
        in={!local.data.focusPost.isFocus && isTimeOut}
        timeout={BUTTON_TRANSITION_DURATION}
        mountOnEnter={true}
        unmountOnExit={true}
      >
        {status => (
          <LogoWrapper transitionStatus={status}>
            <LogoImage
              src={`${process.env.PUBLIC_URL}/sicfler_logo.png`}
              alt="ロゴ"
            />
          </LogoWrapper>
        )}
      </CSSTransition>
      <div />
    </Wrapper>
  );
};

export default SideBar;

const Wrapper = styled.nav`
  width: ${CSS.SideBarWidth};
  height: 100vh;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  background: #fff;
  z-index: 99999;
  padding: 100px 0;
  box-sizing: border-box;
`;

const LogoWrapper = styled.div`
  padding: 20px;
  box-sizing: border-box;

  ${(props: { transitionStatus: TransitionStatus }) => {
    switch (props.transitionStatus) {
      case "entering":
        return css`
          opacity: 0;
          transform: translateX(-20px);
        `;
      case "entered":
        return css`
          opacity: 1;
          transform: translateX(0);
          transition: all ${BUTTON_TRANSITION_DURATION}ms ease;
        `;
      case "exited":
        return css`
          opacity: 1;
          transform: translateX(0);
        `;
      case "exiting":
        return css`
          opacity: 0;
          transform: translateX(-20px);
          transition: all ${BUTTON_TRANSITION_DURATION}ms ease;
        `;
    }
  }}
`;

const IconWrapper = styled.figure`
  display: flex;
  justify-content: center;
  flex-direction: column;
  ${(props: { transitionStatus: TransitionStatus }) => {
    switch (props.transitionStatus) {
      case "entering":
        return css`
          opacity: 0;
          transform: translateX(20px) translateY(1em);
        `;
      case "entered":
        return css`
          opacity: 1;
          transform: translateX(0) translateY(1em);
          transition: all ${BUTTON_TRANSITION_DURATION}ms ease;
        `;
      case "exited":
        return css`
          opacity: 1;
          transform: translateX(0) translateY(1em);
        `;
      case "exiting":
        return css`
          opacity: 0;
          transform: translateX(20px) translateY(1em);
          transition: all ${BUTTON_TRANSITION_DURATION}ms ease;
        `;
    }
  }}
`;

const BackText = styled.div`
  font-size: 20px;
  color: #707070;
  font-weight: bold;
`;

const BackButton = styled.button`
  outline: none;
  border: none;
  cursor: pointer;
  background: transparent;
  margin: 110px auto;
`;

const BackIcon = styled(FontAwesomeIcon)`
  font-size: 80px;
  background: transparent;
  color: #808080;
`;

const LogoImage = styled.img`
  width: 100%;
`;

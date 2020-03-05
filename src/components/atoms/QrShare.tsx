import React, { useState } from "react";
import { createPortal } from "react-dom";
import styled, { css } from "styled-components";
import { CSSTransition } from "react-transition-group";
import { TransitionStatus } from "react-transition-group/Transition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import QRCode from "qrcode.react";
import * as CSS from "../../commonStyles";

const TRANSITION_DURATION = 600;

interface Props {
  lat: number;
  lng: number;
}

const Portal: React.FC = props => {
  return createPortal(props.children, document.body);
};

const QrShare: React.FC<Props> = props => {
  const [vissibleQr, setVissibleQr] = useState<boolean>(false);

  return (
    <>
      <CSSTransition
        in={vissibleQr}
        timeout={TRANSITION_DURATION}
        mountOnEnter={true}
        unmountOnExit={true}
      >
        {status => (
          <Portal>
            <CoverBack
              transitionStatus={status}
              onClick={() => setVissibleQr(false)}
            />
            <QrWrapper transitionStatus={status}>
              <QrDescription>イベント開催地までのルートを共有</QrDescription>
              <QRCode
                value={`https://www.google.com/maps/dir/?api=1&origin=現在地&destination=${props.lat},${props.lng}&travelmode=walking`}
                size={266}
                fgColor="#707070"
              />
            </QrWrapper>
          </Portal>
        )}
      </CSSTransition>
      <QrButton onClick={() => setVissibleQr(true)}>
        <QrButtonDescription>ルートを共有</QrButtonDescription>
        <QrButtonIcon icon={faQrcode} />
      </QrButton>
    </>
  );
};

export default QrShare;

const Z_INDEX = 99999;

const CoverBack = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${Z_INDEX};
  background: rgba(0, 0, 0, 0.7);

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

const AFTER_SIZE = 35;

const QrWrapper = styled.div`
  width: 385px;
  height: 438px;
  border-radius: 43px;
  background: #fff;
  padding: 32px 59px;
  box-sizing: border-box;
  position: absolute;
  top: 50vh;
  left: calc(${CSS.SideBarWidth} + ${AFTER_SIZE}px + 10px);
  transform: translateY(-139px);
  z-index: ${Z_INDEX + 1};
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);

  ${(props: { transitionStatus: TransitionStatus }) => {
    switch (props.transitionStatus) {
      case "entering":
        return css`
          opacity: 0;
          transform: scale(0.8);
        `;
      case "entered":
        return css`
          opacity: 1;
          transition: all ${TRANSITION_DURATION}ms cubic-bezier(0.740, -0.600, 0.105, 1.620);
          transition-delay: 200ms;
        `;
      case "exited":
        return css`
          opacity: 1;
        `;
      case "exiting":
        return css`
          opacity: 0;
          transform: scale(0.8);
          transition: all ${TRANSITION_DURATION}ms cubic-bezier(0.740, -0.600, 0.105, 1.620);
        `;
    }
  }}

  &::after {
    content: "";
    position: absolute;
    z-index: ${Z_INDEX + 1};
    display: block;
    margin-left: -15px;
    border: 23px solid transparent;
    border-top: ${AFTER_SIZE}px solid #fff;
    bottom: 79px;
    left: calc(-${AFTER_SIZE}px + 10px);
    transform: rotate(90deg);
  }
`;

const QrDescription = styled.p`
  color: #707070;
  font-size: 26px;
  font-weight: bold;
  text-align: justify;
  word-break: break-all;
  margin-bottom: 34px;
  line-height: 38px;
`;

const QrButton = styled.div`
  width: 105px;
  height: 120px;
  border-radius: 28px;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transition: all .4s ease;

  &:active {
    transform: scale(0.8);
  }
`;

const QrButtonDescription = styled.p`
  font-size: 11px;
  color: #707070;
  text-align: justify;
  font-weight: bold;
`;

const QrButtonIcon = styled(FontAwesomeIcon)`
  font-size: 80px;
  color: #707070;
`;

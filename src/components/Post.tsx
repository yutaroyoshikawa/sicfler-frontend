import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { CSSTransition } from "react-transition-group";
import { TransitionStatus } from "react-transition-group/Transition";
import GoogleMapReact from "google-map-react";
import { usePostQuery } from "../gen/graphql-client-api";

interface Props {
  isFocus: boolean;
  postId: string;
  handleInfocus: () => void;
}

const MAP_TRANDISION_DURATION = 300;
const POST_TRANSITION_DURATION = 500;
const MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY || "";
const BUCKET_URL = process.env.REACT_APP_SICFLER_BUCKET_URL || "";

const Post: React.FC<Props> = props => {
  const [isSkipQuery, setIsSkipQuery] = useState<boolean>(true);
  const { data, refetch, loading } = usePostQuery({
    skip: isSkipQuery,
  });

  useEffect(() => {
    if (props.postId) {
      setIsSkipQuery(false);
      refetch({
        id: props.postId,
      });
    }
  }, [props.postId]);

  return (
    <>
      <CSSTransition
        timeout={MAP_TRANDISION_DURATION}
        unmountOnExit={true}
        mountOnEnter={true}
        in={props.isFocus && data && data.post && !loading}
      >
        {status => (
          <MapWrapper transitionStatus={status}>
            <GoogleMapReact
              bootstrapURLKeys={{
                key: MAP_API_KEY,
              }}
              defaultCenter={{
                lat: data?.post.location?.lat!,
                lng: data?.post.location?.lng!,
              }}
              defaultZoom={15}
            >
              <Pin
                lat={data?.post.location?.lat!}
                lng={data?.post.location?.lng!}
              />
            </GoogleMapReact>
          </MapWrapper>
        )}
      </CSSTransition>
      <CSSTransition
        in={props.isFocus && data && data.post && !loading}
        timeout={POST_TRANSITION_DURATION}
        unmountOnExit={true}
        mountOnEnter={true}
      >
        {status => (
          <Wrap transitionStatus={status}>
            <PostSumbnail sumbnailUrl={data?.post.sumbnail!} />
            <PostName>{data?.post.name}</PostName>
            <DateTimeWrap>
              <DateTime>{new Date(data?.post.start).toUTCString()}</DateTime>
              <DateTime>{new Date(data?.post.finish).toUTCString()}</DateTime>
            </DateTimeWrap>
            <Address>{data?.post.address}</Address>
            <Discription>{data?.post.discription}</Discription>
            <PostImagesWrap>
              {(data?.post.images! as string[]).map(image => (
                <PostImage
                  key={image}
                  src={`${BUCKET_URL}/${image}`}
                  alt="イベントイメージ"
                />
              ))}
            </PostImagesWrap>
            {(data?.post.visitors as {
              visitorName: string;
              image: string;
              discription: string;
            }[]).length > 0 && (
              <VisitorsWrap>
                <VisitorTitle>こんな人が来ました</VisitorTitle>
                {(data?.post.visitors as {
                  visitorName: string;
                  image: string;
                  discription: string;
                }[]).map(visitor => (
                  <VisitorItemWrap key={visitor.image}>
                    <VisitorImage
                      src={`${BUCKET_URL}/${visitor.image}`}
                      alt="訪問者イメージ"
                    />
                    <VisitorName>{visitor.visitorName}</VisitorName>
                    <VisitorDiscription>
                      {visitor.discription}
                    </VisitorDiscription>
                  </VisitorItemWrap>
                ))}
              </VisitorsWrap>
            )}
          </Wrap>
        )}
      </CSSTransition>
    </>
  );
};

export default Post;

const MapWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;

  ${(props: { transitionStatus: TransitionStatus }) => {
    switch (props.transitionStatus) {
      case "entering":
        return css`
          opacity: 0;
        `;
      case "entered":
        return css`
          opacity: 0.7;
          transition: opacity ${MAP_TRANDISION_DURATION}ms ease;
        `;
      case "exited":
        return css`
          opacity: 0.7;
        `;
      case "exiting":
        return css`
          opacity: 0;
          transition: opacity ${MAP_TRANDISION_DURATION}ms ease;
        `;
    }
  }}
`;

const Pin = styled.div<{
  lat: number;
  lng: number;
}>``;

const Wrap = styled.div`
  width: 872px;
  height: 868px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  position: fixed;
  z-index: 3;
  bottom: 92px;
  left: calc(50vw - (872px / 2));

  ${(props: { transitionStatus: TransitionStatus }) => {
    switch (props.transitionStatus) {
      case "entering":
        return css`
          opacity: 0;
          transform: translateY(100px);
        `;
      case "entered":
        return css`
          opacity: 1;
          transform: translateY(0);
          transition: all ${POST_TRANSITION_DURATION}ms ease;
        `;
      case "exited":
        return css`
          opacity: 1;
          transform: translateY(0);
        `;
      case "exiting":
        return css`
          opacity: 0;
          transform: translateY(100px);
          transition: all ${POST_TRANSITION_DURATION}ms ease;
        `;
    }
  }}
`;

const PostSumbnail = styled.figure`
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  ${(props: { sumbnailUrl: string }) => css`
    background-image: src(${BUCKET_URL} / ${props.sumbnailUrl});
  `}
`;

const PostName = styled.h2`
  font-size: 45px;
  color: #707070;
`;

const DateTimeWrap = styled.div``;

const DateTime = styled.time``;

const Discription = styled.p``;

const PostImagesWrap = styled.div``;

const PostImage = styled.img``;

const Address = styled.p``;

const VisitorsWrap = styled.div``;

const VisitorTitle = styled.h3``;

const VisitorItemWrap = styled.div``;

const VisitorImage = styled.img``;

const VisitorName = styled.h4``;

const VisitorDiscription = styled.p``;
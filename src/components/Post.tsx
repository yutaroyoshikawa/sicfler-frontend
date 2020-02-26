import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { CSSTransition } from "react-transition-group";
import { TransitionStatus } from "react-transition-group/Transition";
import GoogleMapReact from "google-map-react";
import moment from "moment";
import { usePostQuery, Visitor } from "../gen/graphql-client-api";
import * as CSS from "../commonStyles";

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
              defaultZoom={17}
              options={{
                styles: mapStyle,
              }}
            >
              <Pin
                lat={data?.post.location?.lat!}
                lng={data?.post.location?.lng!}
              >
                ここ
              </Pin>
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
            <PostInfoWrapper>
              <PostName>{data?.post.name}</PostName>
              {(data?.post.visitors as {
                visitorName: string;
                image: string;
                discription: string;
              }[]).length > 0 && (
                <VisitorsWrap>
                  <VisitorTitle>こんな人が来ました</VisitorTitle>
                  {(data?.post.visitors as Visitor[]).map(visitor => (
                    <VisitorItemWrap key={visitor.sumbnail!}>
                      <VisitorImage
                        src={`${BUCKET_URL}/${visitor.sumbnail}`}
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
              <DateTimeWrap>
                <DateTime beforeContent="Start">
                  {moment(data?.post.start).format("YYYY/MM/DD hh:mm")}
                </DateTime>
              </DateTimeWrap>
              <DateTimeWrap>
                <DateTime beforeContent="Finish">
                  {moment(data?.post.finish).format("YYYY/MM/DD hh:mm")}
                </DateTime>
              </DateTimeWrap>
              <Discription>{data?.post.discription}</Discription>
              <Address>{data?.post.address}</Address>
              <PostImagesWrap>
                {(data?.post.images! as string[]).map(image => (
                  <PostImage
                    key={image}
                    src={`${BUCKET_URL}/${image}`}
                    alt="イベントイメージ"
                  />
                ))}
              </PostImagesWrap>
            </PostInfoWrapper>
          </Wrap>
        )}
      </CSSTransition>
    </>
  );
};

export default Post;

const MapWrapper = styled.div`
  width: calc(100vw - ${CSS.SideBarWidth});
  height: 100vh;
  position: fixed;
  z-index: 4;
  top: 0;
  left: ${CSS.SideBarWidth};

  ${(props: { transitionStatus: TransitionStatus }) => {
    switch (props.transitionStatus) {
      case "entering":
        return css`
          opacity: 0;
        `;
      case "entered":
        return css`
          opacity: 1;
          transition: opacity ${MAP_TRANDISION_DURATION}ms ease;
        `;
      case "exited":
        return css`
          opacity: 1;
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
  z-index: 5;
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
  width: 100%;
  height: 300px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 10px 10px 0 0;

  ${(props: { sumbnailUrl: string }) => css`
    background-image: url("${BUCKET_URL}/${props.sumbnailUrl}");
  `}
`;

const PostInfoWrapper = styled.div`
  width: 100%;
  height: 569px;
  padding: 50px;
  overflow-y: scroll;
  box-sizing: border-box;
`;

const PostName = styled.h2`
  font-size: 45px;
  color: #707070;
`;

const DateTimeWrap = styled.div`
  display: flex;
  align-items: center;
`;

const DateTime = styled.time`
  font-size: 35px;
  display: block;
  color: #707070;

  &::before {
    content: "${(props: { beforeContent: string }) => props.beforeContent}";
    width: 50px;
    height: 20px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    background: #f00;
    color: #fff;
    border-color: 5px;
    border-radius: 5px;
    padding: 5px;
    margin-right: 10px;
  }
`;

const Discription = styled.p``;

const PostImagesWrap = styled.div`
  margin-top: 64px;
  width: 100%;
  overflow-x: scroll;
`;

const PostImage = styled.img`
  width: 270px;
  height: 270px;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
  object-fit: cover;
  margin: 0 40px;
`;

const Address = styled.p``;

const VisitorsWrap = styled.div`
  margin-bottom: 35px;
`;

const VisitorTitle = styled.h3`
  font-size: 35px;
  color: #707070;
`;

const VisitorItemWrap = styled.div``;

const VisitorImage = styled.img`
  width: 343px;
  height: 223px;
  object-fit: cover;
`;

const VisitorName = styled.h4`
  font-size: 45px;
  color: #707070;
`;

const VisitorDiscription = styled.p``;

const mapStyle = [
  {
    featureType: "landscape.man_made",
    elementType: "geometry",
    stylers: [
      {
        color: "#f7f1df",
      },
    ],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [
      {
        color: "#d0e3b4",
      },
    ],
  },
  {
    featureType: "landscape.natural.terrain",
    elementType: "geometry",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.business",
    elementType: "all",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.medical",
    elementType: "geometry",
    stylers: [
      {
        color: "#fbd3da",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#bde6ab",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#ffe15f",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#efd151",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "black",
      },
    ],
  },
  {
    featureType: "transit.station.airport",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#cfb2db",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#a2daf2",
      },
    ],
  },
];

import React, { useEffect, useState, useMemo } from "react";
import styled, { css, keyframes } from "styled-components";
import { CSSTransition } from "react-transition-group";
import { TransitionStatus } from "react-transition-group/Transition";
import GoogleMapReact from "google-map-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { usePostQuery, Visitor } from "../gen/graphql-client-api";
import * as CSS from "../commonStyles";
import DateTime from "./molecules/DateTime";
import VisitorSlideShow from "./molecules/VisitorSlideShow";

const GET_LOCAL_STATE = gql`
  {
    focusLat @client
    focusLng @client
  }
`;

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
  const local = useQuery(GET_LOCAL_STATE);
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

  useMemo(() => {
    if (data && data.post) {
      local.client.writeData({
        data: {
          focusLat: data.post.location?.lat,
          focusLng: data.post.location?.lng,
        }
      })
    }
  }, [data])

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
                lat: data?.post.location?.lat! - 0.003,
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
          <>
            {status === "entered" && (
              <PostNameWrap>
                <Address>{data?.post.address}</Address>
                <PostName>{data?.post.name}</PostName>
              </PostNameWrap>
            )}
            <Wrap transitionStatus={status}>
              <SumbnailWrapper>
                <PostSumbnail sumbnailUrl={data?.post.sumbnail!} />
                <DateTimes>
                  <DateTimeWrap>
                    <DateTime markText="スタート" datetime={new Date(data?.post.start)} />
                  </DateTimeWrap>
                  <DateTimeWrap>
                    <DateTime markText="フィニッシュ" datetime={new Date(data?.post.finish)} />
                  </DateTimeWrap>
                </DateTimes>
              </SumbnailWrapper>
              <PostImagesWrap>
                {(data?.post.images! as string[]).map(image => (
                  <PostImage
                    key={image}
                    src={`${BUCKET_URL}/${image}`}
                    alt="イベントイメージ"
                  />
                ))}
              </PostImagesWrap>
              <PostInfoWrapper>
                <OrnerIconWrap>
                  <OrnerIcon iconUrl={`${BUCKET_URL}/${data?.post.orner.icon}`} />
                  <OrnerName>{data?.post.orner.name}</OrnerName>
                </OrnerIconWrap>
                {(data?.post.visitors as {
                  visitorName: string;
                  image: string;
                  discription: string;
                }[]).length > 0 && (
                  <VisitorsWrap>
                    <VisitorTitle>こんな人が来ました</VisitorTitle>
                    <VisitorSlideShow visitors={data?.post.visitors! as Visitor[]} />
                  </VisitorsWrap>
                )}
                <Discription>{data?.post.discription}</Discription>
              </PostInfoWrapper>
            </Wrap>
          </>
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

const POST_WRAP_HEIGHT = "868px";

const Wrap = styled.div`
  max-width: 872px;
  height: 868px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  position: fixed;
  z-index: 5;
  bottom: 92px;
  left: calc(50vw - (872px / 2) + (${CSS.SideBarWidth} / 2));

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

const SUMBNAIL_HEIGHT = "463px";

const SumbnailWrapper = styled.div`
  width: 872px;
  height: ${SUMBNAIL_HEIGHT};
`;

const PostSumbnail = styled.figure`
  width: 100%;
  height: ${SUMBNAIL_HEIGHT};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 10px 10px 0 0;

  ${(props: { sumbnailUrl: string }) => css`
    background-image: url("${BUCKET_URL}/${props.sumbnailUrl}");
  `}
`;

const PostImageHeight = "180px";

const PostInfoWrapper = styled.div`
  width: 100%;
  height: calc(${POST_WRAP_HEIGHT} - ${SUMBNAIL_HEIGHT});
  padding: calc(${PostImageHeight} / 2) 50px 50px 50px;
  overflow-y: scroll;
  overflow-x: hidden;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const scaleIn = keyframes`
from {
  width: 0px;
}
to {
  width: auto;
}
`;

const PostName = styled.h2`
  font-size: 69px;
  max-width: 872px;
  word-break: break-all;
  display: inline-block;
  width: auto;
  font-weight: bold;
  color: #707070;
  background: #fff;
`;

const PostNameWrap = styled.div`
  max-width: 872px;
  width: auto;
  position: fixed;
  z-index: 5;
  top: 92px;
  left: calc(50vw - (872px / 2) + (${CSS.SideBarWidth} / 2));
  overflow: hidden;
  animation-name: ${scaleIn};
  animation-duration: .5s;
  animation-timing-function: ease-out;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const DateTimes = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 23px;
`;

const DateTimeWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 13px;
`;

const OrnerIconWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 27px auto;
`;

const OrnerIcon = styled.figure`
  width: 53px;
  height: 53px;
  border-radius: 50%;
  background-image: url(${(props: { iconUrl: string }) => props.iconUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
`;

const OrnerName = styled.p`
  font-size: 25px;
  color: #969696;
  margin-left: 13px;
  display: inline-block;
`;

const Discription = styled.p`
  font-size: 27px;
  color: #6e6b6b;
  text-align: justify;
  line-height: 40px;
`;

const PostImagesWrap = styled.div`
  width: 100%;
  position: absolute;
  display: flex;
  transform: translateY(calc((${PostImageHeight} / 2 + 15px) * -1));
  overflow-x: scroll;
  padding: 15px 0;
  z-index: 5;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const PostImage = styled.img`
  width: 297px;
  display: flex;
  flex-shrink: 0;
  height: ${PostImageHeight};
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
  object-fit: cover;
  border-radius: 32px;
  margin: 0 40px;
`;

const Address = styled.p`
  font-size: 26px;
  max-width: 872px;
  word-break: break-all;
  display: block;
  font-weight: bold;
  color: #707070;
  background: #fff;
  margin-bottom: 14px;
`;

const VisitorsWrap = styled.div`
  margin-bottom: 35px;
  position: relative;
  z-index: 4;
`;

const VisitorTitle = styled.h3`
  font-size: 25px;
  color: #707070;
  margin-bottom: 16px;
`;

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
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        visibility: "on",
      },
      {
        color: "#ffffff",
      },
      {
        lightness: 16,
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        saturation: 36,
      },
      {
        color: "#333333",
      },
      {
        lightness: 40,
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#f2f2f2",
      },
      {
        lightness: 19,
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#fefefe",
      },
      {
        lightness: 20,
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#fefefe",
      },
      {
        lightness: 17,
      },
      {
        weight: 1.2,
      },
    ],
  },
];

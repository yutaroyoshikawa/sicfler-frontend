import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import styled, { css } from "styled-components";
import DateTime from "./DateTime";
import OrnerIcon from "../atoms/OrnerIcon";

const GET_USERINFO = gql`
  query getTargets {
    targets @client {
      age
      gender
    }
  }
`;

const BUCKET_URL = process.env.REACT_APP_SICFLER_BUCKET_URL || "";

interface Props {
  sumbnailUrl: string;
  postName: string;
  start: Date;
  finish: Date;
  orner: {
    name: string;
    iconUrl: string;
  };
  target: {
    ageGroup: number;
    gender: number;
  };
  onClick: () => void;
}

const returnGender = (genderId: number) => {
  switch (genderId) {
    case 0:
      return "male";
    case 1:
      return "female";
    default:
      return "";
  }
};

const ListItemPost: React.FC<Props> = props => {
  const local = useQuery(GET_USERINFO);

  return (
    <Wrap
      onClick={() => props.onClick()}
      isRecommend={
        local.data.targets.some((target: any) => {
          return props.target.ageGroup <= target.age &&
          props.target.ageGroup + 10 >= target.age &&
          returnGender(props.target.gender) === target.gender
        })
      }
    >
      <Sumbnail imageUrl={`${BUCKET_URL}/${props.sumbnailUrl}`} />
      <div>
        <PostName>{props.postName}</PostName>
        <PostInfoWrap>
          <DateTimeWrap>
            <DateTime
              type="listItem"
              markText="スタート"
              datetime={props.start}
            />
          </DateTimeWrap>
          <DateTimeWrap>
            <DateTime
              type="listItem"
              markText="フィニッシュ"
              datetime={props.finish}
            />
          </DateTimeWrap>
          <OrnerIcon
            type="listItem"
            iconUrl={props.orner.iconUrl}
            ornerName={props.orner.name}
          />
        </PostInfoWrap>
      </div>
    </Wrap>
  );
};

export default ListItemPost;

const Wrap = styled.div`
  width: 366px;
  height: 370px;
  border-radius: 16px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  background: #fff;
  flex-shrink: 0;
  position: relative;
  z-index: 3;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  margin: 60px 70px 0 70px;

  ${(props: {isRecommend: boolean}) =>
    props.isRecommend
      ? css`
          box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.3);
          &::before {
            opacity: 1;
            transform: translateY(0);
          }
          &::after {
            opacity: 1;
            transform: translateY(0);
          }
        `
      : css`
          box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
          &::before {
            opacity: 0;
            transform: translateY(60px);
          }
          &::after {
            opacity: 0;
            transform: translateY(60px);
          }
        `}

  &::before {
    content: "あなたにおすすめ";
    position: absolute;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    top: -60px;
    left: calc(343px / 2 - 100px);
    width: 200px;
    height: 40px;
    background: #faa44d;
    color: #fff;
    border-radius: 20px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    transition: transform 0.5s ease, opacity 0.5s ease;
    transform-origin: left top;
  }

  &::after {
    content: "";
    position: absolute;
    z-index: 2;
    display: block;
    margin-left: -15px;
    border: 15px solid transparent;
    border-top: 12px solid #faa44d;
    top: -20px;
    left: calc(343px / 2 - 25px);
    transition: transform 0.5s ease, opacity 0.5s ease;
  }

  &:active {
    transform: scale(0.9);
  }
`;

const Sumbnail = styled.figure`
  width: 100%;
  height: 198px;
  border-radius: 17px;
  background-image: url(${(props: { imageUrl: string }) => props.imageUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const PostInfoWrap = styled.div`
  padding: 35px 17px 19px 17px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
`;

const PostName = styled.h3`
  width: 305px;
  position: absolute;
  transform: translate(-32px, -13px);
  font-size: 35px;
  background: #fff;
  box-shadow: 5px 0 10px 0 rgba(0, 0, 0, 0.2);
  color: #707070;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const DateTimeWrap = styled.div`
  margin-bottom: 15px;
`;

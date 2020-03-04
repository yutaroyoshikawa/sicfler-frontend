import React from "react";
import styled, { css } from "styled-components";
import DateTime from "../molecules/DateTime";
import OrnerIcon from "../atoms/OrnerIcon";

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
  isRecommend: boolean;
  onClick: () => void;
}

const ListItemPost: React.FC<Props> = props => {
  return (
    <Wrap onClick={() => props.onClick()} isRecommend={props.isRecommend}>
      <Sumbnail imageUrl={`${BUCKET_URL}/${props.sumbnailUrl}`} />
      <div>
        <PostName>{props.postName}</PostName>
        <PostInfoWrap>
          <DateTimeWrap>
            <DateTime type="listItem" markText="スタート" datetime={props.start} />
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
  transition: all 0.5s ease;
  margin: 60px 70px 0 70px;

  ${(props: Pick<Props, "isRecommend">) =>
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
    transition: all 0.5s ease;
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
    transition: all 0.5s ease;
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

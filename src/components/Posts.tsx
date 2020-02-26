import React, { useState, useLayoutEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import Post from "./Post";
import gql from "graphql-tag";
import moment from "moment";
import { useQuery } from "@apollo/react-hooks";
import { usePostsBySicflerIdQuery } from "../gen/graphql-client-api";
import * as CSS from "../commonStyles";

const GET_USERINFO = gql`
  {
    age @client
    gender @client
    isFocus @client
  }
`;

const SICFLER_ID = process.env.REACT_APP_SICFLER_ID || "";
const BUCKET_URL = process.env.REACT_APP_SICFLER_BUCKET_URL || "";

const useLayout = () => {
  const [row, setRow] = useState<number>(0);
  const [column, setColumn] = useState<number>(0);
  const POST_HEIGHT = 460;
  const POST_WIDTH = 500;

  useLayoutEffect(() => {
    setRow(Math.floor(window.innerHeight / POST_HEIGHT));
    setColumn(Math.floor(window.innerWidth / POST_WIDTH));
  }, []);

  return {
    row,
    column,
  };
};

const Posts: React.FC = props => {
  const local = useQuery(GET_USERINFO);
  const [focusPostId, setFocusPostId] = useState<string>("");
  const { row, column } = useLayout();
  const postsQuery = usePostsBySicflerIdQuery({
    variables: {
      sicflerId: SICFLER_ID,
    },
  });

  const onClickPost = (postId: string) => {
    local.client.writeData({
      data: {
        isFocus: true,
      },
    });
    setFocusPostId(postId);
  };

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

  return (
    <>
      <Post
        isFocus={local.data.isFocus}
        postId={focusPostId}
        handleInfocus={() =>
          local.client.writeData({
            data: {
              isFocus: true,
            },
          })
        }
      />
      <Wrap
        sumbnailUrl={
          (postsQuery.data?.postsBySicflerId[0] &&
            `${BUCKET_URL}/${postsQuery.data?.postsBySicflerId[0]?.sumbnail}`) ||
          ""
        }
      >
        {[...Array(row)].map((_, index) => (
          <RowWrap key={index}>
            {index % 2 === 0 ? (
              <div>
                <Row>
                  {postsQuery.data?.postsBySicflerId.map(post => (
                    <>
                      {[...Array(column)].map((_, _index) => (
                        <Card
                          key={post?.id}
                          isRecommend={
                            post?.target.ageGroup! < local.data.age + 5 &&
                            post?.target.ageGroup! + 10 > local.data.age - 5 &&
                            returnGender(post?.target.gender!) ===
                              local.data.gender
                          }
                          onClick={() => onClickPost(post?.id!)}
                        >
                          <PostSumbnail>
                            <SumbnailImage
                              src={`${BUCKET_URL}/${post?.sumbnail}`}
                              alt="Postサムネイル"
                            />
                          </PostSumbnail>
                          <PostInfoWrapper>
                            <PostName>{post?.name}</PostName>
                            <PostOrnerWrapper>
                              <PostOrnerIcon
                                src={`${BUCKET_URL}/${post?.sumbnail}`}
                              />
                              <PostOrnerName>{post?.orner.name}</PostOrnerName>
                            </PostOrnerWrapper>
                            <PostDateTimeWrapper>
                              <PostDateTime beforeContent="Start">
                                {moment(post?.start).format("YYYY/MM/DD HH:mm")}
                              </PostDateTime>
                              <PostDateTime beforeContent="Finish">
                                {moment(post?.finish).format(
                                  "YYYY/MM/DD HH:mm"
                                )}
                              </PostDateTime>
                            </PostDateTimeWrapper>
                          </PostInfoWrapper>
                        </Card>
                      ))}
                    </>
                  ))}
                </Row>
                <DelayRow>
                  {postsQuery.data?.postsBySicflerId.map(post => (
                    <>
                      {[...Array(column)].map((_, _index) => (
                        <Card
                          key={post?.id}
                          isRecommend={
                            post?.target.ageGroup! < local.data.age + 5 &&
                            post?.target.ageGroup! + 10 > local.data.age - 5 &&
                            returnGender(post?.target.gender!) ===
                              local.data.gender
                          }
                          onClick={() => onClickPost(post?.id!)}
                        >
                          <PostSumbnail>
                            <SumbnailImage
                              src={`${BUCKET_URL}/${post?.sumbnail}`}
                              alt="Postサムネイル"
                            />
                          </PostSumbnail>
                          <PostInfoWrapper>
                            <PostName>{post?.name}</PostName>
                            <PostOrnerWrapper>
                              <PostOrnerIcon
                                src={`${BUCKET_URL}/${post?.sumbnail}`}
                              />
                              <PostOrnerName>{post?.orner.name}</PostOrnerName>
                            </PostOrnerWrapper>
                            <PostDateTimeWrapper>
                              <PostDateTime beforeContent="Start">
                                {moment(post?.start).format("YYYY/MM/DD HH:mm")}
                              </PostDateTime>
                              <PostDateTime beforeContent="Finish">
                                {moment(post?.finish).format(
                                  "YYYY/MM/DD HH:mm"
                                )}
                              </PostDateTime>
                            </PostDateTimeWrapper>
                          </PostInfoWrapper>
                        </Card>
                      ))}
                    </>
                  ))}
                </DelayRow>
              </div>
            ) : (
              <div>
                <RowReverse>
                  {postsQuery.data?.postsBySicflerId.map(post => (
                    <>
                      {[...Array(column)].map((_, _index) => (
                        <Card
                          key={post?.id}
                          isRecommend={
                            post?.target.ageGroup! < local.data.age + 5 &&
                            post?.target.ageGroup! + 10 > local.data.age - 5 &&
                            returnGender(post?.target.gender!) ===
                              local.data.gender
                          }
                          onClick={() => onClickPost(post?.id!)}
                        >
                          <PostSumbnail>
                            <SumbnailImage
                              src={`${BUCKET_URL}/${post?.sumbnail}`}
                              alt="Postサムネイル"
                            />
                          </PostSumbnail>
                          <PostInfoWrapper>
                            <PostName>{post?.name}</PostName>
                            <PostOrnerWrapper>
                              <PostOrnerIcon
                                src={`${BUCKET_URL}/${post?.sumbnail}`}
                              />
                              <PostOrnerName>{post?.orner.name}</PostOrnerName>
                            </PostOrnerWrapper>
                            <PostDateTimeWrapper>
                              <PostDateTime beforeContent="Start">
                                {moment(post?.start).format("YYYY/MM/DD HH:mm")}
                              </PostDateTime>
                              <PostDateTime beforeContent="Finish">
                                {moment(post?.finish).format(
                                  "YYYY/MM/DD HH:mm"
                                )}
                              </PostDateTime>
                            </PostDateTimeWrapper>
                          </PostInfoWrapper>
                        </Card>
                      ))}
                    </>
                  ))}
                </RowReverse>
                <DelayRowReverse>
                  {postsQuery.data?.postsBySicflerId.map(post => (
                    <>
                      {[...Array(column)].map((_, _index) => (
                        <Card
                          key={post?.id}
                          isRecommend={
                            post?.target.ageGroup! < local.data.age + 5 &&
                            post?.target.ageGroup! + 10 > local.data.age - 5 &&
                            returnGender(post?.target.gender!) ===
                              local.data.gender
                          }
                          onClick={() => onClickPost(post?.id!)}
                        >
                          <PostSumbnail>
                            <SumbnailImage
                              src={`${BUCKET_URL}/${post?.sumbnail}`}
                              alt="Postサムネイル"
                            />
                          </PostSumbnail>
                          <PostInfoWrapper>
                            <PostName>{post?.name}</PostName>
                            <PostOrnerWrapper>
                              <PostOrnerIcon
                                src={`${BUCKET_URL}/${post?.sumbnail}`}
                              />
                              <PostOrnerName>{post?.orner.name}</PostOrnerName>
                            </PostOrnerWrapper>
                            <PostDateTimeWrapper>
                              <PostDateTime beforeContent="Start">
                                {moment(post?.start).format("YYYY/MM/DD HH:mm")}
                              </PostDateTime>
                              <PostDateTime beforeContent="Finish">
                                {moment(post?.finish).format(
                                  "YYYY/MM/DD HH:mm"
                                )}
                              </PostDateTime>
                            </PostDateTimeWrapper>
                          </PostInfoWrapper>
                        </Card>
                      ))}
                    </>
                  ))}
                </DelayRowReverse>
              </div>
            )}
          </RowWrap>
        ))}
      </Wrap>
    </>
  );
};

export default Posts;

const marquee = keyframes`
{
  from {
    transform: translateX(calc(-100vw + ${CSS.SideBarWidth}));
  }
  to {
    transform: translateX(calc(100vw - ${CSS.SideBarWidth}));
  }
}
`;

const Wrap = styled.div`
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  ${(props: { sumbnailUrl: string }) => css`
    background-image: url("${props.sumbnailUrl}");
  `}

  &::before {
    content: "";
    display: block;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.7);
  }
`;

const RowWrap = styled.div`
  width: calc(100vw - ${CSS.SideBarWidth});
  overflow-x: hidden;
  position: relative;
  z-index: 3;
`;

const Row = styled.ul`
  height: 410px;
  width: 100vw;
  margin: 100px 0;
  display: flex;
  animation: ${marquee} linear 20s infinite;
`;

const DelayRow = styled.ul`
  height: 410px;
  width: 100vw;
  margin: 100px 0;
  display: flex;
  top: 0;
  position: absolute;
  z-index: 3;
  transform: translateX(calc(-100vw + ${CSS.SideBarWidth}));
  animation: ${marquee} linear 20s infinite;
  animation-delay: 10s;
`;

const RowReverse = styled.ul`
  height: 410px;
  width: calc(100vw - ${CSS.SideBarWidth});
  margin: 100px 0;
  display: flex;
  animation: ${marquee} linear 20s infinite reverse;
`;

const DelayRowReverse = styled.ul`
  height: 410px;
  width: 100vw;
  margin: 100px 0;
  display: flex;
  top: 0;
  position: absolute;
  z-index: 3;
  transform: translateX(calc(-100vw + ${CSS.SideBarWidth}));
  animation: ${marquee} linear 20s infinite reverse;
  animation-delay: 10s;
`;

const Card = styled.li`
  transition: all 0.5s ease;
  width: 343px;
  height: 400px;
  background: #fff;
  border-radius: 5px;
  flex-shrink: 0;
  margin: 0 100px;
  position: relative;
  z-index: 3;
  ${(props: { isRecommend: boolean }) =>
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
    background: #f00;
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
    border-top: 12px solid #f00;
    top: -20px;
    left: calc(343px / 2 - 25px);
    transition: all 0.5s ease;
  }
`;

const PostSumbnail = styled.figure`
  width: 100%;
  height: 200px;
  border-radius: 5px 5px 0 0;
`;

const SumbnailImage = styled.img`
  width: 100%;
  height: 200px;
  border-radius: 5px 5px 0 0;
  object-fit: cover;
`;

const PostInfoWrapper = styled.div`
  padding: 10px 15px;
`;

const PostName = styled.p`
  color: #707070;
  font-size: 40px;
  pointer-events: none;
`;

const PostOrnerWrapper = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const PostOrnerIcon = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  pointer-events: none;
`;

const PostOrnerName = styled.p`
  margin-left: 10px;
  font-size: 30px;
  pointer-events: none;
`;

const PostDateTimeWrapper = styled.p`
  display: flex;
  width: 100%;
  height: 70px;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

const PostDateTime = styled.time`
  display: block;
  pointer-events: none;

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

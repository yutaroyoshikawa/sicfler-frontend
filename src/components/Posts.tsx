import React, { useState, useLayoutEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import Post from "./Post";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { usePostsBySicflerIdQuery } from "../gen/graphql-client-api";
import ListItemPost from "./organisms/ListItemPost";
import * as CSS from "../commonStyles";
import Background from "./atoms/Background";

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
  const POST_HEIGHT = 370;
  const POST_HEIGHT_MARGIN = 30;
  const POST_WIDTH = 366;
  const POST_WIDTH_MARGIN = 70;

  useLayoutEffect(() => {
    setRow(
      Math.floor(window.innerHeight / (POST_HEIGHT_MARGIN * 2 + POST_HEIGHT))
    );
    setColumn(
      Math.floor(window.innerWidth / (POST_WIDTH_MARGIN * 2 + POST_WIDTH))
    );
  }, []);

  return {
    row,
    column,
  };
};

const rowIndex = (config: {
  columnLength: number;
  currentIndex: number;
  postLength: number;
  currentRow: number;
  isDelay: boolean;
}): number => {
  const {
    columnLength,
    currentIndex,
    postLength,
    currentRow,
    isDelay,
  } = config;

  if (!isDelay) {
    if (currentRow * columnLength > postLength) {
      return currentRow - 1 * columnLength + currentIndex - 1;
    }

    return currentIndex;
  }

  if (1 + currentIndex + columnLength > postLength) {
    return currentIndex;
  }

  return currentIndex + columnLength;
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
      {/* <Background
        sumbnails={postsQuery.data && postsQuery.data?.postsBySicflerId!.map(
          post => post?.sumbnail! as string
        ) || []}
      /> */}
      <Entire>
        <Wrap
          sumbnailUrl={
            (postsQuery.data?.postsBySicflerId[0] &&
              `${BUCKET_URL}/${postsQuery.data?.postsBySicflerId[0]?.sumbnail}`) ||
            ""
          }
        >
          {postsQuery.data &&
            postsQuery.data.postsBySicflerId.length > 0 &&
            [...Array(row)].map((_, currentRow) => (
              <RowWrap key={currentRow}>
                {currentRow % 2 === 0 ? (
                  <div>
                    <Row>
                      <>
                        {[...Array(column)].map((_, currentColumn) => {
                          const index = rowIndex({
                            columnLength: column,
                            currentIndex: currentColumn,
                            currentRow,
                            postLength: postsQuery.data?.postsBySicflerId!
                              .length,
                            isDelay: false,
                          });

                          const post = postsQuery.data?.postsBySicflerId[index];
                          const gender = returnGender(post?.target.gender!);

                          return (
                            <ListItemPost
                              key={post?.id!}
                              sumbnailUrl={post?.sumbnail!}
                              postName={post?.name!}
                              start={new Date(post?.start)}
                              finish={new Date(post?.finish!)}
                              orner={{
                                name: post?.orner.name!,
                                iconUrl: `${BUCKET_URL}/${post?.orner.icon}`,
                              }}
                              isRecommend={
                                post?.target.ageGroup! < local.data.age &&
                                gender === local.data.gender
                              }
                              onClick={() => onClickPost(post?.id!)}
                            />
                          );
                        })}
                      </>
                    </Row>
                    <DelayRow>
                      <>
                        {[...Array(column)].map((_, currentColumn) => {
                          const index = rowIndex({
                            columnLength: column,
                            currentIndex: currentColumn,
                            currentRow,
                            postLength: postsQuery.data?.postsBySicflerId!
                              .length,
                            isDelay: false,
                          });

                          const post = postsQuery.data?.postsBySicflerId[index];
                          const gender = returnGender(post?.target.gender!);

                          return (
                            <ListItemPost
                              key={post?.id!}
                              sumbnailUrl={post?.sumbnail!}
                              postName={post?.name!}
                              start={new Date(post?.start)}
                              finish={new Date(post?.finish!)}
                              orner={{
                                name: post?.orner.name!,
                                iconUrl: `${BUCKET_URL}/${post?.orner.icon}`,
                              }}
                              isRecommend={
                                post?.target.ageGroup! < local.data.age &&
                                gender === local.data.gender
                              }
                              onClick={() => onClickPost(post?.id!)}
                            />
                          );
                        })}
                      </>
                    </DelayRow>
                  </div>
                ) : (
                  <div>
                    <RowReverse>
                      <>
                        {[...Array(column)].map((_, currentColumn) => {
                          const index = rowIndex({
                            columnLength: column,
                            currentIndex: currentColumn,
                            currentRow,
                            postLength: postsQuery.data?.postsBySicflerId!
                              .length,
                            isDelay: false,
                          });

                          const post = postsQuery.data?.postsBySicflerId[index];
                          const gender = returnGender(post?.target.gender!);

                          return (
                            <ListItemPost
                              key={post?.id!}
                              sumbnailUrl={post?.sumbnail!}
                              postName={post?.name!}
                              start={new Date(post?.start)}
                              finish={new Date(post?.finish!)}
                              orner={{
                                name: post?.orner.name!,
                                iconUrl: `${BUCKET_URL}/${post?.orner.icon}`,
                              }}
                              isRecommend={
                                post?.target.ageGroup! < local.data.age &&
                                gender === local.data.gender
                              }
                              onClick={() => onClickPost(post?.id!)}
                            />
                          );
                        })}
                      </>
                    </RowReverse>
                    <DelayRowReverse>
                      <>
                        {[...Array(column)].map((_, currentColumn) => {
                          const index = rowIndex({
                            columnLength: column,
                            currentIndex: currentColumn,
                            currentRow,
                            postLength: postsQuery.data?.postsBySicflerId!
                              .length,
                            isDelay: false,
                          });

                          const post = postsQuery.data?.postsBySicflerId[index];
                          const gender = returnGender(post?.target.gender!);

                          return (
                            <ListItemPost
                              key={post?.id!}
                              sumbnailUrl={post?.sumbnail!}
                              postName={post?.name!}
                              start={new Date(post?.start)}
                              finish={new Date(post?.finish!)}
                              orner={{
                                name: post?.orner.name!,
                                iconUrl: `${BUCKET_URL}/${post?.orner.icon}`,
                              }}
                              isRecommend={
                                post?.target.ageGroup! < local.data.age &&
                                gender === local.data.gender
                              }
                              onClick={() => onClickPost(post?.id!)}
                            />
                          );
                        })}
                      </>
                    </DelayRowReverse>
                  </div>
                )}
              </RowWrap>
            ))}
        </Wrap>
      </Entire>
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

const Entire = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  align-items: center;
`;

const Wrap = styled.div`
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;

  &::-webkit-scrollbar {
    display: none;
  }

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
  margin: 30px 0;
  display: flex;
  animation: ${marquee} linear 60s infinite;
`;

const DelayRow = styled.ul`
  height: 410px;
  width: 100vw;
  margin: 30px 0;
  display: flex;
  top: 0;
  position: absolute;
  z-index: 3;
  transform: translateX(calc(-100vw + ${CSS.SideBarWidth}));
  animation: ${marquee} linear 60s infinite;
  animation-delay: 30s;
`;

const RowReverse = styled.ul`
  height: 410px;
  width: calc(100vw - ${CSS.SideBarWidth});
  margin: 30px 0;
  display: flex;
  animation: ${marquee} linear 60s infinite reverse;
`;

const DelayRowReverse = styled.ul`
  height: 410px;
  width: 100vw;
  margin: 30px 0;
  display: flex;
  top: 0;
  position: absolute;
  z-index: 3;
  transform: translateX(calc(-100vw + ${CSS.SideBarWidth}));
  animation: ${marquee} linear 60s infinite reverse;
  animation-delay: 30s;
`;

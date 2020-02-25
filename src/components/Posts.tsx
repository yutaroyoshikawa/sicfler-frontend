import React, { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import Post from "./Post";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { usePostsBySicflerIdQuery } from "../gen/graphql-client-api";

const GET_USERINFO = gql`
  {
    age @client
    gender @client
    isFocus @client
  }
`;

const SICFLER_ID = process.env.REACT_APP_SICFLER_ID || "";

const Posts: React.FC = props => {
  const local = useQuery(GET_USERINFO);
  const [focusPostId, setFocusPostId] = useState<string>("");
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
      <Wrap>
        <RowWrap>
          <RowReverse>
            {postsQuery.data?.postsBySicflerId.map(post => (
              <Card
                key={post?.id}
                isRecommend={
                  post?.target.ageGroup! < local.data.age &&
                  post?.target.ageGroup! + 10 > local.data.age &&
                  post?.target.gender! === local.data.gender
                }
                onClick={() => onClickPost(post?.id!)}
              >
                <PostName>{post?.name}</PostName>
              </Card>
            ))}
          </RowReverse>
        </RowWrap>
      </Wrap>
    </>
  );
};

export default Posts;

const marquee = keyframes`
{
  from {
    transform: translateX(-100vw);
  }
  to {
    transform: translateX(100vw);
  }
}
`;

const Wrap = styled.div``;

const RowWrap = styled.div`
  width: 100vw;
  overflow-x: hidden;
`;

const Row = styled.ul`
  height: 410px;
  width: 100vw;
  margin: 100px 0;
  display: flex;
  animation: ${marquee} linear 20s infinite;
`;

const RowReverse = styled.ul`
  height: 410px;
  width: 100vw;
  margin: 100px 0;
  display: flex;
  animation: ${marquee} linear 20s infinite reverse;
`;

const Card = styled.li`
  transition: all 0.5s ease;
  width: 343px;
  height: 400px;
  background: #fff;
  border-radius: 5px;
  flex-shrink: 0;
  margin: 0 100px;
  ${(props: { isRecommend: boolean }) =>
    props.isRecommend
      ? css`
          box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.3);
        `
      : css`
          box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
        `}
`;

const PostName = styled.p`
  transition: all 1s ease;
  color: #000;
  position: relative;
  top: 0;
  left: 0;
`;

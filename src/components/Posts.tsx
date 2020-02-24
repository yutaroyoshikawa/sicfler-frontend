import React from "react";
import styled, { css, keyframes } from "styled-components";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { usePostsBySicflerIdQuery } from "../gen/graphql-client-api"

const GET_USERINFO = gql`
{
  age @client
  gender @client
}
`;

const Posts: React.FC = props => {
  const local = useQuery(GET_USERINFO);
  const postsQuery = usePostsBySicflerIdQuery({
    variables: {
      sicflerId: "hoge"
    }
  });

  return (
    <Wrap>
    <RowWrap>
      <Row>
      {postsQuery.data?.postsBySicflerId.map(post => (
        <>
          <Card key={post?.id} isFocus={local.data.age < 30 + 5 && local.data.age > 20 - 5}>
            <PostName>
              {post?.name}
            </PostName>
          </Card>
          <Card key={post?.id} isFocus={local.data.age < 30 + 5 && local.data.age > 20 - 5}>
          <PostName>
            {post?.name}
          </PostName>
        </Card>
        <Card key={post?.id} isFocus={local.data.age < 30 + 5 && local.data.age > 20 - 5}>
          <PostName>
            {post?.name}
          </PostName>
        </Card>
        <Card key={post?.id} isFocus={local.data.age < 30 + 5 && local.data.age > 20 - 5}>
          <PostName>
            {post?.name}
          </PostName>
        </Card>
        <Card key={post?.id} isFocus={local.data.age < 30 + 5 && local.data.age > 20 - 5}>
          <PostName>
            {post?.name}
          </PostName>
        </Card>
        </>
      ))}
      </Row>
    </RowWrap>
    <RowWrap>
      <RowReverse>
      {postsQuery.data?.postsBySicflerId.map(post => (
        <>
          <Card key={post?.id} isFocus={local.data.age < 30 + 5 && local.data.age > 20 - 5}>
            <PostName>
              {post?.name}
            </PostName>
          </Card>
          <Card key={post?.id} isFocus={local.data.age < 30 + 5 && local.data.age > 20 - 5}>
          <PostName>
            {post?.name}
          </PostName>
        </Card>
        <Card key={post?.id} isFocus={local.data.age < 30 + 5 && local.data.age > 20 - 5}>
          <PostName>
            {post?.name}
          </PostName>
        </Card>
        <Card key={post?.id} isFocus={local.data.age < 30 + 5 && local.data.age > 20 - 5}>
          <PostName>
            {post?.name}
          </PostName>
        </Card>
        <Card key={post?.id} isFocus={local.data.age < 30 + 5 && local.data.age > 20 - 5}>
          <PostName>
            {post?.name}
          </PostName>
        </Card>
        </>
      ))}
      </RowReverse>
    </RowWrap>
    <RowWrap>
      <Row>
      {postsQuery.data?.postsBySicflerId.map(post => (
        <>
          <Card key={post?.id} isFocus={local.data.age < 30 + 5 && local.data.age > 20 - 5}>
            <PostName>
              {post?.name}
            </PostName>
          </Card>
          <Card key={post?.id} isFocus={local.data.age < 30 + 5 && local.data.age > 20 - 5}>
          <PostName>
            {post?.name}
          </PostName>
        </Card>
        <Card key={post?.id} isFocus={local.data.age < 30 + 5 && local.data.age > 20 - 5}>
          <PostName>
            {post?.name}
          </PostName>
        </Card>
        <Card key={post?.id} isFocus={local.data.age < 30 + 5 && local.data.age > 20 - 5}>
          <PostName>
            {post?.name}
          </PostName>
        </Card>
        <Card key={post?.id} isFocus={local.data.age < 30 + 5 && local.data.age > 20 - 5}>
          <PostName>
            {post?.name}
          </PostName>
        </Card>
        </>
      ))}
      </Row>
    </RowWrap>
    </Wrap>
  );
};

export default Posts;

const marquee = keyframes`
{
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}
`;



const Wrap = styled.div`
`;

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
  animation: ${marquee} linear 50s infinite reverse;
`;

const Card = styled.li`
  transition: all .5s ease;
  width: 343px;
  height: 400px;
  background: #fff;
  border-radius: 5px;
  flex-shrink: 0;
  margin: 0 100px;
  ${(props: { isFocus: boolean }) => props.isFocus
    ? css`
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.3);
    ` : css`
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

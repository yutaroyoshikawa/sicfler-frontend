import React, { useState, useLayoutEffect } from "react";
import styled from "styled-components";
import Post from "./Post";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { usePostsBySicflerIdQuery } from "../gen/graphql-client-api";
import PostList from "./organisms/PostList";
import Background from "./atoms/Background";

const GET_USERINFO = gql`
  query getIsFocus {
    focusPost @client {
      isFocus
      geoLocation {
        lat
        lng
      }
    }
  }
`;

const CHANGE_FOCUS_POST = gql`
  mutation changeFocusTarget($focusPost: FocusPost!) {
    updateFocusPost(focusPost: $focusPost) @client
  }
`;

const SICFLER_ID = process.env.REACT_APP_SICFLER_ID || "";
const BUCKET_URL = process.env.REACT_APP_SICFLER_BUCKET_URL || "";

const useLayout = () => {
  const [row, setRow] = useState<number>(0);
  const POST_HEIGHT = 546;

  useLayoutEffect(() => {
    setRow(Math.floor(window.innerHeight / POST_HEIGHT));
  }, []);

  return {
    row,
  };
};

const Posts: React.FC = () => {
  const local = useQuery(GET_USERINFO);
  const [focusPostMutation] = useMutation(CHANGE_FOCUS_POST);
  const [focusPostId, setFocusPostId] = useState<string>("");
  const { row } = useLayout();
  const postsQuery = usePostsBySicflerIdQuery({
    variables: {
      sicflerId: SICFLER_ID,
    },
  });

  const onClickPost = (postId: string) => {
    focusPostMutation({
      variables: {
        focusPost: {
          isFocus: true,
          geoLocation: {
            lat: local.data.focusPost.geoLocation.lat,
            lng: local.data.focusPost.geoLocation.lng
          }
        }
      }
    });
    setFocusPostId(postId);
  };

  return (
    <>
      <Post
        isFocus={local.data.focusPost.isFocus}
        postId={focusPostId}
        handleInfocus={() =>
          focusPostMutation({
            variables: {
              focusPost: {
                isFocus: false,
                geoLocation: {
                  lat: local.data.focusPost.geoLocation.lat,
                  lng: local.data.focusPost.geoLocation.lng
                }
              }
            }
          })
        }
      />
      <Background
        // eslint-disable-next-line
        sumbnails={
          (postsQuery.data &&
            postsQuery.data?.postsBySicflerId!.map(
              post => post?.sumbnail! as string
              // eslint-disable-next-line
            )) ||
          []
        }
      />
      <Entire>
        <Wrap>
          {postsQuery.data &&
            postsQuery.data.postsBySicflerId.length > 0 &&
            [...Array(row)].map((_, currentRow) => (
              <RowWrap key={currentRow}>
                <PostList
                  items={postsQuery.data?.postsBySicflerId!.map(post => ({
                    sumbnailUrl: post?.sumbnail!,
                    postName: post?.name!,
                    start: new Date(post?.start),
                    finish: new Date(post?.finish!),
                    orner: {
                      name: post?.orner.name!,
                      iconUrl: `${BUCKET_URL}/${post?.orner.icon}`,
                    },
                    target: {
                      ageGroup: post?.target.ageGroup!,
                      gender: post?.target.gender!,
                    },
                    onClick: () => onClickPost(post?.id!),
                  }))}
                  isReverse={currentRow % 2 === 0 ? false : true}
                />
              </RowWrap>
            ))}
        </Wrap>
      </Entire>
    </>
  );
};

export default Posts;

const Entire = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  align-items: center;
  overflow: hidden;
`;

const Wrap = styled.div`
  overflow: hidden;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const RowWrap = styled.div`
  position: relative;
  z-index: 3;
  overflow: hidden;

  &:first-child {
    margin-top: 100px;
  }

  &:last-child {
    margin-bottom: 100px;
  }

  &:not(:last-child):not(:first-child) {
    margin: 100px 0;
  }
`;

import React, { useRef, useEffect } from "react";
import styled, { css } from "styled-components";
import { FixedSizeList } from "react-window";
import ListItemPost from "../molecules/ListItemPost";

interface Props {
  items: {
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
  }[];
  isReverse: boolean;
}

const ITEM_COUNT = 99999999999;
let scrollAmount = 0;

const PostList: React.FC<Props> = props => {
  const listRef = useRef<FixedSizeList>(null);

  useEffect(() => {
    const scrollInfinity = () => {
      listRef.current && listRef.current.scrollTo(scrollAmount++);
    };
    let interval = 0;

    if (listRef.current) {
      interval = setInterval(() => {
        scrollInfinity();
      }, 55);
    }

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <List
      ref={listRef}
      itemCount={ITEM_COUNT}
      width={window.innerWidth - 130}
      height={446}
      itemSize={506}
      direction={props.isReverse ? "rtl" : "ltr"}
      layout="horizontal"
      onScroll={e => scrollAmount = e.scrollOffset}
    >
      {({ index, style }) => {
        const getItemIndex = (itemIndex: number): number => {
          if (itemIndex < props.items.length) {
            return itemIndex;
          }

          return itemIndex % props.items.length;
        };

        if (index === ITEM_COUNT) {
          scrollAmount = 0;
        };

        const prop = props.items[getItemIndex(index)];

        return (
          <Wrap style={{ ...style }} isReverse={props.isReverse}>
            <ListItemPost {...prop} />
          </Wrap>
        );
      }}
    </List>
  );
};

export default PostList;

const Wrap = styled.bdo`
  ${(props: { isReverse: boolean }) =>
    props.isReverse &&
    css`
      direction: ltr;
      
    `}
`;

const List = styled(FixedSizeList)`
  pointer-events: auto !important;
  &::-webkit-scrollbar {
    display: none;
  }

  & > div {
    pointer-events: auto !important;
  }
`;

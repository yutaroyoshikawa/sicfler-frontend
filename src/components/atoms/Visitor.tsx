import React from "react";
import styled from "styled-components";

interface Props {
  image: string;
  name: string;
  discription: string;
}

const Visitor: React.FC<Props> = props => {
  return (
    <Wrap>
      <ImageWrap>
        <Image src={props.image} alt="訪問者画像"/>
      </ImageWrap>
      <div>
        <Name>{props.name}</Name>
        <Discription>{props.discription}</Discription>
      </div>
    </Wrap>
  );
};

export default Visitor;

const Wrap = styled.div`
  display: flex;
`;

const Name = styled.h4`
  color: #707070;
  font-size: 29px;
  margin-bottom: 28px;
`;

const Discription = styled.p`
  color: #707070;
  font-size: 24px;
  line-height: 36px;
`;

const ImageWrap = styled.figure`
  width: 270px;
  height: 173px;
  margin-right: 42px;
`;

const Image = styled.img`
  object-fit: cover;
  width: 270px;
  height: 173px;
`;

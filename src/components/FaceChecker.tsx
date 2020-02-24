import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import * as faceApi from "face-api.js";

const GET_FACEINFO = gql`
  {
    age @client
    gender @client
  }
`;

const FaceChecker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { client } = useQuery(GET_FACEINFO);

  useEffect(() => {

    const writeFaceInfo = (age: number | null, gender: "male" | "female" | null) => {
      client.writeData({
        data: {
          age,
          gender
        }
      });
      console.log(age);
    };
    
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(async stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await faceApi.nets.ssdMobilenetv1.loadFromUri(`${process.env.PUBLIC_URL}/models`);
          await faceApi.nets.ageGenderNet.loadFromUri(`${process.env.PUBLIC_URL}/models`);
          setInterval(async () => {
            if (videoRef.current) {
              const result = await faceApi.detectSingleFace(videoRef.current)
                .withAgeAndGender().run();
              if (result) {
                writeFaceInfo(result.age, result.gender);
              } else {
                writeFaceInfo(null, null);
              }
            }
          }, 1000);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return <Video ref={videoRef} autoPlay={true} muted={true} playsInline={true} />;
};

export default FaceChecker;

const Video = styled.video`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
`;

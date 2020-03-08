import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import * as faceApi from "face-api.js";

const CHANGE_TARGETS = gql`
  mutation changeTargets($targets: [Target]!) {
    updateTargets(targets: $targets) @client
  }
`;

interface Targets {
  age: number,
  gender: "male" | "female"
}

const FaceChecker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [targetsMutation] = useMutation(CHANGE_TARGETS);

  useEffect(() => {
    const writeFaceInfo = (targets: Targets[]) => {
      targetsMutation({
        variables: {
          targets
        }
      });
    };
    
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(async stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await faceApi.nets.ssdMobilenetv1.loadFromUri(`${process.env.PUBLIC_URL}/models`);
          await faceApi.nets.ageGenderNet.loadFromUri(`${process.env.PUBLIC_URL}/models`);
          setInterval(async () => {
            if (videoRef.current) {
              const result = await faceApi.detectAllFaces(videoRef.current)
                .withAgeAndGender().run();
              if (result) {
                writeFaceInfo(result.map(face => ({
                  age: face.age,
                  gender: face.gender
                })));
              } else {
                writeFaceInfo([]);
              }
            }
          }, 1000);
        }
      })
      .catch(error => {
        console.error(error);
      });
    // eslint-disable-next-line
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

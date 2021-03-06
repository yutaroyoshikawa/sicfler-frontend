import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import * as THREE from "three";
import gsap from "gsap";

const fragment = `
// #pragma glslify: random = require(glsl-random)

#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

#define PI 3.14159265359

uniform sampler2D uTexture1;//sampler2Dは変数の型
uniform sampler2D uTexture2;
uniform sampler2D uTexture3;
uniform vec2 resolution;
uniform vec2 imageResolution;

uniform float time;
uniform float dispFactor;
uniform float effectFactor;

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main() {

    vec2 ratio = vec2(
      min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),
      min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)
    );

    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec4 disp = texture2D(uTexture3, uv);
    // vec4 black = texture2D(u_texture1, uv);
    //texture2DはGLSLの組み込み関数。テクスチャから色情報を抜き出すもの。だからoutputはテクスチャの色情報。
    //第一引数はテクスチャ、第二引数はUV座標。
    //「テクスチャーとは形状の情報しか持っていない3Dデータに対して、色や質感を与える情報のこと」

    // vec2 distortedPosition = vec2(uv.x + dispFactor * (1.0), uv.y);
    // vec2 distortedPosition2 = scale( vec2(0.5) ) * uv;
    // vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);
    vec2 distortedPosition2 = uv + rotate2d(30.0) * vec2(disp.r,disp.g) * (1.0 - dispFactor) * 0.1;

    // vec2 distortedPosition2 = vec2(uv.x * disp.r, uv.y * disp.r);

    //まずは、uv座標をいじっていると考える。
    //uv座標をいじったりすることで、例えばぐにゃぐにゃにしたりできる。
    //
    //dispFactorの値は、hoverする・しないで0と1の値が変化する（TweenMaxでいじってる）
    //参考 : https://nogson2.hatenablog.com/entry/2017/11/01/190122
    //disp変数はvec4型(r,g,b,a)。disp.rはその第一引数を取り出している。
    //

    vec4 _texture1 = texture2D(uTexture1, uv);
    vec4 _texture2 = texture2D(uTexture2, distortedPosition2);

    vec4 finalTexture = mix(_texture1, _texture2, dispFactor);
    //mix(x, y, a)は、x(1-a)+y*aを返す（つまり線形補間）
    //aは混ぜる割合的な。
    //例えば、赤と青を0.5の割合で混ぜると紫になる。

    gl_FragColor = finalTexture;
    // gl_FragColor = _texture2;
}
`;

const vertex = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const CANVAS_WIDTH = window.innerWidth + 30;
const CANVAS_HEIGHT = window.innerHeight + 30;

interface Uniform {
  type: "f" | "v2" | "t";
  value: any;
}

interface Uniforms {
  time: Uniform;
  resolution: Uniform;
  imageResolution: Uniform;
  uTexture1: Uniform;
  uTexture2: Uniform;
  uTexture3: Uniform;
  effectFactor: Uniform;
  dispFactor: Uniform;
}

const uniforms: Uniforms = {
  time: {
    type: "f",
    value: 1.0,
  },
  resolution: {
    type: "v2",
    value: new THREE.Vector2(),
  },
  imageResolution: {
    type: "v2",
    value: new THREE.Vector2(1024, 512),
  },
  uTexture1: {
    type: "t",
    value: null,
  },
  uTexture2: {
    type: "t",
    value: null,
  },
  uTexture3: {
    type: "t",
    value: null
  },
  effectFactor: {
    type: "f",
    value: 0.5,
  },
  dispFactor: {
    type: "f",
    value: 0.0,
  },
};

const initThree = (): {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
} => {
  const createCamera = () => {
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
    camera.updateProjectionMatrix();
    camera.position.z = 1;

    return camera;
  };

  const createRenderer = () => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    renderer.setPixelRatio(window.devicePixelRatio);

    return renderer;
  };

  const createScene = () => {
    const createGeometory = () => {
      const geometory = new THREE.PlaneBufferGeometry(2, 2);

      return geometory;
    };

    const createShaderMaterial = () => {
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        opacity: 1.0,
      });

      return material;
    };

    const geometory = createGeometory();
    const material = createShaderMaterial();
    const mesh = new THREE.Mesh(geometory, material);
    const scene = new THREE.Scene();

    scene.add(mesh);

    return scene;
  };

  const renderer = createRenderer();
  const scene = createScene();
  const camera = createCamera();

  return {
    renderer,
    scene,
    camera,
  };
};

let anim = 0;

const renderTick = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera
) => {
  renderer.render(scene, camera);
  anim = requestAnimationFrame(() => renderTick(renderer, scene, camera));
  uniforms.time.value += 0.5;
};

const setImage = async (imageUrl: string, order: 1 | 2 | 3) => {
  const LoadImage = (url: string): Promise<THREE.Texture> =>
    new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        url,
        texture => resolve(texture),
        error => reject(error)
      );
    });

  const texture = await LoadImage(imageUrl).catch(error => {
    console.error(error);
    return;
  });

  if (order === 1) {
    uniforms.uTexture1.value = texture;
  }
  if (order === 2) {
    uniforms.uTexture2.value = texture;
  }
  if (order === 3) {
    uniforms.uTexture3.value = texture;
  }
};

interface Props {
  sumbnails: string[];
}

const Background: React.FC<Props> = props => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const loadImages = async () => {
      await setImage(`${process.env.PUBLIC_URL}/images/designScramble.jpeg`, 1);
      await setImage(`${process.env.PUBLIC_URL}/images/seiho-aitai-12.jpg`, 2);
      await setImage(`${process.env.PUBLIC_URL}/images/designScramble.jpeg`, 3);
    };

    loadImages().then(() => {
      if (wrapperRef.current) {
        const { renderer, scene, camera } = initThree();
        wrapperRef.current.appendChild(renderer.domElement);
        renderTick(renderer, scene, camera);
      }
    });

    return () => {
      cancelAnimationFrame(anim);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      gsap.to(uniforms.dispFactor, 1.5, {
          value: currentIndex
      });
      setCurrentIndex(currentIndex < 3 ? currentIndex + 1 : 0);
    }, [10000]);
  }, [currentIndex]);

  return (
    <Entire>
      <CanvasWrapper ref={wrapperRef} />
    </Entire>
  );
};

export default Background;

const Entire = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
`;

const CanvasWrapper = styled.div`
  width: calc(100vw + 30px);
  height: calc(100vh + 30px);
  position: relative;
  top: -15px;
  left: -15px;
  filter: blur(10px) grayscale(40%);
`;

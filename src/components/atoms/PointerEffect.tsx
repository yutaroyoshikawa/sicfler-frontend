import React, { useRef, useEffect, useState, useMemo } from "react";
import styled, { css } from "styled-components";

enum COLORS {
  "#eeb900" = "#eeb900",
  "#6DD0A5" = "#6DD0A5",
  "#f799db" = "#f799db",
}

interface Coordinate {
  x: number;
  y: number;
}

interface Dot {
  size: number;
  color: COLORS;
  speed: number;
  pos: Coordinate;
  rot: number;
  vec: Coordinate;
}

const PARTICLE_LENGTH = 40;
const BASE_SIZE = 3;
const BASE_SPEED = 1;

const CANVAS_WIDTH = 350;
const CANVAS_HEIGHT = 350;
const CANVAS_CENTER: Coordinate = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT / 2,
};

let dots: Dot[] = [];

function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = (Object.values(anEnum) as unknown) as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}

const initDots = () => {
  const newDots = [...Array(PARTICLE_LENGTH)].map(() => {
    const size = Math.floor(Math.random() * 6) + BASE_SIZE;
    const rot = Math.random() * 360;
    const angle = (rot * Math.PI) / 180;
    const speed = size / BASE_SPEED;

    const dot: Dot = {
      size,
      rot,
      speed,
      color: randomEnum(COLORS),
      pos: {
        x: CANVAS_CENTER.x,
        y: CANVAS_CENTER.y,
      },
      vec: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      },
    };
    return dot;
  });
  dots = newDots;
};

const updatedDot = (dot: Dot) => {
  const updated = dot;

  updated.pos.x += dot.vec.x;
  updated.pos.y += dot.vec.y;

  return updated;
};

const dotDraw = (dot: Dot, ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = dot.color;
  ctx.beginPath();
  ctx.arc(dot.pos.x, dot.pos.y, dot.size, 0, 2 * Math.PI, false);
  ctx.fill();
};

let anim: number = 0;

const updateCanvas = (context: CanvasRenderingContext2D) => {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  [...Array(PARTICLE_LENGTH)].map((_, index) => {
    const dot = updatedDot(dots[index]);

    if (
      !(
        dot.pos.x > CANVAS_WIDTH + BASE_SIZE ||
        dot.pos.x < 0 - BASE_SIZE ||
        dot.pos.y > CANVAS_HEIGHT + BASE_SIZE ||
        dot.pos.y < 0 - BASE_SIZE
      )
    ) {
      dotDraw(dot, context);
    }
  });

  anim = requestAnimationFrame(() => updateCanvas(context));
};

const PointerEffectCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    initDots();
    const ctx = canvasRef.current ? canvasRef.current.getContext("2d") : null;
    ctx && updateCanvas(ctx);

    return () => {
      cancelAnimationFrame(anim);
    };
  }, [canvasRef.current]);

  return <Canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef} />;
};

const PointerEffect: React.FC = () => {
  const [vissibleEffect, setVissibleEffect] = useState<boolean>(false);
  const [pointerCord, setPointerCord] = useState<Coordinate>({
    x: 0,
    y: 0,
  });
  let timeout: number | null = null;

  useEffect(() => {
    window.addEventListener("mousedown", e => {
      timeout && clearTimeout(timeout);
      setVissibleEffect(false);
      setPointerCord({
        x: e.screenX,
        y: e.screenY,
      });
    });
  }, []);

  useMemo(() => {
    pointerCord.x > 0 && pointerCord.y > 0 && setVissibleEffect(true);
  }, [pointerCord]);

  useMemo(() => {
    timeout = setTimeout(() => {
      setVissibleEffect(false);
    }, 2000);
  }, [vissibleEffect]);

  return (
    <>
      {vissibleEffect && (
        <EffectWrap x={pointerCord.x} y={pointerCord.y}>
          <PointerEffectCanvas />
        </EffectWrap>
      )}
    </>
  );
};

export default PointerEffect;

const Canvas = styled.canvas`
  width: ${CANVAS_WIDTH / 2}px;
  height: ${CANVAS_HEIGHT / 2}px;
  border-radius: 50%;
  pointer-events: none;
`;

const EffectWrap = styled.div`
  position: absolute;
  z-index: 99999999;
  pointer-events: none;

  ${(props: Coordinate) => css`
    top: ${props.y}px;
    left: ${props.x}px;
  `}

  transform: translate(-${CANVAS_WIDTH / 4}px, -${CANVAS_HEIGHT / 4}px);
`;

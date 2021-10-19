import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { useMediaDevices } from '../utils/useMediaDevices';

const delay = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const HomePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const devices = useMediaDevices();
  const airpods = devices.find((device) =>
    device.label.toLowerCase().includes('airpods'),
  );

  const getCurrentFrame = useCallback(
    (index: number) => `/airpods/${index}.jpg`,
    [],
  );

  const animate = useCallback(async (fromIndex, toIndex, fps = 48) => {
    const delayAsSeconds = 1.0 / fps;
    const context = canvasRef.current.getContext('2d');

    if (fromIndex === toIndex) {
      return;
    }

    const img = new Image();
    img.onload = function () {
      context.drawImage(img, 0, 0);
    };

    const isFromBack = fromIndex > toIndex;
    if (!isFromBack) {
      for (let i = fromIndex; i <= toIndex; i++) {
        img.src = getCurrentFrame(i);
        await delay(delayAsSeconds * 1000);
      }
    } else {
      for (let i = fromIndex; i >= toIndex; i--) {
        img.src = getCurrentFrame(i);
        await delay(delayAsSeconds * 1000);
      }
    }
  }, []);

  const dismissAirpods = useCallback(() => animate(1, 148), []);
  const presentAirpods = useCallback(() => animate(148, 1), []);

  useEffect(() => {
    const preloadImages = () => {
      for (let i = 1; i < 148; i++) {
        const img = new Image();
        img.src = getCurrentFrame(i);
      }
    };
    preloadImages();
    presentAirpods().then(() => setTimeout(dismissAirpods, 500));
  }, []);

  return (
    <Container>
      <Airpods ref={canvasRef} width={1158} height={770} />
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Airpods = styled.canvas`
  width: 85%;
  max-width: 800px;
`;

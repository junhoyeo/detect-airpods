import { motion, AnimatePresence } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import dedent from 'dedent';

import { useMediaDevices } from '../utils/useMediaDevices';

const delay = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const HomePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const devices = useMediaDevices();

  const hadAirPodsBefore = useRef<boolean>(false);
  const hasAirPods = devices.find((device) =>
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

  const dismissAirPods = useCallback(() => animate(1, 148), []);
  const presentAirPods = useCallback(() => animate(148, 1), []);

  useEffect(() => {
    const preloadImages = () => {
      for (let i = 1; i < 148; i++) {
        const img = new Image();
        img.src = getCurrentFrame(i);
      }
    };
    preloadImages();
  }, []);

  const [text, setText] = useState<string>('');
  useEffect(() => {
    const favicon: HTMLLinkElement =
      document.querySelector("link[rel*='icon']");
    if (hasAirPods) {
      document.title = 'With Airpods';
      favicon.href = dedent`
        data:image/svg+xml,
        <svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22>
          <text y=%22.9em%22 font-size=%2290%22>🔊</text>
        </svg>
      `;

      hadAirPodsBefore.current = true;
      setText('');
      presentAirPods();
    } else {
      document.title = 'Connect your AirPods';
      favicon.href = dedent`
        data:image/svg+xml,
        <svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22>
          <text y=%22.9em%22 font-size=%2290%22>🔇</text>
        </svg>
      `;

      if (hadAirPodsBefore.current) {
        dismissAirPods().then(() => setText('Connect your AirPods'));
      } else {
        setText('Connect your AirPods');
      }
    }
  }, [hasAirPods]);

  return (
    <Container>
      <AnimatePresence>
        <AirPods ref={canvasRef} width={1158} height={770} />
        {text && (
          <TextContainer
            key="text"
            initial={{ opacity: 0, transform: 'scale(3)' }}
            animate={{ opacity: 1, transform: 'scale(1)' }}
            exit={{ opacity: 0, transform: 'scale(0.8)' }}
          >
            <Text>{text}</Text>
          </TextContainer>
        )}
      </AnimatePresence>
      <GitHubLink
        href="https://github.com/junhoyeo/detect-airpods"
        target="_blank"
      >
        @GitHub
      </GitHubLink>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const AirPods = styled.canvas`
  width: 85%;
  max-width: 800px;
`;

const TextContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
  align-items: center;
`;
const Text = styled.h1`
  margin: 0;
  color: white;
  font-size: 2.8rem;
  text-align: center;
  word-break: keep-all;

  @media (max-width: 600px) {
    font-size: 1.8rem;
  }

  @media (max-width: 350px) {
    font-size: 1.45rem;
  }
`;

const GitHubLink = styled.a`
  position: fixed;
  bottom: 32px;
  color: rgba(255, 255, 255, 0.25);
  transition: all 0.2s ease-out;

  &:hover {
    transform: scale(1.05);
  }
`;

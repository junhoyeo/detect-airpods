import React from 'react';
import styled from 'styled-components';
import { useMediaDevices } from '../utils/useMediaDevices';

export const HomePage = () => {
  const devices = useMediaDevices();
  const airpods = devices.find((device) =>
    device.label.toLowerCase().includes('airpods'),
  );

  return (
    <Container>
      <Airpods>{airpods?.label}</Airpods>
      <br />
      {devices.map((device) => (
        <Airpods>{device.label}</Airpods>
      ))}
    </Container>
  );
};

const Container = styled.div``;
const Airpods = styled.p`
  color: white;
`;

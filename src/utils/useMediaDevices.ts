import { useEffect, useState } from 'react';

export const useMediaDevices = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const update = () =>
      navigator.mediaDevices
        .enumerateDevices() //
        .then(setDevices);

    navigator.mediaDevices
      .getUserMedia({ audio: true }) //
      .then(() => update());

    navigator.mediaDevices.addEventListener('devicechange', update);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', update);
    };
  }, []);

  return devices;
};

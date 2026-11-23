import React from 'react';
import MascotTrack from './MascotTrack';
import './MascotLoader.css';

interface MascotLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

const MascotLoader: React.FC<MascotLoaderProps> = ({
  message = 'Loading...',
  fullScreen = false,
}) => {
  return (
    <div
      className={`mascot-loader ${fullScreen ? 'mascot-loader-fullscreen' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="mascot-loader-image">
        <img
          src="/rmmlogo.png"
          alt=""
          className="mascot-loader-logo"
        />

        <MascotTrack className="mascot-loader-track" />
      </div>

      <p className="mascot-loader-message">{message}</p>
    </div>
  );
};

export default MascotLoader;
import React from 'react';

interface MascotTrackProps {
  className?: string;
}

const MascotTrack: React.FC<MascotTrackProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 1024 1024"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
  >
    <path
      d="M 209 168 L 208 321 L 212 336 L 222 353 L 239 367 L 247 371 L 262 375 L 427 375 L 492 481 L 499 489 L 503 491 L 510 492 L 517 490 L 521 487 L 589 375 L 755 375 L 769 371 L 777 367 L 789 358 L 799 346 L 807 327 L 807 168 L 804 159 L 794 142 L 778 128 L 762 121 L 751 119 L 264 119 L 248 123 L 230 134 L 217 149 Z"
      pathLength="1000"
      className="mascot-loader-track-base"
    />
    <path
      d="M 209 168 L 208 321 L 212 336 L 222 353 L 239 367 L 247 371 L 262 375 L 427 375 L 492 481 L 499 489 L 503 491 L 510 492 L 517 490 L 521 487 L 589 375 L 755 375 L 769 371 L 777 367 L 789 358 L 799 346 L 807 327 L 807 168 L 804 159 L 794 142 L 778 128 L 762 121 L 751 119 L 264 119 L 248 123 L 230 134 L 217 149 Z"
      pathLength="1000"
      className="mascot-loader-track-runner"
    />
  </svg>
);

export default MascotTrack;

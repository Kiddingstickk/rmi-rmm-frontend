// src/framer-motion.d.ts
import 'framer-motion';
import * as React from 'react';

declare module 'framer-motion' {
  interface AnimatePresenceProps {
    children?: React.ReactNode;
  }
}

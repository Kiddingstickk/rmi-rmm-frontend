
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import LiquidLoader from './LiquidLoader';

interface LoadingContextType {
  showLoader: (message?: string) => void;
  hideLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('Loading...');

  const activeCount = useRef(0);
  const visibleRef = useRef(false);
  const visibleSince = useRef(0);

  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const location = useLocation();
  const previousPath = useRef(location.pathname);

  const showLoader = useCallback((newMessage = 'Loading...') => {
    activeCount.current += 1;
    setMessage(newMessage);

    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }

    if (activeCount.current === 1 && !visibleRef.current) {
      showTimer.current = setTimeout(() => {
        if (activeCount.current > 0) {
          visibleRef.current = true;
          setVisible(true);
          visibleSince.current = Date.now();
        }

        showTimer.current = null;
      }, 20);
    }
  }, []);

  const hideLoader = useCallback(() => {
    activeCount.current = Math.max(0, activeCount.current - 1);

    if (activeCount.current > 0) return;

    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }

    if (!visibleRef.current) return;

    const elapsed = Date.now() - visibleSince.current;
    const remaining = Math.max(0, 400 - elapsed);

    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }

    hideTimer.current = setTimeout(() => {
      if (activeCount.current === 0) {
        visibleRef.current = false;
        setVisible(false);
      }

      hideTimer.current = null;
    }, remaining);
  }, []);

  // Automatic loader for major page navigation.
  useEffect(() => {
    if (previousPath.current === location.pathname) return;

    previousPath.current = location.pathname;

    // Release any previous unfinished route transition.
    if (routeTimer.current) {
      clearTimeout(routeTimer.current);
      routeTimer.current = null;
      hideLoader();
    }

    showLoader('Loading page...');

    routeTimer.current = setTimeout(() => {
      routeTimer.current = null;
      hideLoader();
    }, 500);
  }, [location.pathname, showLoader, hideLoader]);

  // Clean up when the provider unmounts.
  useEffect(() => {
    return () => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);

      if (routeTimer.current) {
        clearTimeout(routeTimer.current);
        hideLoader();
      }
    };
  }, [hideLoader]);

  const value = useMemo(
    () => ({ showLoader, hideLoader }),
    [showLoader, hideLoader]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}

      {visible && (
        <LiquidLoader message={message} fullScreen />
      )}
    </LoadingContext.Provider>
  );
};

export const useGlobalLoader = (): LoadingContextType => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error(
      'useGlobalLoader must be used inside LoadingProvider'
    );
  }

  return context;
};

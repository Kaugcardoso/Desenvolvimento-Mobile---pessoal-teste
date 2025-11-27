import { useEffect, useState } from 'react';
import { isOfflineMode, subscribeOfflineMode } from '../services/api';

const useOfflineMode = () => {
  const [offline, setOffline] = useState(isOfflineMode());

  useEffect(() => {
    const unsubscribe = subscribeOfflineMode(setOffline);
    return unsubscribe;
  }, []);

  return offline;
};

export default useOfflineMode;


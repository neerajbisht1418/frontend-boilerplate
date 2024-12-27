import { useState, useCallback } from 'react';

export const useLoadingState = () => {
  const [loading, setLoading] = useState({ isLoading: false, operation: null });

  const startLoading = useCallback((operation) => {
    console.log(`Starting operation: ${operation}`);
    setLoading({ isLoading: true, operation });
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(prev => {
      console.log(`Completed operation: ${prev.operation}`);
      return { isLoading: false, operation: null };
    });
  }, []);

  return { loading, startLoading, stopLoading };
};

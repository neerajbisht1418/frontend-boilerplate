import { useState, useCallback } from 'react';
import { ERROR_MESSAGES } from '../constants/errors';

export const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((code, originalError = null) => {
    console.error('Error occurred:', {
      code,
      message: ERROR_MESSAGES[code],
      originalError,
      timestamp: new Date().toISOString(),
    });

    setError({
      message: ERROR_MESSAGES[code],
      code,
      timestamp: Date.now(),
    });

    // Clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  }, []);

  return { error, handleError };
};
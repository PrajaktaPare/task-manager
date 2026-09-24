import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/uiSlice';

export default function useToast() {
  const dispatch = useDispatch();

  return useMemo(
    () => ({
      success: (message) => dispatch(showToast(message, 'success')),
      error: (message) => dispatch(showToast(message, 'error')),
      info: (message) => dispatch(showToast(message, 'info')),
    }),
    [dispatch]
  );
}

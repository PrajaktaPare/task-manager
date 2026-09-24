import { useContext } from 'react';
import { ThemeContext } from '../store/ThemeContext';

export default function useTheme() {
  return useContext(ThemeContext);
}

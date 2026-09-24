import { createSlice } from '@reduxjs/toolkit';

// toast notifications live here so any component can trigger one
let nextId = 1;

const uiSlice = createSlice({
  name: 'ui',
  initialState: { toasts: [] },
  reducers: {
    showToast: {
      reducer(state, { payload }) {
        state.toasts.push(payload);
      },
      prepare(message, type = 'success') {
        return { payload: { id: nextId++, message, type } };
      },
    },
    dismissToast(state, { payload }) {
      state.toasts = state.toasts.filter((t) => t.id !== payload);
    },
  },
});

export const { showToast, dismissToast } = uiSlice.actions;
export default uiSlice.reducer;

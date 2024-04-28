// slices/formSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  editIndex: null,
  newEntry: {
    Key: '',
    Trading_Symbol: '',
    Stock_Name: '',
    Expiry_Year: '',
    Expiry_Month: '',
    Strike_Price: '',
    Options: '',
    Target: '',
    Stop_Loss: '',
    Status: '',
  },
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setEditIndex(state, action) {
      state.editIndex = action.payload;
    },
    updateNewEntry(state, action) {
      state.newEntry = action.payload;
    },
    resetNewEntry(state) {
      state.newEntry = initialState.newEntry;
    },
  },
});

export const { setEditIndex, updateNewEntry, resetNewEntry } = formSlice.actions;

export default formSlice.reducer;
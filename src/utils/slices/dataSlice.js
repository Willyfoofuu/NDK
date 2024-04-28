// slices/dataSlice.js
import { createSlice } from '@reduxjs/toolkit';
import api from '../../utils/api'; // Corrected import path

const initialState = {
  data: [],
  stockNames: [],
  months: [],
  isFetching: false,
  error: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    fetchDataRequest(state) {
      state.isFetching = true;
      state.error = null;
    },
    fetchDataSuccess(state, action) {
      state.isFetching = false;
      state.data = action.payload.data;
      state.stockNames = action.payload.stockNames;
      state.months = action.payload.months;
    },
    fetchDataFailure(state, action) {
      state.isFetching = false;
      state.error = action.payload.error;
    },
  },
});

export const { fetchDataRequest, fetchDataSuccess, fetchDataFailure } = dataSlice.actions;

export const fetchData = () => async (dispatch) => {
  dispatch(fetchDataRequest());
  try {
    const dataResponse = await api.get('/data/get');
    const stockNamesResponse = await api.get('/stock-names');
    const monthsResponse = await api.get('/months');
    dispatch(fetchDataSuccess({ data: dataResponse.data, stockNames: stockNamesResponse.data, months: monthsResponse.data }));
  } catch (error) {
    dispatch(fetchDataFailure(error));
  }
};

export default dataSlice.reducer;
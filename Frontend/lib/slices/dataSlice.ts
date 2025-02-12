import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface DataState {
  alerts: any[]
  reportedCases: any[]
  missingCases: any[]
}

const initialState: DataState = {
  alerts: [],
  reportedCases: [],
  missingCases: [],
}

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setAlerts: (state, action: PayloadAction<any[]>) => {
      state.alerts = action.payload
    },
    setReportedCases: (state, action: PayloadAction<any[]>) => {
      state.reportedCases = action.payload
    },
    setMissingCases: (state, action: PayloadAction<any[]>) => {
      state.missingCases = action.payload
    },
  },
})

export const { setAlerts, setReportedCases, setMissingCases } = dataSlice.actions
export default dataSlice.reducer


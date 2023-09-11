import { createSlice } from '@reduxjs/toolkit';
import { Database } from '@/types_db';
type BotDetail = Database['public']['Tables']['bots']['Row'];

interface BotState {
  curruentBotId: string | undefined;
  curruentBot: BotDetail | undefined;
}

const initialState: BotState = {
  curruentBotId: undefined,
  curruentBot: undefined
};

export const botSlice = createSlice({
  name: 'bot',
  initialState,
  reducers: {
    setCurrentBotId: (state, action) => {
      state.curruentBotId = action.payload;
    },
    setcurruentBot: (state, action) => {
      state.curruentBot = action.payload;
    },
  },
});

// Export actions to use them in components
export const { setCurrentBotId, setcurruentBot } = botSlice.actions;

export default botSlice.reducer;

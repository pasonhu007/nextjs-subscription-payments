import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const getCurrentBotId = () => useSelector((state: RootState) => state.bot.curruentBotId);
export const getCurrentBot = () => useSelector((state: RootState) => state.bot.curruentBot);
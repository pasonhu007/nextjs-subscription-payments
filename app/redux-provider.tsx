'use client'
 
import { Provider } from 'react-redux';
import { store } from '@/app/redux/store';

interface Props {
    children: any;
}

export function ReduxProvider({ children }: Props) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}
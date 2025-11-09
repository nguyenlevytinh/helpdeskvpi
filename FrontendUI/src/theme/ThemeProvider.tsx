import { createContext, useContext, useReducer} from 'react';
import type { FC, PropsWithChildren } from 'react';

type ThemeState = {
  openSidePad: boolean;
};

type ThemeAction =
  | { type: 'TOGGLE_SIDEPAD'; payload?: boolean }
  | { type: 'SET_SIDEPAD'; payload: boolean };

const initialState: ThemeState = {
  openSidePad: true,
};

function reducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'TOGGLE_SIDEPAD':
      return { ...state, openSidePad: !state.openSidePad };
    case 'SET_SIDEPAD':
      return { ...state, openSidePad: action.payload };
    default:
      return state;
  }
}

const ThemeContext = createContext({
  state: initialState,
  setOpenSidePad: (value: boolean) => {},
  toggleSidePad: () => {},
});

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setOpenSidePad = (value: boolean) =>
    dispatch({ type: 'SET_SIDEPAD', payload: value });
  const toggleSidePad = () => dispatch({ type: 'TOGGLE_SIDEPAD' });

  return (
    <ThemeContext.Provider value={{ state, setOpenSidePad, toggleSidePad }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);

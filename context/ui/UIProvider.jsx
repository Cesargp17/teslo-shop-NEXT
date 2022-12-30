import React, { useReducer } from 'react'
import { UIContext } from './UIContext'
import { uiReducer } from './uiReducer'

const initialState = {
    isMenuOpen: false,
}

export const UIProvider = ({ children }) => {

    const [state, dispatch] = useReducer(uiReducer, initialState);

    const toggleSideMenu = () => {
        dispatch({ type: '[UI] - ToggleMenu' });
    }

  return (
    <UIContext.Provider value={{ 
        ...state,
        toggleSideMenu,
     }}>
        { children }
    </UIContext.Provider>
  )
}

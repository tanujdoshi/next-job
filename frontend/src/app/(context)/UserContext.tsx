"use client";
import React, { ReactElement, createContext, useReducer } from "react";
import { getUserDataFromLocal } from "./LocatStorageManager";

interface UserState {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  companyId?: string;
  companyName?: string;
  companyLogo?: string;
  loginType?: "seeker" | "employer";
}

type UserDispatch = React.Dispatch<Partial<UserState>>;

interface UserContextProps {
  state: UserState;
  dispatch: UserDispatch;
}
const defaultState: UserState = {
  firstName: "",
  lastName: "",
  email: "",
  id: "",
};

const defaultDispatch: UserDispatch = () => undefined;

const defaultUserContext: UserContextProps = {
  state: defaultState,
  dispatch: defaultDispatch,
};

export const UserContext = createContext<UserContextProps>(defaultUserContext);

export const UserProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const initialState: UserState = { ...getUserDataFromLocal() };  

  function reducer(state: UserState, changes: Partial<UserState>): UserState {
    return { ...state, ...changes };
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

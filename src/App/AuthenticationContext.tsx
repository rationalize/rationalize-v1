import React, { createContext, useState, useContext, useReducer } from "react";
import { Credentials, App } from "realm-web";

import { User } from "../RealmApp";

type AuthenticationContext = {
  user: User | null;
  logIn: (credentials: Credentials<any>) => Promise<void>;
  logOut: () => Promise<void>;
  refreshCustomData: () => Promise<void>;
  switchUser: (user: User) => void;
};

async function throwMissingProvider(): Promise<any> {
  throw new Error("Cannot log in / out: Missing user provider");
}

const context = createContext<AuthenticationContext>({
  user: null,
  logIn: throwMissingProvider,
  logOut: throwMissingProvider,
  refreshCustomData: throwMissingProvider,
  switchUser: throwMissingProvider,
});

const { Consumer, Provider } = context;

type AuthenticationProviderProps = {
  app: App<any, any>;
  children: React.ReactNode;
};

export function AuthenticationProvider({
  app,
  children,
}: AuthenticationProviderProps) {
  // See https://stackoverflow.com/a/60820265/503899
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [user, setUser] = useState<User | null>(app.currentUser);

  async function logIn(credentials: Credentials<any>) {
    await app.logIn(credentials);
    setUser(app.currentUser);
  }

  async function logOut() {
    const { currentUser } = app;
    if (currentUser) {
      await currentUser.logOut();
      setUser(app.currentUser);
    } else {
      throw new Error("No user to log out");
    }
  }

  function switchUser(user: User) {
    app.switchUser(user);
    setUser(app.currentUser);
  }

  async function refreshCustomData() {
    const { currentUser } = app;
    if (currentUser) {
      await currentUser.refreshCustomData();
      forceUpdate();
    } else {
      throw new Error("No user to log out");
    }
  }

  return (
    <Provider
      value={{ user, logIn, logOut, switchUser, refreshCustomData }}
      children={children}
    />
  );
}

export { Consumer as AuthenticationConsumer };

export function useAuthentication() {
  return useContext(context);
}

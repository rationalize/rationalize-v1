import React, { createContext, useState, useContext, useReducer } from "react";
import { User, Credentials, App } from "realm-web";

type AuthenticationContext = {
  user: User<any, any> | null;
  logIn: (credentials: Credentials<any>) => Promise<void>;
  logOut: () => Promise<void>;
  refreshCustomData: () => Promise<void>;
};

async function throwMissingProvider(): Promise<any> {
  throw new Error("Cannot log in / out: Missing user provider");
}

const context = createContext<AuthenticationContext>({
  user: null,
  logIn: throwMissingProvider,
  logOut: throwMissingProvider,
  refreshCustomData: throwMissingProvider,
});

const { Consumer, Provider } = context;

type AuthenticationProviderProps<
  FunctionsFactoryType extends object,
  CustomDataType extends object
> = {
  app: App<FunctionsFactoryType, CustomDataType>;
  children: React.ReactNode;
};

export function AuthenticationProvider<
  FunctionsFactoryType extends object = Realm.DefaultFunctionsFactory,
  CustomDataType extends object = any
>({
  app,
  children,
}: AuthenticationProviderProps<FunctionsFactoryType, CustomDataType>) {
  // See https://stackoverflow.com/a/60820265/503899
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [user, setUser] = useState<User<
    FunctionsFactoryType,
    CustomDataType
  > | null>(app.currentUser);

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
      value={{ user, logIn, logOut, refreshCustomData }}
      children={children}
    />
  );
}

export { Consumer as AuthenticationConsumer };

export function useAuthentication() {
  return useContext(context);
}

import React, {
  createContext,
  useState,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from "react";
import { Credentials, App } from "realm-web";

import { User, EnhancedUser, enhanceUser } from "mongodb-realm";

type AuthenticationContext = {
  user: EnhancedUser | null;
  logIn: (credentials: Credentials<any>) => Promise<User>;
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
    gtag("event", "login", { method: credentials.providerType });
    return app.currentUser as User;
  }

  async function logOut() {
    const { currentUser } = app;
    if (currentUser) {
      gtag("event", "logout");
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

  useEffect(() => {
    if (typeof gtag === "function") {
      // Start sending the user ID to Google Analytics
      gtag("set", { user_id: user ? user.id : undefined });
    }
  }, [user]);

  async function refreshCustomData() {
    const { currentUser } = app;
    if (currentUser) {
      await currentUser.refreshCustomData();
      forceUpdate();
    } else {
      throw new Error("No user to log out");
    }
  }

  const enhancedUser = useMemo(() => {
    return user ? enhanceUser(user) : null;
  }, [user]);

  return (
    <Provider
      value={{
        user: enhancedUser,
        logIn,
        logOut,
        switchUser,
        refreshCustomData,
      }}
      children={children}
    />
  );
}

export { Consumer as AuthenticationConsumer };

export function useAuthentication() {
  return useContext(context);
}

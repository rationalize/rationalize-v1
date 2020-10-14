import React, { createContext, useContext } from "react";

import { User } from "mongodb-realm";
import { useAuthentication } from "./AuthenticationContext";

const UserContext = createContext<User | null>(null);

const { Consumer, Provider } = UserContext;

type UserProviderProps = {
  children: React.ReactNode;
  renderUnauthenticated(): JSX.Element;
};

export function UserProvider({
  children,
  renderUnauthenticated,
}: UserProviderProps) {
  const { user } = useAuthentication();
  if (user) {
    return <Provider value={user} children={children} />;
  } else {
    return renderUnauthenticated();
  }
}

export { Consumer as UserConsumer };

export function useUser(): User {
  const context = useContext(UserContext);
  if (context) {
    return context;
  } else {
    throw new Error("useUser must be used within a UserProvider");
  }
}

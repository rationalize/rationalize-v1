import React, { ReactNode } from "react";
import { Redirect } from "react-router-dom";

import { UserProvider } from "./UserContext";
import { AnonymousAuthenticator } from "./AnonymousAuthenticator";

export type RestrictedAreaProps = {
  children: ReactNode;
  authenticateAnonymously?: boolean;
};

export function RestrictedArea({
  children,
  authenticateAnonymously,
}: RestrictedAreaProps) {
  return (
    <UserProvider
      renderUnauthenticated={() =>
        authenticateAnonymously ? (
          <AnonymousAuthenticator />
        ) : (
          <Redirect to="/" />
        )
      }
      children={children}
    />
  );
}

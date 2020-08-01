import React, { ReactNode } from "react";
import { AuthenticationConsumer } from "./AuthenticationContext";
import { Redirect } from "react-router-dom";

export type RestrictedAreaProps = {
  userId?: string;
  children: ReactNode;
};

export function RestrictedArea({ userId, children }: RestrictedAreaProps) {
  return (
    <AuthenticationConsumer>
      {({ user }) =>
        user && (!userId || user.id === userId) ? children : <Redirect to="/" />
      }
    </AuthenticationConsumer>
  );
}

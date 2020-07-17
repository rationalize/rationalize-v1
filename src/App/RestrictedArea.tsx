import React, { ReactNode } from "react";
import { AuthenticationConsumer } from "./AuthenticationContext";
import { NotFound } from "./NotFound";

export type RestrictedAreaProps = {
  userId?: string;
  children: ReactNode;
};

export function RestrictedArea({ userId, children }: RestrictedAreaProps) {
  return (
    <AuthenticationConsumer>
      {({ user }) =>
        user && (!userId || user.id === userId) ? children : <NotFound />
      }
    </AuthenticationConsumer>
  );
}

import React from "react";
import classNames from "classnames";

import styles from "./PrimaryLayout.module.scss";

import { TopBar } from "./TopBar";
import { SideBar } from "./SideBar";
import { AlertContainer } from "./AlertContainer";
import { AlertProvider } from "./AlertContext";

export type PrimaryLayoutProps = {
  children: React.ReactNode;
  sidebar?: "visible" | "hidden";
};

export function PrimaryLayout({ children, sidebar }: PrimaryLayoutProps) {
  /*
  const { user } = useAuthentication();
  const visibleSidebar = sidebar
    ? sidebar === "visible"
    : !isOnlyAnonymous(user);
  */
  // Sidebar is disabled until we have an actual need for it
  const visibleSidebar = false;
  return (
    <AlertProvider>
      <div className={styles.TopAndSideBar}>
        <TopBar className={styles.TopAndSideBar__TopBar} />
        {visibleSidebar && (
          <SideBar className={styles.TopAndSideBar__SideBar} />
        )}
        <div
          className={classNames(styles.TopAndSideBar__Content, {
            [styles["TopAndSideBar__Content--full-width"]]: !visibleSidebar,
          })}
        >
          <AlertContainer />
          {children}
        </div>
      </div>
    </AlertProvider>
  );
}

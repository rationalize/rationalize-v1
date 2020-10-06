import React from "react";
import classNames from "classnames";

import styles from "./PrimaryLayout.module.scss";

import { TopBar } from "./TopBar";
import { SideBar } from "./SideBar";
import { AlertContainer } from "./AlertContainer";

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
    <div className={styles.PrimaryLayout}>
      <TopBar className={styles.PrimaryLayout__TopBar} />
      {visibleSidebar && <SideBar className={styles.PrimaryLayout__SideBar} />}
      <div
        className={classNames(styles.PrimaryLayout__Content, {
          [styles["PrimaryLayout__Content--full-width"]]: !visibleSidebar,
        })}
      >
        {children}
      </div>
      <AlertContainer className={styles.PrimaryLayout__AlertContainer} />
    </div>
  );
}

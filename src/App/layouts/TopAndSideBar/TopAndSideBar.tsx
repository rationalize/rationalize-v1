import React from "react";

import styles from "./TopAndSideBar.module.scss";
import { TopBar } from "./TopBar";
import { SideBar } from "./SideBar";

export type TopAndSideBarProps = {
  children: React.ReactNode;
};

export function TopAndSideBar({ children }: TopAndSideBarProps) {
  return (
    <div className={styles.TopAndSideBar}>
      <TopBar className={styles.TopAndSideBar__TopBar} />
      <SideBar className={styles.TopAndSideBar__SideBar} />
      <div className={styles.TopAndSideBar__Content}>{children}</div>
    </div>
  );
}

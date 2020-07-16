import React from "react";
import classNames from "classnames";

import styles from "./PrimaryLayout.module.scss";

import { TopBar } from "./TopBar";
import { SideBar } from "./SideBar";

export type PrimaryLayoutProps = {
  children: React.ReactNode;
  sidebar?: "visible" | "hidden";
};

export function PrimaryLayout({
  children,
  sidebar = "visible",
}: PrimaryLayoutProps) {
  return (
    <div className={styles.TopAndSideBar}>
      <TopBar className={styles.TopAndSideBar__TopBar} />
      {sidebar === "visible" && (
        <SideBar className={styles.TopAndSideBar__SideBar} />
      )}
      <div
        className={classNames(styles.TopAndSideBar__Content, {
          [styles["TopAndSideBar__Content--full-width"]]: sidebar === "hidden",
        })}
      >
        {children}
      </div>
    </div>
  );
}

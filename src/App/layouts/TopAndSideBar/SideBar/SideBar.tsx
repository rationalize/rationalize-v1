import classNames from "classnames";
import React from "react";

import styles from "./SideBar.module.scss";
import { SideBarItem } from "./SideBarItem";

type SideBarProps = { className?: string };

export function SideBar({ className }: SideBarProps) {
  return (
    <div className={classNames(styles.SideBar, className)}>
      <nav className={styles.SideBar__Navigation}>
        <SideBarItem to="/alternatives" icon="List">
          Alternatives
        </SideBarItem>
        <SideBarItem to="/events" icon="Calendar">
          Events
        </SideBarItem>
      </nav>
    </div>
  );
}

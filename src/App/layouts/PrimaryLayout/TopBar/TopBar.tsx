import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

import { Brand } from "../../../Brand";
import { AccountMenu } from "./AccountMenu";

import styles from "./TopBar.module.scss";

type TopBarProps = { className?: string };

export function TopBar({ className }: TopBarProps) {
  return (
    <div className={classNames(styles.TopBar, className)}>
      <Link to="/" className={styles.TopBar__Brand}>
        <Brand />
      </Link>
      <AccountMenu />
    </div>
  );
}

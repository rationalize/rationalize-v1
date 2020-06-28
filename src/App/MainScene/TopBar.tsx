import React from "react";
import { Container } from "reactstrap";
import classNames from "classnames";

import { Brand } from "./Brand";
import { AccountMenu } from "./AccountMenu";

import styles from "./TopBar.module.scss";

type TopBarProps = { className?: string };

export function TopBar({ className }: TopBarProps) {
  return (
    <div className={classNames(styles.TopBar, className)}>
      <Container className={styles.TopBar__Container}>
        <Brand />
        <AccountMenu />
      </Container>
    </div>
  );
}

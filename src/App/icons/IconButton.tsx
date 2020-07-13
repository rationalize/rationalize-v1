import classNames from "classnames";
import React from "react";
import { IconName, Icon } from "./Icon";
import { ButtonProps, Button } from "reactstrap";

import styles from "./IconButton.module.scss";

export type IconButtonProps = { icon: IconName } & ButtonProps;

export function IconButton({
  icon,
  children,
  className,
  ...rest
}: IconButtonProps) {
  return (
    <Button {...rest} className={classNames(styles.IconButton, className)}>
      <span className={styles.IconButton__Span}>
        <Icon name={icon} size="16" className={styles.IconButton__Icon} />
        {children}
      </span>
    </Button>
  );
}

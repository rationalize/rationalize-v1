import classNames from "classnames";
import React from "react";
import { IconName, Icon, IconProps } from "./Icon";

import styles from "./ButtonIcon.module.scss";

export type ButtonIconProps = { icon: IconName } & Omit<IconProps, "name">;

export function ButtonIcon({ icon, className, ...rest }: ButtonIconProps) {
  return (
    <Icon
      {...rest}
      name={icon}
      size="16"
      className={classNames(styles.IconButton__Icon, className)}
    />
  );
}

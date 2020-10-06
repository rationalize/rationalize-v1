import classNames from "classnames";
import React from "react";
import { NavLink, LinkProps } from "react-router-dom";
import { LocationState } from "history";

import { Icon, IconName } from "icons/Icon";

import styles from "./SideBarItem.module.scss";

export interface SideBarItemProps<S>
  extends React.PropsWithoutRef<LinkProps<S>> {
  icon?: IconName;
  disabled?: boolean;
}

export function SideBarItem<S = LocationState>({
  className,
  children,
  icon,
  disabled,
  ...rest
}: SideBarItemProps<S>) {
  return (
    <NavLink
      {...rest}
      className={classNames(styles.SideBarItem, className, {
        [styles["SideBarItem--disabled"]]: disabled,
      })}
      activeClassName={styles["SideBarItem--active"]}
    >
      {icon ? (
        <Icon name={icon} size="1rem" className={styles.SideBarItem__Icon} />
      ) : null}
      <>{children}</>
    </NavLink>
  );
}

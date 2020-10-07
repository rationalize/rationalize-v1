import React from "react";
import { Link, LinkProps } from "react-router-dom";
import classNames from "classnames";
import { DropdownItem } from "reactstrap";

import styles from "./DropdownLink.module.scss";

export type DropdownLinkProps = LinkProps;

export function DropdownLink({
  className,
  children,
  ...rest
}: DropdownLinkProps) {
  return (
    <Link className={classNames(styles.DropdownLink, className)} {...rest}>
      <DropdownItem>{children}</DropdownItem>
    </Link>
  );
}

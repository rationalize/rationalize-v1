import classNames from "classnames";
import React from "react";

import styles from "./Brand.module.scss";

type BrandProps = { className?: string; color?: "dark" | "light" };

export function Brand({ color = "dark", className }: BrandProps) {
  return (
    <span
      className={classNames(styles.Brand, styles[`Brand--${color}`], className)}
    >
      rationalize
    </span>
  );
}

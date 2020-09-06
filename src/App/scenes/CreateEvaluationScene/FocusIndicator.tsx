import React from "react";
import classNames from "classnames";

import styles from "./FocusIndicator.module.scss";
import { ChevronLeft } from "react-feather";

export type FocusIndicatorProps = {
  className?: string;
  offset?: number;
};

export function FocusIndicator({ className, offset }: FocusIndicatorProps) {
  const correctedOffset = offset && offset - 10;
  return (
    <div className={classNames(className, styles.FocusIndicator)}>
      <div
        className={styles.FocusIndicator__Before}
        style={{ flexBasis: correctedOffset }}
      />
      <ChevronLeft
        className={styles.FocusIndicator__Icon}
        style={{
          display: typeof offset === "number" ? "block" : "none",
        }}
      />
      <div className={styles.FocusIndicator__After} />
    </div>
  );
}

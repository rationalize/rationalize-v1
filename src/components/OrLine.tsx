import React from "react";

import styles from "./OrLine.module.scss";

export function OrLine() {
  return (
    <div className={styles.OrLine}>
      <span className={styles.OrLine__Line} />
      <span className={styles.OrLine__Text}> or </span>
      <span className={styles.OrLine__Line} />
    </div>
  );
}

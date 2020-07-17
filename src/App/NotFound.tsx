import React from "react";

import styles from "./NotFound.module.scss";

export function NotFound() {
  return (
    <section className={styles.NotFound}>
      <span
        className={styles.NotFound__Emoji}
        role="img"
        aria-label="Man shugging"
      >
        🤷
      </span>
      <h2>Page Not Found</h2>
    </section>
  );
}

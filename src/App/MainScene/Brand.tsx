import React from "react";
import { Link } from "react-router-dom";

import styles from "./Brand.module.scss";

export function Brand() {
  return (
    <Link to="/" className={styles.Brand}>
      rationalize
    </Link>
  );
}

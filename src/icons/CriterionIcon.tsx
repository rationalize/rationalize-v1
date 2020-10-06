import React from "react";
import { CheckCircle, Props as IconProps } from "react-feather";

import styles from "./CriterionIcon.module.scss";

export function CriterionIcon(props: IconProps) {
  return (
    <CheckCircle className={styles.CriterionIcon} size="1.2em" {...props} />
  );
}

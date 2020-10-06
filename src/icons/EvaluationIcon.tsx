import React from "react";
import { Sliders, Props as IconProps } from "react-feather";

import styles from "./EvaluationIcon.module.scss";

export function EvaluationIcon(props: IconProps) {
  return <Sliders className={styles.EvaluationIcon} size="1.2em" {...props} />;
}

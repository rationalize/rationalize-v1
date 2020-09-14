import React from "react";
import { Box, Props as IconProps } from "react-feather";

import styles from "./ConceptIcon.module.scss";

export function ConceptIcon(props: IconProps) {
  return <Box className={styles.ConceptIcon} size="1.2em" {...props} />;
}

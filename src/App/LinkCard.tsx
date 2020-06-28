import React from "react";
import classNames from "classnames";
import { Card, CardProps } from "reactstrap";
import { useHistory } from "react-router-dom";

import styles from "./LinkCard.module.scss";

type LinkCardProps = {
  to: string;
} & CardProps;

export function LinkCard(props: LinkCardProps) {
  const history = useHistory();
  return (
    <Card
      {...props}
      className={classNames(styles.LinkCard, props.className)}
      onClick={() => history.push(props.to)}
    />
  );
}

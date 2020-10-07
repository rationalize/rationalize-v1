import React from "react";
import { Container, Card, CardProps } from "reactstrap";

import { Brand } from "components/Brand";

import styles from "./CenteredCard.module.scss";

export type CenteredCardProps = CardProps;

export function CenteredCard(props: CenteredCardProps) {
  return (
    <Container className={styles.CenteredCard}>
      <Brand className={styles.CenteredCard__Brand} />
      <Card className={styles.CenteredCard__Card} {...props} />
    </Container>
  );
}

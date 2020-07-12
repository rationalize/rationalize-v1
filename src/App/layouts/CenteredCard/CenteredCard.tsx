import React from "react";
import { Container, Card } from "reactstrap";
import { Brand } from "../../Brand";

import styles from "./CenteredCard.module.scss";

export type CenteredCardProps = { children: React.ReactNode };

export function CenteredCard({ children }: CenteredCardProps) {
  return (
    <Container className={styles.CenteredCard}>
      <Brand className={styles.CenteredCard__Brand} />
      <Card className={styles.CenteredCard__Card}>{children}</Card>
    </Container>
  );
}

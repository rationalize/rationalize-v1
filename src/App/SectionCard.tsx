import React, { ReactNode } from "react";
import { CardProps, Card, CardHeader } from "reactstrap";

import styles from "./SectionCard.module.scss";

export type SectionCardHeaderProps = { children: ReactNode };

export function Header({ children }: SectionCardHeaderProps) {
  return (
    <CardHeader className={styles.SectionCard__Header}>
      <h6 className={styles.SectionCard__Heading}>{children}</h6>
    </CardHeader>
  );
}

export type SectionCardProps = CardProps;

export function SectionCard(props: SectionCardProps) {
  return (
    <section className={styles.SectionCard}>
      <Card {...props} />
    </section>
  );
}

SectionCard.Header = Header;

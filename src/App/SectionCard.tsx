import React, { ReactNode } from "react";
import { CardProps, Card } from "reactstrap";

import styles from "./SectionCard.module.scss";

export type SectionCardHeaderProps = { children: ReactNode };

export function Header({ children }: SectionCardHeaderProps) {
  return <h6>{children}</h6>;
}

export type SectionCardProps = CardProps;

export function SectionCard({ children, ...props }: SectionCardProps) {
  const header = Array.isArray(children)
    ? children.find((c: any) => c.type === Header)
    : null;
  const restOfChildren = Array.isArray(children)
    ? children.filter((c) => c !== header)
    : children;
  return (
    <section className={styles.SectionCard}>
      {header}
      <Card {...props} children={restOfChildren} />
    </section>
  );
}

SectionCard.Header = Header;

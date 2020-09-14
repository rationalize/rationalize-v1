import classNames from "classnames";
import React, { ReactNode } from "react";
import { CardProps, Card, CardHeader } from "reactstrap";

import styles from "./SectionCard.module.scss";

export type SectionCardHeaderProps = {
  className?: string;
  children: ReactNode;
};

export function Header({ className, children }: SectionCardHeaderProps) {
  return (
    <CardHeader className={classNames(styles.SectionCard__Header, className)}>
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

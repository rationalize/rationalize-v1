import React from "react";
import { CardBody } from "reactstrap";
import { Link } from "react-feather";

import { Details } from "../mongodb";

import styles from "./DetailsCardBody.module.scss";

export type DetailsCardBodyProps = Details;

export function DetailsCardBody({ description, links }: DetailsCardBodyProps) {
  return description || links.length > 0 ? (
    <CardBody>
      {description && (
        <section className={styles.DetailsCardBody__Description}>
          {description}
        </section>
      )}
      {links.length > 0 && (
        <ul className={styles.DetailsCardBody__List}>
          {links.map(({ url, title }, index) => (
            <li className={styles.DetailsCardBody__ListItem} key={index}>
              <Link
                className={styles.DetailsCardBody__ListItemIcon}
                size="1em"
              />
              <a
                href={url}
                title={title}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title || url}
              </a>
            </li>
          ))}
        </ul>
      )}
    </CardBody>
  ) : null;
}

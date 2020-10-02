import React from "react";
import { Link } from "react-feather";

import { Details as DetailsValues } from "../mongodb";
import styles from "./Details.module.scss";

export type DetailsProps = DetailsValues;

export function Details({ description, links, files }: DetailsProps) {
  console.log("Details", files);
  return (
    <>
      {description && (
        <section className={styles.Details__Description}>{description}</section>
      )}
      {links.length > 0 && (
        <ul className={styles.Details__List}>
          {links.map(({ url, title }, index) => (
            <li className={styles.Details__ListItem} key={index}>
              <Link className={styles.Details__ListItemIcon} size="1em" />
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
      {files.length > 0 && (
        <ul className={styles.Details__List}>
          {files.map(({ url, filename }, index) => (
            <li className={styles.Details__ListItem} key={index}>
              <Link className={styles.Details__ListItemIcon} size="1em" />
              <a href={url} target="_blank" rel="noopener noreferrer">
                {filename}
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

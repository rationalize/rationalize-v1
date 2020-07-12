import React from "react";
import { CardText, CardBody } from "reactstrap";

import { LinkCard } from "../../LinkCard";
import { Event } from "../../../RealmApp";

import styles from "./EventCard.module.scss";

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <LinkCard
      to={`/events/${event._id.toHexString()}`}
      className={styles.EventCard}
    >
      <CardBody>
        <CardText>{event.name}</CardText>
      </CardBody>
    </LinkCard>
  );
}

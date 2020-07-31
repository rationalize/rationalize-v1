import { useState, useEffect } from "react";

import { eventsCollection, Event } from "./Events";
import { ObjectId } from "bson";

export type EventFinderState = {
  event: Event | null;
  isLoading: boolean;
};

export type EventFinderProps = {
  id: string | undefined;
  children: (state: EventFinderState) => JSX.Element;
};

export function EventFinder({ id, children }: EventFinderProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      eventsCollection
        .findOne({
          _id: { $eq: ObjectId.createFromHexString(id) },
        })
        .then(setEvent)
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setEvent(null);
    }
  }, [id]);

  return children({ event, isLoading });
}

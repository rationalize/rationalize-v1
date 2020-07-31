import React from "react";
import { useParams } from "react-router-dom";

import { Event, EventFinder } from "../mongodb";
import { LoadingOverlay } from "./LoadingOverlay";
import { NotFound } from "./NotFound";

export type EventLoaderProps =
  | {
      component: React.ComponentType<{ event: Event }>;
      children?: undefined;
    }
  | {
      component?: undefined;
      children: (props: { event: Event }) => JSX.Element;
    };

export function EventLoader({ component, children }: EventLoaderProps) {
  const params = useParams<{ id?: string }>();
  const eventId = params.id;
  return (
    <EventFinder id={eventId}>
      {({ event, isLoading }) => (
        <LoadingOverlay isLoading={isLoading}>
          {event && component && React.createElement(component, { event })}
          {event && children && children({ event })}
          {!event && !isLoading && <NotFound />}
        </LoadingOverlay>
      )}
    </EventFinder>
  );
}

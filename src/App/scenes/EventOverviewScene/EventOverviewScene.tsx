import React from "react";

import { EventOverview } from "./EventOverview";
import { PrimaryLayout } from "../../layouts/PrimaryLayout";
import { EventLoader } from "../../EventLoader";
import { RestrictedArea } from "../../RestrictedArea";

export function EventOverviewScene() {
  return (
    <PrimaryLayout>
      <RestrictedArea>
        <EventLoader component={EventOverview} />
      </RestrictedArea>
    </PrimaryLayout>
  );
}

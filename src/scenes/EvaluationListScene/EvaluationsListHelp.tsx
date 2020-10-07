import React from "react";

import { HelpPopover } from "components/HelpPopover";

export function EvaluationsListHelp() {
  return (
    <HelpPopover>
      These are your evaluations. Select one of them to take an in-depth look at
      the final results, adjust concept scores or criteria weights.
    </HelpPopover>
  );
}

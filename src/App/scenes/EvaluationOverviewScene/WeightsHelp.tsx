import React from "react";
import { HelpPopover } from "../../HelpPopover";

export function WeightsHelp() {
  return (
    <HelpPopover>
      By setting Criteria Weights, you are defining the relative importance of
      each individual Criteria. If you think that each Criteria is equally
      important, just leave the dials where they are at. However, if some of the
      criteria is more important than others, adjust the dials accordingly.
    </HelpPopover>
  );
}

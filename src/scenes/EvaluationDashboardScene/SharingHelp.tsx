import React from "react";

import { HelpPopover } from "components/HelpPopover";

export function PrivacyHelp() {
  return (
    <HelpPopover>
      Others will not be able to adjust Concept Scores or Criteria Weights for
      your evaluation. They will, however, be able to clone this evaluation into
      their account and adjust scores for that event.
    </HelpPopover>
  );
}

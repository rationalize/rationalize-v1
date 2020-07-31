import React from "react";
import { HelpPopover } from "../../HelpPopover";

export function SharingModeHelp() {
  return (
    <HelpPopover>
      Scoring mode simply allows you to decide how you want to score the
      concepts against the criteria. If you want to do the scoring yourself,
      select “Individual”; if you would like to poll others select “Survey”; If
      you would like to do both, check both of the checkmarks.
    </HelpPopover>
  );
}

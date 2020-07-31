import React from "react";
import { HelpPopover } from "../../HelpPopover";

export function EvaluationHelp() {
  return (
    <HelpPopover>
      Evaluation Events are used to evaluate and rank concepts against a set of
      criteria. At this point, all you must do is to define a set of criteria
      which you are going to use in order to prioritize alternative concepts. In
      the subsequent steps you will be able to rank each alternative concept
      against your chosen criteria and even adjust the weights of your criteria.
    </HelpPopover>
  );
}

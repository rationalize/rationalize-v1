import React from "react";
import { FormGroup, Label } from "reactstrap";

import { CopyToClipboardInput } from "./CopyToClipboardInput";
import { Evaluation } from "../mongodb";

export type EvaluationSurveyUrlProps = { evaluation: Evaluation };

export function EvaluationSurveyUrl({ evaluation }: EvaluationSurveyUrlProps) {
  if (evaluation.scoring.survey) {
    const evaluationUrl =
      global.location.origin + `/evaluations/${evaluation._id.toHexString()}`;
    const scoreUrl = `${evaluationUrl}/score/${evaluation.scoring.token}`;
    return (
      <FormGroup>
        <Label for="evaluation-link">
          Send this link to invite participants:
        </Label>
        <CopyToClipboardInput id="evaluation-link" text={scoreUrl} />
      </FormGroup>
    );
  } else {
    return (
      <FormGroup>
        <em>Scoring via survey is disabled for this evaluation.</em>
      </FormGroup>
    );
  }
}

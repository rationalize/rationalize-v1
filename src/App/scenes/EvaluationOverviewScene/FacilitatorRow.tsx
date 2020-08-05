import React from "react";
import { Row, Col, FormGroup, CardText } from "reactstrap";

import { EvaluationSurveyUrl } from "../../EvaluationSurveyUrl";
import { Evaluation } from "../../../mongodb";
import { LinkButton } from "../../LinkButton";
import { EvaluationSharingForm } from "./EvaluationSharingForm";
import { SectionCard } from "../../SectionCard";

export type FacilitatorRowProps = { evaluation: Evaluation };

export function FacilitatorRow({ evaluation }: FacilitatorRowProps) {
  return (
    <Row>
      <Col sm="12" md="6">
        <SectionCard body>
          <SectionCard.Header>Scoring</SectionCard.Header>
          <h6>Invite participants to the survey</h6>
          <EvaluationSurveyUrl evaluation={evaluation} />
          <p>
            {Object.keys(evaluation.scores).length} participants have completed
            the survey.
          </p>
          <h6>Score the concepts yourself</h6>
          {evaluation.scoring.facilitator ? (
            <LinkButton
              to={`/evaluations/${evaluation._id.toHexString()}/score`}
              color="primary"
              outline
              block
            >
              Adjust your scores
            </LinkButton>
          ) : (
            <FormGroup>
              <em>
                Providing scores yourself is disabled for this evaluation.
              </em>
            </FormGroup>
          )}
        </SectionCard>
      </Col>
      <Col sm="12" md="6">
        <SectionCard body>
          <SectionCard.Header>Sharing</SectionCard.Header>
          <CardText>
            You can share the result of the evaluation with others.
          </CardText>
          <EvaluationSharingForm evaluation={evaluation} />
        </SectionCard>
      </Col>
    </Row>
  );
}

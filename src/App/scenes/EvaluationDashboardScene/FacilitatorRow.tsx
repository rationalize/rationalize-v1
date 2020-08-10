import React from "react";
import { Row, Col, CardText, CardBody } from "reactstrap";

import { EvaluationSurveyUrl } from "../../EvaluationSurveyUrl";
import { Evaluation } from "../../../mongodb";
import { LinkButton } from "../../LinkButton";
import { EvaluationSharingForm } from "./EvaluationSharingForm";
import { SectionCard } from "../../SectionCard";
import { SharingHelp } from "./SharingHelp";

export type FacilitatorRowProps = { evaluation: Evaluation };

export function FacilitatorRow({ evaluation }: FacilitatorRowProps) {
  const participantAcceptedCount = evaluation.participants.length;
  const participantCompletedCount = Object.keys(evaluation.scores).filter(
    (id) => id !== evaluation.facilitator
  ).length;
  return (
    <Row>
      <Col sm="12" md="6">
        {evaluation.scoring.facilitator && (
          <SectionCard>
            <SectionCard.Header>Score yourself</SectionCard.Header>
            <CardBody>
              <LinkButton
                to={`/evaluations/${evaluation._id.toHexString()}/score`}
                color="primary"
                outline
                block
              >
                Adjust your scores
              </LinkButton>
            </CardBody>
          </SectionCard>
        )}
        {evaluation.scoring.survey && (
          <SectionCard>
            <SectionCard.Header>Scoring survey</SectionCard.Header>
            <CardBody>
              <EvaluationSurveyUrl evaluation={evaluation} />
              <CardText>
                {participantAcceptedCount} participant(s) accepted the
                invitation and {participantCompletedCount} participant(s) have
                completed the survey.
              </CardText>
            </CardBody>
          </SectionCard>
        )}
      </Col>
      <Col sm="12" md="6">
        <SectionCard>
          <SectionCard.Header>
            Sharing <SharingHelp />
          </SectionCard.Header>
          <CardBody>
            <EvaluationSharingForm evaluation={evaluation} />
          </CardBody>
        </SectionCard>
      </Col>
    </Row>
  );
}

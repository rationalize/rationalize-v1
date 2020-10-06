import React from "react";
import { Row, Col, CardText, CardBody } from "reactstrap";

import { EvaluationSurveyUrl } from "components/EvaluationSurveyUrl";
import { LinkButton } from "components/LinkButton";
import { SectionCard } from "components/SectionCard";
import { Evaluation } from "mongodb-realm";

import { EvaluationSharingForm } from "./EvaluationSharingForm";
import { PrivacyHelp } from "./SharingHelp";

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
            <SectionCard.Header>Your Individual Scores</SectionCard.Header>
            <CardBody>
              <CardText>
                If you wish to adjust your scores, you can always go back to the
                evaluation and change them.
              </CardText>
              <LinkButton
                to={`/evaluations/${evaluation._id.toHexString()}/score`}
                color="primary"
                outline
                block
              >
                Adjust Your Individual Scores
              </LinkButton>
            </CardBody>
          </SectionCard>
        )}
        {evaluation.scoring.survey && (
          <SectionCard>
            <SectionCard.Header>Score by Survey</SectionCard.Header>
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
            Share Results With Others <PrivacyHelp />
          </SectionCard.Header>
          <CardBody>
            <EvaluationSharingForm evaluation={evaluation} />
          </CardBody>
        </SectionCard>
      </Col>
    </Row>
  );
}

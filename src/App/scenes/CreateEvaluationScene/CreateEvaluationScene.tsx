import React from "react";
import { Container, Card, Row, Col } from "reactstrap";
import { useHistory } from "react-router-dom";

import { CreateEvaluationForm } from "./CreateEvaluationForm";
import { EvaluationHelp } from "./EvaluationHelp";
import { Evaluation } from "../../../mongodb";
import { PrimaryLayout } from "../../layouts/PrimaryLayout";
import { RestrictedArea } from "../../RestrictedArea";

export function CreateEvaluationScene() {
  const history = useHistory();

  function handleCreated(evaluation: Evaluation) {
    const id = evaluation._id.toHexString();
    const { scoring } = evaluation;
    if (scoring.facilitator || scoring.survey) {
      history.push(`/evaluations/${id}/score`);
    } else {
      history.push(`/evaluations/${id}`);
    }
  }

  return (
    <PrimaryLayout>
      <RestrictedArea>
        <Container>
          <Row>
            <Col md={{ size: 6, offset: 3 }}>
              <h3>
                Create New Evaluation Evaluation <EvaluationHelp />
              </h3>
              <Card body>
                <CreateEvaluationForm handleCreated={handleCreated} />
              </Card>
            </Col>
          </Row>
        </Container>
      </RestrictedArea>
    </PrimaryLayout>
  );
}

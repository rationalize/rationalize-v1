import React, { useState, useEffect } from "react";
import { Container, Table, Card } from "reactstrap";
import { useHistory } from "react-router";

import { CenteredContainer } from "components/CenteredContainer";
import { LinkButton } from "components/LinkButton";
import { LoadingOverlay } from "components/LoadingOverlay";
import { RestrictedArea } from "components/RestrictedArea";
import { PrimaryLayout } from "layouts/PrimaryLayout";
import { Evaluation, evaluationsCollection, app } from "mongodb-realm";

import { EvaluationsListHelp } from "./EvaluationsListHelp";

import styles from "./EvaluationListScene.module.scss";

export function EvaluationListScene() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const history = useHistory();

  useEffect(() => {
    setIsLoading(true);
    evaluationsCollection
      .find({ facilitator: { $eq: app.currentUser?.id } })
      .then(setEvaluations, setError)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function goToEvaluation(evaluation: Evaluation) {
    history.push(`/evaluations/${evaluation._id.toHexString()}`);
  }

  function handleClick(evaluation: Evaluation) {
    goToEvaluation(evaluation);
  }

  function handleKeyUp(
    evaluation: Evaluation,
    e: React.KeyboardEvent<HTMLTableRowElement>
  ) {
    if (e.key === "Enter") {
      goToEvaluation(evaluation);
    }
  }

  return (
    <PrimaryLayout>
      <RestrictedArea>
        <LoadingOverlay isLoading={isLoading} error={error}>
          {evaluations.length > 0 ? (
            <>
              <Container>
                <h4>
                  Your Evaluations <EvaluationsListHelp />
                </h4>
                <Card body>
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Participants</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evaluations.map((evaluation) => (
                        <tr
                          key={evaluation._id.toHexString()}
                          className={
                            styles.EvaluationsOverviewScene__EvaluationRow
                          }
                          onClick={handleClick.bind(null, evaluation)}
                          onKeyUp={handleKeyUp.bind(null, evaluation)}
                          tabIndex={0}
                        >
                          <td>{evaluation.name}</td>
                          <td>{evaluation.participants.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <LinkButton to="/evaluations/create" color="primary">
                    Create New Evaluation
                  </LinkButton>
                </Card>
              </Container>
            </>
          ) : !isLoading ? (
            <CenteredContainer>
              <p>Concepts are evaluated at evaluations ...</p>
              <LinkButton to="/evaluations/create" color="primary">
                Create evaluation
              </LinkButton>
            </CenteredContainer>
          ) : null}
        </LoadingOverlay>
      </RestrictedArea>
    </PrimaryLayout>
  );
}

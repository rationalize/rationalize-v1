import React from "react";
import { Container, Row, Col, Card } from "reactstrap";
import { CreateEventForm } from "./CreateEventForm";
import { useHistory } from "react-router-dom";

import styles from "./CreateEventScene.module.scss";

export function CreateEventScene() {
  const history = useHistory();
  function handleCreated(id: Realm.ObjectId) {
    history.push(`/events/${id.toHexString()}`);
  }
  return (
    <Container fluid>
      <h3>Create New Evaluation Event</h3>
      <Card body>
        <Row>
          <Col md="8">
            <CreateEventForm handleCreated={handleCreated} />
          </Col>
          <Col md="4" className={styles.CreateEventScene__Explainer}>
            <h4>How Evaluation Events Work</h4>
            <p className={styles.CreateEventScene__ExplainerParagraph}>
              Evaluation Events are used to evaluate and rank concepts against a
              set of criteria. At this point, all you must do is to define a set
              of criteria which you are going to use in order to prioritize
              alternative concepts. In the subsequent steps you will be able to
              rank each alternative concept against your chosen criteria and
              even adjust the weights of your criteria.
            </p>
            <h6>What is a Criteria?</h6>
            <p className={styles.CreateEventScene__ExplainerParagraph}>
              Criteria answers the question of “What do you need to consider
              when making your evaluation?”. Basically, it is a set of
              dimensions that will be used to prioritize the Concepts.
            </p>
            <h6>What is a Concept?</h6>
            <p className={styles.CreateEventScene__ExplainerParagraph}>
              The Concepts are the options you are evaluating. Depending on the
              context, they can be anything from different corporate strategies
              you are considering to product features you are trying to
              prioritize for development.
            </p>
            <h6>What is a Scoring Mode?</h6>
            <p className={styles.CreateEventScene__ExplainerParagraph}>
              Scoring mode simply allows you to decide how you want to score the
              concepts against the criteria. If you want to do the scoring
              yourself, select “Individual”; if you would like to poll others
              select “Survey”; If you would like to do both, check both of the
              checkmarks.
            </p>
            <a href="/evaluation-example">Example of an Evaluation Event</a>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

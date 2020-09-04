import React, { useState } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Button,
  CardBody,
} from "reactstrap";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";
import { ObjectId } from "bson";

import { SectionCard } from "../../SectionCard";
import { WeightsHelp } from "./WeightsHelp";
import { LoadingOverlay } from "../../LoadingOverlay";
import {
  Weights,
  Evaluation,
  evaluationsCollection,
  isOnlyAnonymous,
} from "../../../mongodb";
import { useAuthentication } from "../../AuthenticationContext";
import { ConceptList } from "./ConceptList";
import { LinkCredentialsModal } from "./LinkCredentialsModal";
import { UserProfileModal } from "./UserProfileModal";

export type WeightValues = { weights: Weights };

export type WeightsRowProps = {
  evaluation: Evaluation;
};

type LinkUserModalState =
  | {
      open: false;
    }
  | {
      open: true;
      weights: Weights;
    };

type UserProfileModalState =
  | {
      open: false;
    }
  | {
      open: true;

      weights: Weights;
    };

export function WeightsRow({ evaluation }: WeightsRowProps) {
  const { user } = useAuthentication();
  const history = useHistory();

  // Read weights from the evaluation or generate as fallback
  const defaultWeights = Object.fromEntries(
    evaluation.criteria.map(({ name }) => [name, 0.5])
  );

  const [initialWeights, setInitialWeights] = useState(
    evaluation.weights || defaultWeights
  );

  /** Use isSaving to indicate requests which are not originating from the form */
  const [isSaving, setSaving] = useState(false);
  const [linkUserModal, setLinkUserModal] = useState<LinkUserModalState>({
    open: false,
  });
  const closeLinkUserModal = () => setLinkUserModal({ open: false });
  const [userProfileModal, setUserProfileModal] = useState<
    UserProfileModalState
  >({
    open: false,
  });
  const closeUserProfileModal = () => setUserProfileModal({ open: false });

  const isFacilitator = user !== null && user.id === evaluation.facilitator;
  const isAnonymous = isOnlyAnonymous(user);

  async function forkEvaluation(weights: Weights): Promise<ObjectId> {
    if (user) {
      // Create a cloned copy of this evaluation and navigate to it
      const newEvalutaion: Evaluation = {
        // Start with the values of the existing event
        ...evaluation,
        // The current the facilitator of the new event
        facilitator: user.id,
        // Save with the weights provided by the user
        weights: weights,
        // Indicate that this evaluation is a copy of another
        copyOf: evaluation._id,
        // Assume sharing is disabled until the user actively change this themselves
        sharing: { mode: "disabled" },
      };
      // Ask the server to pick a new ID for this evalutation
      delete newEvalutaion._id;
      // Insert the new evaluation
      const { insertedId } = await evaluationsCollection.insertOne(
        newEvalutaion
      );
      return insertedId;
    } else {
      throw new Error("Expected an authenticated user");
    }
  }

  async function handleWeightsSubmit(values: WeightValues) {
    try {
      if (isFacilitator) {
        // Just update the weights
        await evaluationsCollection.updateOne(
          { _id: evaluation._id },
          { $set: { weights: values.weights } }
        );
        setInitialWeights(values.weights);
      } else if (user) {
        // TODO: Force user to register and link with another authentication provider if authenticated anonymously
        const newId = await forkEvaluation(values.weights);
        // Navigate to the new evaluation
        history.push(`/evaluations/${newId.toHexString()}`);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleRegister(weights: Weights, e: React.MouseEvent) {
    e.preventDefault();
    setLinkUserModal({ open: true, weights });
  }

  async function handleUserLinked() {
    if (linkUserModal.open) {
      const { weights } = linkUserModal;
      // Close one modal
      setLinkUserModal({ open: false });
      // Open another
      setUserProfileModal({ open: true, weights });
    }
  }

  async function handleUserProfileSaved() {
    if (userProfileModal.open) {
      const { weights } = userProfileModal;
      // Close the modal
      setUserProfileModal({ open: false });
      // Complete the saving of the data ..
      setSaving(true);
      const newId = await forkEvaluation(weights);
      setSaving(false);
      // Navigate to the new evaluation
      history.push(`/evaluations/${newId.toHexString()}`);
    }
  }

  return (
    <>
      <Formik
        initialValues={{ weights: initialWeights }}
        onSubmit={handleWeightsSubmit}
      >
        {(props) => (
          <SectionCard>
            <Row>
              <Col sm="12" md="6">
                <SectionCard.Header>
                  Adjust Criteria Weights <WeightsHelp />
                </SectionCard.Header>
                <LoadingOverlay isLoading={props.isSubmitting || isSaving}>
                  <CardBody>
                    <Form
                      onSubmit={props.handleSubmit}
                      onReset={props.handleReset}
                    >
                      {evaluation.criteria.map((criterion, index) => (
                        <FormGroup key={index}>
                          <Label for={`criterion-${index}`}>
                            {criterion.name}
                          </Label>
                          <Input
                            type="range"
                            id={`criterion-${index}`}
                            name={`weights.${criterion.name}`}
                            value={props.values.weights[criterion.name]}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            step={0.1}
                            min={0}
                            max={1}
                          />
                        </FormGroup>
                      ))}
                      {isFacilitator ? (
                        <Row>
                          <Col>
                            <Button
                              type="submit"
                              color="primary"
                              disabled={!props.dirty || props.isSubmitting}
                              block
                            >
                              Save weights
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              type="reset"
                              color="primary"
                              disabled={!props.dirty || props.isSubmitting}
                              block
                              outline
                            >
                              Reset weights
                            </Button>
                          </Col>
                        </Row>
                      ) : isAnonymous ? (
                        <Button
                          type="submit"
                          color="primary"
                          onClick={handleRegister.bind(
                            null,
                            props.values.weights
                          )}
                          block
                        >
                          Register account to clone evaluation and save weights
                        </Button>
                      ) : (
                        <Button type="submit" color="primary" block>
                          Clone evaluation and save weights
                        </Button>
                      )}
                    </Form>
                  </CardBody>
                </LoadingOverlay>
              </Col>
              <Col sm="12" md="6">
                <SectionCard.Header>
                  Prioritized Concept List
                </SectionCard.Header>
                <CardBody>
                  <ConceptList
                    evaluation={evaluation}
                    weights={props.values.weights}
                  />
                </CardBody>
              </Col>
            </Row>
          </SectionCard>
        )}
      </Formik>
      <LinkCredentialsModal
        isOpen={linkUserModal.open}
        onLinked={handleUserLinked}
        toggle={closeLinkUserModal}
      />
      <UserProfileModal
        isOpen={userProfileModal.open}
        onSaved={handleUserProfileSaved}
        toggle={closeUserProfileModal}
      />
    </>
  );
}

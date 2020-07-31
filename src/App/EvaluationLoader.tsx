import React from "react";
import { useParams } from "react-router-dom";

import { Evaluation, EvaluationFinder } from "../mongodb";
import { LoadingOverlay } from "./LoadingOverlay";
import { NotFound } from "./NotFound";

export type EvaluationLoaderProps =
  | {
      component: React.ComponentType<{ evaluation: Evaluation }>;
      children?: undefined;
    }
  | {
      component?: undefined;
      children: (props: { evaluation: Evaluation }) => JSX.Element;
    };

export function EvaluationLoader({
  component,
  children,
}: EvaluationLoaderProps) {
  const params = useParams<{ id?: string }>();
  const evaluationId = params.id;
  return (
    <EvaluationFinder id={evaluationId}>
      {({ evaluation, isLoading }) => (
        <LoadingOverlay isLoading={isLoading}>
          {evaluation &&
            component &&
            React.createElement(component, { evaluation })}
          {evaluation && children && children({ evaluation })}
          {!evaluation && !isLoading && <NotFound />}
        </LoadingOverlay>
      )}
    </EvaluationFinder>
  );
}

import React from "react";
import { FormText } from "reactstrap";
import { useFormikContext } from "formik";

type FieldFeedbackProps<Values> = {
  name: keyof Values;
  helper?: string;
};

export function FieldFeedback<Values>({
  name,
  helper,
}: FieldFeedbackProps<Values>) {
  const { errors, touched } = useFormikContext<Values>();
  const showError = name in errors && name in touched;
  return (
    <FormText color={showError ? "danger" : undefined}>
      {showError ? errors[name] : helper}
    </FormText>
  );
}

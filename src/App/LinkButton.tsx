import React from "react";
import { Button, ButtonProps } from "reactstrap";
import { useHistory } from "react-router-dom";

type LinkButtonProps = {
  to: string;
} & ButtonProps;

export function LinkButton(props: LinkButtonProps) {
  const history = useHistory();
  return <Button {...props} onClick={() => history.push(props.to)} />;
}

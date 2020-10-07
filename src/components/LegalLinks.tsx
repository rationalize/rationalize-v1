import React from "react";
import { Link } from "react-router-dom";

type LegalLinkProps = {
  name: string;
  to: string;
};

const LegalLink = ({ name, to }: LegalLinkProps) => (
  <Link target="legal" to={to}>
    {name}
  </Link>
);

export function LegalLinks() {
  return (
    <>
      <LegalLink name="Terms of Use" to="/terms-of-use" />
      {", "}
      <LegalLink name="Privacy Notice" to="/privacy-notice" />
      {" & "}
      <LegalLink name="Cookie Policy" to="/cookies" />
    </>
  );
}

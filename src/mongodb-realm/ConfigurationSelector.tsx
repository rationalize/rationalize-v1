import React from "react";
import { Input } from "reactstrap";

import { CONFIGURATIONS, selectConfiguration, config } from "./RealmApp";

import styles from "./ConfigurationSelector.module.scss";

export type ConfigurationSelectorProps = {};

export function ConfigurationSelector() {
  function handleChangeConfiguration(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const name = event.target.value;
    selectConfiguration(name);
  }

  return process.env.NODE_ENV === "development" ? (
    <Input
      className={styles.ConfigurationSelector}
      type="select"
      defaultValue={config.name}
      onChange={handleChangeConfiguration}
    >
      {CONFIGURATIONS.map((c) => (
        <option key={c.name}>{c.name}</option>
      ))}
    </Input>
  ) : null;
}

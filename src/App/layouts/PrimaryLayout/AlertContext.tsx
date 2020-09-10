import React, { createContext, useContext, useState } from "react";

type AlertColor = "danger" | "warning" | "success" | "info";

type AlertValue = {
  id?: string;
  message: string | React.ReactNode;
  dismissable: boolean;
  color: AlertColor;
};

type AlertContextValue = {
  alerts: AlertValue[];
  showAlert: (alert: AlertValue) => void;
  dismissAlert: (alert: AlertValue | string) => void;
};

async function throwMissingProvider(): Promise<any> {
  throw new Error("Cannot use the AlertConsumer outside of an AlertProvider");
}

const context = createContext<AlertContextValue>({
  alerts: [],
  showAlert: throwMissingProvider,
  dismissAlert: throwMissingProvider,
});

const { Consumer, Provider } = context;

type AlertProviderProps = {
  children: React.ReactNode;
};

/*
const DUMMY_ALERT: AlertValue = {
  message: "Hi there!",
  color: "info",
  dismissable: true,
};
*/

export function AlertProvider({ children }: AlertProviderProps) {
  const [alerts, setAlerts] = useState<AlertValue[]>([]);

  function showAlert(alert: AlertValue) {
    if (!alert.id || !alerts.find((a) => a.id === alert.id)) {
      setAlerts([...alerts, alert]);
    }
  }

  function dismissAlert(alert: AlertValue | string) {
    setAlerts(
      alerts.filter((a) =>
        typeof alert === "string" ? a.id !== alert : a !== alert
      )
    );
  }

  return (
    <Provider value={{ alerts, showAlert, dismissAlert }} children={children} />
  );
}

export { Consumer as AlertConsumer };

export function useAlerts() {
  return useContext(context);
}

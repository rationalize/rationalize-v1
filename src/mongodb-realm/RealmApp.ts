import { ObjectId } from "bson";
import { App, User as RealmUser } from "realm-web";

import { UserProfile } from "./UserProfiles";

export interface Functions {
  updateEvaluationScore(
    evaluationId: ObjectId,
    scores: { criterion: string; concept: string; value: number }[]
  ): Promise<{ success: boolean }>;
  joinEvaluation(
    evaluationId: string,
    token: string
  ): Promise<{ success: boolean }>;
}

export type User = RealmUser<
  Functions & Realm.BaseFunctionsFactory,
  Partial<UserProfile>
>;

export function isOnlyAnonymous(user: User | null) {
  if (user) {
    return (
      user.identities.length === 1 &&
      user.identities[0].providerType === "anon-user"
    );
  } else {
    return false;
  }
}

type AppConfiguration = {
  name: string;
  appId: string;
  databaseName: string;
};

const APP_CONFIGURATION_STORAGE_KEY = "realm-app-configuration";

export const CONFIGURATIONS: AppConfiguration[] = [
  {
    name: "production",
    appId: "rationalize-prod-flova",
    databaseName: "rationalize-prod",
  },
  {
    name: "staging",
    appId: "rationalize-iwbgr",
    databaseName: "rationalize-db",
  },
];

function getDefaultConfigurationName() {
  if (window.location.hostname === "app.rationalize.io") {
    return "production";
  } else {
    return "staging";
  }
}

function getAppConfiguration() {
  const configurationName =
    localStorage.getItem(APP_CONFIGURATION_STORAGE_KEY) ||
    getDefaultConfigurationName();
  const config = CONFIGURATIONS.find((c) => c.name === configurationName);
  if (config) {
    return config;
  } else {
    throw new Error(`Failed finding "${configurationName}" configuration`);
  }
}

export function selectConfiguration(name: string) {
  localStorage.setItem(APP_CONFIGURATION_STORAGE_KEY, name);
  window.location.reload();
}

export const config = getAppConfiguration();
export const app = new App<Functions, UserProfile | {}>(config.appId);

export const mongodb = app.services.mongodb("mongodb-atlas");
export const db = mongodb.db(config.databaseName);

import { ObjectId } from "bson";
import { App, User as RealmUser } from "realm-web";

import { UserProfile } from "./UserProfiles";

export interface Functions {
  updateEvaluationScore(
    evaluationId: ObjectId,
    scores: { criterion: string; alternative: string; score: number }[]
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

function getAppConfiguration() {
  const configurationName =
    localStorage.getItem(APP_CONFIGURATION_STORAGE_KEY) || "production";
  const config = CONFIGURATIONS.find((c) => c.name === configurationName);

  if (config) {
    return config;
  } else {
    return CONFIGURATIONS[0];
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

import { ObjectId } from "bson";
import { App, User as RealmUser } from "realm-web";

import { UserProfile } from "./UserProfiles";

export interface Functions {
  updateEvaluationScore(
    evaluationId: ObjectId,
    scores: { criterion: string; alternative: string; score: number }[]
  ): Promise<{ success: boolean }>;
  acceptEvaluationInvitation(
    evaluationId: string,
    token: string
  ): Promise<{ success: boolean }>;
}

export type User = RealmUser<
  Functions & Realm.BaseFunctionsFactory,
  Partial<UserProfile>
>;

export const APP_ID = "rationalize-iwbgr";
export const app = new App<Functions, UserProfile | {}>(APP_ID);

export const mongodb = app.services.mongodb("mongodb-atlas");
export const db = mongodb.db("rationalize-db");

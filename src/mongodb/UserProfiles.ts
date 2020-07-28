import { ObjectId } from "bson";
import { db } from "./RealmApp";

type ProfessionalProfile = {
  use: "professional";
  company: string;
  title: string;
  work: string;
};

export type UserProfile = {
  _id: ObjectId;
  userId: string;
  firstName: string;
  lastName: string;
} & (ProfessionalProfile | { use: "individual" });

export const userProfilesCollection = db.collection<UserProfile>(
  "UserProfiles"
);

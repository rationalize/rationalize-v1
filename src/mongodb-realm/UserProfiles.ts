import { ObjectId } from "bson";
import { useMongoCollection } from "./RealmApp";

export function useUserProfiles() {
  return useMongoCollection<UserProfile>("UserProfiles");
}

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

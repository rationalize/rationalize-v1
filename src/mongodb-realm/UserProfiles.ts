import { ObjectId } from "bson";

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

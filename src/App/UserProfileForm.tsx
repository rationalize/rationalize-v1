import React from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Formik, FormikHelpers } from "formik";

import { LoadingOverlay } from "./LoadingOverlay";
import { userProfilesCollection, UserProfile } from "../mongodb";
import { useAuthentication } from "./AuthenticationContext";

type FormValues = {
  firstName: string;
  lastName: string;
  use: string | undefined;
  company: string;
  title: string;
  work: string;
  workOther: string;
};

const initialValues = {
  firstName: "",
  lastName: "",
  use: undefined,
  company: "",
  title: "",
  work: "",
  workOther: "",
};

const KNOWN_WORKS = [
  "Product Development",
  "Product Management",
  "Industrial Engineering",
  "Electrical Engineering",
  "Software Engineering",
  "Innovation",
  "Market Research",
  "Executive & General Management",
  "Business Analysis",
  "Marketing",
  "Sales",
  "Research",
  "Student",
];

export type UserProfileFormProps = { onSaved?: () => void };

export function UserProfileForm({ onSaved }: UserProfileFormProps) {
  const { user, refreshCustomData } = useAuthentication();

  async function handleSubmit(
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) {
    if (user) {
      const parsedValues: Partial<UserProfile> = {
        firstName: values.firstName,
        lastName: values.lastName,
      };
      if (values.use === "individual" || values.use === "professional") {
        parsedValues.use = values.use;
      }

      if (parsedValues.use === "professional") {
        parsedValues.company = values.company;
        parsedValues.title = values.title;
        parsedValues.work =
          values.work === "other" ? values.workOther : values.work;
      }
      // Submit the parsed values
      const {
        upsertedId,
        modifiedCount,
      } = await userProfilesCollection.updateOne(
        { userId: user.id },
        { $set: parsedValues },
        { upsert: true }
      );
      // Expect either an upserted or a modified document
      if (upsertedId || modifiedCount === 1) {
        await refreshCustomData();
      } else {
        throw new Error("Failed updating the profile");
      }
    } else {
      throw new Error("Cannot save profile without an authenticated user");
    }
    setSubmitting(false);
    gtag("event", "save_user_profile");
    if (onSaved) {
      onSaved();
    }
  }

  // If a user is known, extend the initial values with
  const extendedInitialValues = user
    ? { ...initialValues, ...user.customData }
    : initialValues;
  // "work" is defined but not known: Move it to workOther
  if (
    extendedInitialValues.work &&
    !KNOWN_WORKS.includes(extendedInitialValues.work)
  ) {
    extendedInitialValues.workOther = extendedInitialValues.work;
    extendedInitialValues.work = "other";
  }

  return (
    <Formik<FormValues>
      initialValues={extendedInitialValues}
      onSubmit={handleSubmit}
    >
      {({
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        handleReset,
        isSubmitting,
      }) => (
        <LoadingOverlay isLoading={isSubmitting}>
          <Form onSubmit={handleSubmit} onReset={handleReset}>
            <FormGroup>
              <Label for="firstName">First name</Label>
              <Input
                type="text"
                name="firstName"
                id="firstName"
                required
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormGroup>
            <FormGroup>
              <Label for="lastName">Last name</Label>
              <Input
                type="text"
                name="lastName"
                id="lastName"
                required
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormGroup>
            <FormGroup>
              <Label for="use">How do you plan on using Rationalize?</Label>
              <Input
                type="select"
                name="use"
                id="use"
                required
                value={values.use}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option />
                <option value="individual">Individual use</option>
                <option value="professional">Professional use</option>
              </Input>
            </FormGroup>
            {values.use === "professional" && (
              <>
                <FormGroup>
                  <Label for="company">Company</Label>
                  <Input
                    type="text"
                    name="company"
                    id="company"
                    required
                    value={values.company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="title">Job title</Label>
                  <Input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="work">
                    What best describes the nature of your work
                  </Label>
                  <Input
                    type="select"
                    name="work"
                    id="work"
                    required
                    value={values.work}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option />
                    {KNOWN_WORKS.map((w, i) => (
                      <option key={i}>{w}</option>
                    ))}
                    <option value="other">Other (Specify)</option>
                  </Input>
                </FormGroup>
                {values.work !== "" && !KNOWN_WORKS.includes(values.work) && (
                  <FormGroup>
                    <Input
                      type="text"
                      name="workOther"
                      required
                      value={values.workOther}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                )}
              </>
            )}
            <Button type="submit" color="primary" disabled={isSubmitting} block>
              Save profile
            </Button>
          </Form>
        </LoadingOverlay>
      )}
    </Formik>
  );
}

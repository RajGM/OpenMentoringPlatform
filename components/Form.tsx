import React from "react";
import "react-responsive-modal/styles.css";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import { toast, Toaster } from "react-hot-toast";

import DatePickerCarousel from "./DatePickerCarousel";

import { UserContext } from "@lib/context";
import { useContext } from "react";

export function Customform({ eventData, categoryTest }) {
  if (categoryTest === "hackathon") {
    return <Hackathon eventData={eventData} />;
  } else if (categoryTest == "internship") {
    return <Internship eventData={eventData} />;
  } else if (categoryTest == "grants") {
    return <Grants eventData={eventData} />;
  } else if (categoryTest == "conferences") {
    return <Conferences eventData={eventData} />;
  }
}

export const MyFormComponent = ({ eventData }) => {
  return (
    <Formik
      initialValues={{ category: "Hackathon" }}
      onSubmit={(resetForm) => {
        false, resetForm();
      }}
    >
      {(formik) => (
        <div>
          <div className="multiOption">
            <div id="my-radio-group">Category</div>
            <div
              role="group"
              aria-labelledby="my-radio-group"
              className="optionDiv"
            >
              <label>
                <Field type="radio" name="category" value="Hackathon" />
                Hackathon
              </label>
              <label>
                <Field type="radio" name="category" value="Internship" />
                Internship
              </label>
              <label>
                <Field type="radio" name="category" value="Grants" />
                Grants
              </label>
              <label>
                <Field type="radio" name="category" value="Conferences" />
                Conferences
              </label>
            </div>
          </div>

          {formik.values.category == "Hackathon" && (
            <Hackathon eventData={null} />
          )}

          {formik.values.category == "Internship" && (
            <Internship eventData={null} />
          )}

          {formik.values.category == "Grants" && <Grants eventData={null} />}

          {formik.values.category == "Conferences" && (
            <Conferences eventData={null} />
          )}
        </div>
      )}
    </Formik>
  );
};

function Hackathon({ eventData }) {
  const { user, username } = useContext(UserContext);

  if (eventData == null) {
    return (
      <Formik
        initialValues={{
          eventN: "",
          link: "",
          appS: "",
          appE: "",
          eventS: "",
          eventE: "",
          postedBy: "",
          filters: "",
        }}
        onSubmit={async (values) => {
          try {
            values.postedBy = username;
            await post("add", "Hackathon", values, user);
          } catch (error) {
            console.error("Error submitting the form:", error);
            toast.error("An error occurred while submitting the form.");
          }

          // values.postedBy = username;

          // toast.loading(`Adding ${values.eventN} for the community`);

          // await post("add", "Hackathon", values, user);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="eventN" className="text-lg font-semibold">
                Hackathon
              </label>
              <Field
                name="eventN"
                placeholder="Hackathon"
                className="p-2 border rounded"
                validate={(value) => {
                  if (!value) {
                    return "Title is required";
                  }
                }}
              />
              <ErrorMessage name="eventN" className="text-red-500" />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="link" className="text-lg font-semibold">
                Link
              </label>
              <Field
                name="link"
                placeholder="HackthonURL"
                className="p-2 border rounded"
                validate={(value) => {
                  if (!value) {
                    return "Link is required";
                  }
                }}
              />
              <ErrorMessage name="link" className="text-red-500" />
            </div>

            <div className="flex flex-col space-y-2">
              <div id="my-radio-group" className="text-lg font-semibold">
                Filters
              </div>
              <div
                role="group"
                aria-labelledby="my-radio-group"
                className="flex space-x-4"
              >
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="onsite"
                    className="mr-2"
                  />
                  Onsite
                </label>
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="remote"
                    className="mr-2"
                  />
                  Remote
                </label>
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="hybrid"
                    className="mr-2"
                  />
                  Hybrid
                </label>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="appS" className="text-lg font-semibold">
                Application Starts
              </label>
              <Field
                name="appS"
                type="date"
                className="p-2 border rounded"
                validate={(value) => {
                  if (!value) {
                    return "Application Start Date is required";
                  }
                }}
              />
              <ErrorMessage name="appS" className="text-red-500" />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="appE" className="text-lg font-semibold">
                Application Ends
              </label>
              <Field
                name="appE"
                type="date"
                className="p-2 border rounded"
                validate={(value) => {
                  if (!value) {
                    return "Application End Date is required";
                  }
                }}
              />
              <ErrorMessage name="appE" className="text-red-500" />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="eventS" className="text-lg font-semibold">
                Hackathon Begins
              </label>
              <Field name="eventS" type="date" className="p-2 border rounded" />
              <ErrorMessage name="eventS" className="text-red-500" />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="eventE" className="text-lg font-semibold">
                Hackathon Ends
              </label>
              <Field name="eventE" type="date" className="p-2 border rounded" />
              <ErrorMessage name="eventE" className="text-red-500" />
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  } else {
    return (
      <Formik
        initialValues={{
          eventN: eventData.eventN,
          link: eventData.link,
          appS: eventData.appS,
          appE: eventData.appE,
          eventS: eventData.eventS,
          eventE: eventData.eventE,
          filters: eventData.filters,
          postedBy: eventData.postedBy,
        }}
        onSubmit={async (values) => {
          toast.loading(`Updating ${values.eventN} for the community`);

          values.calID = eventData.calID ? eventData.calID : "";
          values.discordMessageID = eventData.discordMessageID
            ? eventData.discordMessageID
            : "";

          await post("edit", "Hackathon", values, user, eventData.id);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="eventN" className="text-lg font-semibold">
                Hackathon
              </label>
              <Field
                name="eventN"
                placeholder="Title"
                className="p-2 border rounded"
                validate={(value) => {
                  if (!value) {
                    return "Hackathon Title is required";
                  }
                }}
              />
              <ErrorMessage name="eventN" className="text-red-500" />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="link" className="text-lg font-semibold">
                Link
              </label>
              <Field
                name="link"
                placeholder="Hackathon URL"
                className="p-2 border rounded"
                validate={(value) => {
                  if (!value) {
                    return "Hackathon URL is required";
                  }
                }}
              />
              <ErrorMessage name="link" className="text-red-500" />
            </div>

            <div className="flex flex-col space-y-2">
              <div id="my-radio-group" className="text-lg font-semibold">
                Filters
              </div>
              <div
                role="group"
                aria-labelledby="my-radio-group"
                className="flex space-x-4"
              >
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="onsite"
                    className="mr-2"
                  />
                  Onsite
                </label>
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="remote"
                    className="mr-2"
                  />
                  Remote
                </label>
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="hybrid"
                    className="mr-2"
                  />
                  Hybrid
                </label>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="appS" className="text-lg font-semibold">
                Registration Begins
              </label>
              <Field
                name="appS"
                type="date"
                className="p-2 border rounded"
                validate={(value) => {
                  if (!value) {
                    return "Application Start date is required";
                  }
                }}
              />
              <ErrorMessage name="appS" className="text-red-500" />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="appE" className="text-lg font-semibold">
                Registration Ends
              </label>
              <Field
                name="appE"
                type="date"
                className="p-2 border rounded"
                validate={(value) => {
                  if (!value) {
                    return "Application End date is required";
                  }
                }}
              />
              <ErrorMessage name="appE" className="text-red-500" />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="eventS" className="text-lg font-semibold">
                Conference Begins
              </label>
              <Field name="eventS" type="date" className="p-2 border rounded" />
              <ErrorMessage name="eventS" className="text-red-500" />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="eventE" className="text-lg font-semibold">
                Conference Ends
              </label>
              <Field name="eventE" type="date" className="p-2 border rounded" />
              <ErrorMessage name="eventE" className="text-red-500" />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

function Internship({ eventData }) {
  const { user, username } = useContext(UserContext);

  if (eventData == null) {
    return (
      <Formik
        initialValues={{
          eventN: "",
          link: "",
          appS: "",
          appE: "",
          eventS: "",
          eventE: "",
          filters: "",
          postedBy: "",
        }}
        onSubmit={async (values) => {
          values.postedBy = username;

          toast.loading(`Adding ${values.eventN} for the community`);

          await post("add", "Internship", values, user);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded shadow-md space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="eventN" className="font-semibold">
                Company
              </label>
              <Field
                name="eventN"
                placeholder="Internship"
                className="p-2 border rounded"
                validate={(value) => {
                  if (!value) {
                    return "Internship Title is required";
                  }
                }}
              />
              <ErrorMessage name="eventN" className="text-red-500" />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="link" className="font-semibold">
                Link
              </label>
              <Field
                name="link"
                placeholder="Link to application"
                className="p-2 border rounded"
                validate={(value) => {
                  if (!value) {
                    return "Internship URL is required";
                  }
                }}
              />
              <ErrorMessage name="link" className="text-red-500" />
            </div>

            <div className="flex flex-col space-y-2">
              <div id="my-radio-group" className="font-semibold">
                Type
              </div>
              <div
                role="group"
                aria-labelledby="my-radio-group"
                className="flex space-x-4"
              >
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="onsite"
                    className="mr-2"
                  />
                  Onsite
                </label>
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="remote"
                    className="mr-2"
                  />
                  Remote
                </label>
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="hybrid"
                    className="mr-2"
                  />
                  Hybrid
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="appS" className="font-semibold">
                  Application Starts
                </label>
                <Field
                  name="appS"
                  type="date"
                  className="p-2 border rounded"
                  validate={(value) => {
                    if (!value) {
                      return "Application Start date is required";
                    }
                  }}
                />
                <ErrorMessage name="appS" className="text-red-500" />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="appE" className="font-semibold">
                  Application Ends
                </label>
                <Field
                  name="appE"
                  type="date"
                  className="p-2 border rounded"
                  validate={(value) => {
                    if (!value) {
                      return "Application End date is required";
                    }
                  }}
                />
                <ErrorMessage name="appE" className="text-red-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="eventS" className="font-semibold">
                  Internship Begins
                </label>
                <Field
                  name="eventS"
                  type="date"
                  className="p-2 border rounded"
                />
                <ErrorMessage name="eventS" className="text-red-500" />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="eventE" className="font-semibold">
                  Internship Ends
                </label>
                <Field
                  name="eventE"
                  type="date"
                  className="p-2 border rounded"
                />
                <ErrorMessage name="eventE" className="text-red-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    );
  } else {
    return (
      <Formik
        initialValues={{
          eventN: eventData.eventN,
          link: eventData.link,
          appS: eventData.appS,
          appE: eventData.appE,
          eventS: eventData.eventS,
          eventE: eventData.eventE,
          filters: eventData.filters,
          postedBy: eventData.postedBy,
        }}
        onSubmit={async (values) => {
          values.calID = eventData.calID ? eventData.calID : "";
          values.discordMessageID = eventData.discordMessageID
            ? eventData.discordMessageID
            : "";

          toast.loading(`Adding ${values.eventN} for the community`);

          await post("edit", "Internship", values, user, eventData.id);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded shadow-md space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="eventN" className="font-semibold">
                Company
              </label>
              <Field
                name="eventN"
                placeholder="Internship"
                className="p-2 border rounded"
                validate={(value) => {
                  if (!value) {
                    return "Internship Title is required";
                  }
                }}
              />
              <ErrorMessage name="eventN" className="text-red-500" />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="link" className="font-semibold">
                Link
              </label>
              <Field
                name="link"
                placeholder="Link to application"
                className="p-2 border rounded"
                validate={(value) => {
                  if (!value) {
                    return "Internship URL is required";
                  }
                }}
              />
              <ErrorMessage name="link" className="text-red-500" />
            </div>

            <div className="flex flex-col space-y-2">
              <div id="my-radio-group" className="font-semibold">
                Type
              </div>
              <div
                role="group"
                aria-labelledby="my-radio-group"
                className="flex space-x-4"
              >
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="onsite"
                    className="mr-2"
                  />
                  Onsite
                </label>
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="remote"
                    className="mr-2"
                  />
                  Remote
                </label>
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="hybrid"
                    className="mr-2"
                  />
                  Hybrid
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="appS" className="font-semibold">
                  Application Starts
                </label>
                <Field
                  name="appS"
                  type="date"
                  className="p-2 border rounded"
                  validate={(value) => {
                    if (!value) {
                      return "Application Start date is required";
                    }
                  }}
                />
                <ErrorMessage name="appS" className="text-red-500" />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="appE" className="font-semibold">
                  Application Ends
                </label>
                <Field
                  name="appE"
                  type="date"
                  className="p-2 border rounded"
                  validate={(value) => {
                    if (!value) {
                      return "Application End date is required";
                    }
                  }}
                />
                <ErrorMessage name="appE" className="text-red-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="eventS" className="font-semibold">
                  Internship Begins
                </label>
                <Field
                  name="eventS"
                  type="date"
                  className="p-2 border rounded"
                />
                <ErrorMessage name="eventS" className="text-red-500" />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="eventE" className="font-semibold">
                  Internship Ends
                </label>
                <Field
                  name="eventE"
                  type="date"
                  className="p-2 border rounded"
                />
                <ErrorMessage name="eventE" className="text-red-500" />
              </div>
            </div>

            <div className="flex justify-center items-center h-full">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

function Grants({ eventData }) {
  const { user, username } = useContext(UserContext);

  if (eventData == null) {
    return (
      <Formik
        initialValues={{
          eventN: "",
          link: "",
          appS: "",
          appE: "",
          filters: "",
          postedBy: "",
        }}
        //if edit then set initial values to eventData
        onSubmit={async (values) => {
          values.postedBy = username;

          toast.loading(`Adding ${values.eventN} for the community`);

          await post("add", "Grants", values, user);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded shadow-md space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="eventN" className="font-semibold text-gray-700">
                Company
              </label>
              <Field
                name="eventN"
                placeholder="Grant Title"
                className="input input-bordered"
                validate={(value) => {
                  if (!value) {
                    return "Title is required";
                  }
                }}
              />
              <ErrorMessage name="eventN" className="text-red-500 text-sm" />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="link" className="font-semibold text-gray-700">
                Link
              </label>
              <Field
                name="link"
                placeholder="Application link"
                className="input input-bordered"
                validate={(value) => {
                  if (!value) {
                    return "Link to application is required";
                  }
                }}
              />
              <ErrorMessage name="link" className="text-red-500 text-sm" />
            </div>

            <div className="flex flex-col space-y-2">
              <div id="my-radio-group" className="font-semibold text-gray-700">
                Type
              </div>
              <div
                role="group"
                aria-labelledby="my-radio-group"
                className="flex space-x-4"
              >
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="travel"
                    className="radio radio-primary mr-2"
                  />
                  Travel
                </label>
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="course"
                    className="radio radio-primary mr-2"
                  />
                  Course
                </label>
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="conference"
                    className="radio radio-primary mr-2"
                  />
                  Conference
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="appS" className="font-semibold text-gray-700">
                  Application Starts
                </label>
                <Field
                  name="appS"
                  type="date"
                  className="input input-bordered"
                  validate={(value) => {
                    if (!value) {
                      return "Application Start date is required";
                    }
                  }}
                />
                <ErrorMessage name="appS" className="text-red-500 text-sm" />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="appE" className="font-semibold text-gray-700">
                  Application Ends
                </label>
                <Field
                  name="appE"
                  type="date"
                  className="input input-bordered"
                  validate={(value) => {
                    if (!value) {
                      return "Application End date is required";
                    }
                  }}
                />
                <ErrorMessage name="appE" className="text-red-500 text-sm" />
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  } else {
    return (
      <Formik
        initialValues={{
          eventN: eventData.eventN,
          link: eventData.link,
          appS: eventData.appS,
          appE: eventData.appE,
          filters: eventData.filters,
          postedBy: eventData.postedBy,
        }}
        onSubmit={async (values) => {
          values.calID = eventData.calID ? eventData.calID : "";
          values.discordMessageID = eventData.discordMessageID
            ? eventData.discordMessageID
            : "";

          toast.loading(`Adding ${values.eventN} for the community`);

          await post("edit", "Grants", values, user, eventData.id);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded shadow-md space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="eventN" className="font-semibold text-gray-700">
                Grant
              </label>
              <Field
                name="eventN"
                placeholder="Enter grant title"
                className="input input-bordered w-full"
                validate={(value) => {
                  if (!value) {
                    return "Grant title is required";
                  }
                }}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="link" className="font-semibold text-gray-700">
                Link
              </label>
              <Field
                name="link"
                placeholder="hackHar.com"
                className="input input-bordered w-full"
                validate={(value) => {
                  if (!value) {
                    return "Grant application url is required";
                  }
                }}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <div id="my-radio-group" className="font-semibold text-gray-700">
                Picked
              </div>
              <div
                role="group"
                aria-labelledby="my-radio-group"
                className="flex space-x-4"
              >
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="travel"
                    className="radio radio-primary mr-2"
                  />
                  Travel
                </label>
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="course"
                    className="radio radio-primary mr-2"
                  />
                  Course
                </label>
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="conference"
                    className="radio radio-primary mr-2"
                  />
                  Conference
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="appS" className="font-semibold text-gray-700">
                  Application Starts
                </label>
                <Field
                  name="appS"
                  type="date"
                  className="input input-bordered"
                  validate={(value) => {
                    if (!value) {
                      return "Application Start date is required";
                    }
                  }}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="appE" className="font-semibold text-gray-700">
                  Application Ends
                </label>
                <Field
                  name="appE"
                  type="date"
                  className="input input-bordered"
                  validate={(value) => {
                    if (!value) {
                      return "Application End date is required";
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

function Conferences({ eventData }) {
  const { user, username } = useContext(UserContext);

  if (eventData == null) {
    return (
      <Formik
        initialValues={{
          eventN: "",
          link: "",
          appS: "",
          appE: "",
          eventS: "",
          eventE: "",
          filters: "",
          postedBy: "",
        }}
        onSubmit={async (values) => {
          values.postedBy = username;

          toast.loading(`Adding ${values.eventN} for the community`);

          await post("add", "Conferences", values, user);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded shadow-md space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="eventN" className="font-semibold text-gray-700">
                Conference Title
              </label>
              <Field
                name="eventN"
                placeholder="Title"
                className="input input-bordered w-full"
                validate={(value) => {
                  if (!value) {
                    return "Conference Title is required";
                  }
                }}
              />
              <ErrorMessage name="eventN" className="text-red-500 text-sm" />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="link" className="font-semibold text-gray-700">
                Link
              </label>
              <Field
                name="link"
                placeholder="Conference URL"
                className="input input-bordered w-full"
                validate={(value) => {
                  if (!value) {
                    return "Conference url is required";
                  }
                }}
              />
              <ErrorMessage name="link" className="text-red-500 text-sm" />
            </div>

            <div className="flex flex-col space-y-2">
              <div id="my-radio-group" className="font-semibold text-gray-700">
                Picked
              </div>
              <div
                role="group"
                aria-labelledby="my-radio-group"
                className="flex space-x-4"
              >
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="design"
                    className="radio radio-primary mr-2"
                  />
                  Design
                </label>
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="launch event"
                    className="radio radio-primary mr-2"
                  />
                  Launch Event
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="appS" className="font-semibold text-gray-700">
                  Registration Starts
                </label>
                <Field
                  name="appS"
                  type="date"
                  className="input input-bordered"
                  validate={(value) => {
                    if (!value) {
                      return "Registration Start date is required";
                    }
                  }}
                />
                <ErrorMessage name="appS" className="text-red-500 text-sm" />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="appE" className="font-semibold text-gray-700">
                  Registration Ends
                </label>
                <Field
                  name="appE"
                  type="date"
                  className="input input-bordered"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="eventS" className="font-semibold text-gray-700">
                  Conference Begins
                </label>
                <Field
                  name="eventS"
                  type="date"
                  className="input input-bordered"
                />
                <ErrorMessage name="eventS" className="text-red-500 text-sm" />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="eventE" className="font-semibold text-gray-700">
                  Conference Ends
                </label>
                <Field
                  name="eventE"
                  type="date"
                  className="input input-bordered"
                />
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  } else {
    return (
      <Formik
        initialValues={{
          eventN: eventData.eventN,
          link: eventData.link,
          appS: eventData.appS,
          appE: eventData.appE,
          eventS: eventData.eventS,
          eventE: eventData.eventE,
          filters: eventData.filters,
          postedBy: eventData.postedBy,
        }}
        onSubmit={async (values) => {
          values.calID = eventData.calID ? eventData.calID : "";
          values.discordMessageID = eventData.discordMessageID
            ? eventData.discordMessageID
            : "";

          toast.loading(`Adding ${values.eventN} for the community`);

          await post("edit", "Conferences", values, user, eventData.id);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="eventN" className="font-semibold text-gray-700">
                Conference Title
              </label>
              <Field
                name="eventN"
                placeholder="Title"
                className="input input-bordered w-full"
                validate={(value) => {
                  if (!value) {
                    return "Conference Title is required";
                  }
                }}
              />
              <ErrorMessage name="eventN" className="text-red-500 text-sm" />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="link" className="font-semibold text-gray-700">
                Link
              </label>
              <Field
                name="link"
                placeholder="Conference URL"
                className="input input-bordered w-full"
                validate={(value) => {
                  if (!value) {
                    return "Conference URL is required";
                  }
                }}
              />
              <ErrorMessage name="link" className="text-red-500 text-sm" />
            </div>

            <div className="flex flex-col space-y-2">
              <div id="my-radio-group" className="font-semibold text-gray-700">
                Picked
              </div>
              <div
                role="group"
                aria-labelledby="my-radio-group"
                className="flex space-x-4"
              >
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="design"
                    className="radio radio-primary mr-2"
                  />
                  Design
                </label>
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="filters"
                    value="launch event"
                    className="radio radio-primary mr-2"
                  />
                  Launch Event
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="appS" className="font-semibold text-gray-700">
                  Registration Begins
                </label>
                <Field
                  name="appS"
                  type="date"
                  className="input input-bordered"
                  validate={(value) => {
                    if (!value) {
                      return "Registration Start date is required";
                    }
                  }}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="appE" className="font-semibold text-gray-700">
                  Registration Ends
                </label>
                <Field
                  name="appE"
                  type="date"
                  className="input input-bordered"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="eventS" className="font-semibold text-gray-700">
                  Conference Begins
                </label>
                <Field
                  name="eventS"
                  type="date"
                  className="input input-bordered"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="eventE" className="font-semibold text-gray-700">
                  Conference Ends
                </label>
                <Field
                  name="eventE"
                  type="date"
                  className="input input-bordered"
                />
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

async function post(type, category, values, user, firestoreid) {
  toast.promise(
    fetch(`/api/${type}/`, {
      method: "POST",
      headers: {
        Authorization: `${user.accessToken}`,
        category: category,
        firestoreid: firestoreid ? firestoreid : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((response) => {
      if (response.ok) {
        toast.dismiss();
        toast.success(`${values.eventN} Added`);
        toast.success(`Thanks for your contribution ${values.postedBy}`);
      } else {
        if (response.status == 401) {
          toast.dismiss();
          toast.success(`${values.eventN} Updated`);
        } else {
          toast.dismiss();
          toast.error(`Error occurred while adding ${values.eventN}`);
        }
      }
    })
  );
}

interface SessionFormProps {
  gapAmount: number;
}

export const SessionForm: React.FC<SessionFormProps> = ({ session }) => {
  const { user, username } = useContext(UserContext);

  return <DatePickerCarousel userID={user} session={session} />;
};

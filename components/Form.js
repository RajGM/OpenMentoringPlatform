import React, { useEffect, useState, useRef } from 'react';
import 'react-responsive-modal/styles.css';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { categoriesAtom, filterAtom } from './atoms';
import { useAtom } from 'jotai';
import * as Yup from 'yup';

import { UserContext } from '@lib/context';
import { useContext } from 'react';

export function Customform({ eventData, categoryTest }) {

    if (categoryTest === "hackathon") {
        return (
            <Hackathon eventData={eventData} />
        )
    } else if (categoryTest == "internship") {
        return (
            <Internship eventData={eventData} />
        )
    } else if (categoryTest == "grants") {
        return (
            <Grants eventData={eventData} />
        )
    } else if (categoryTest == "conferences") {
        return (
            <Conferences eventData={eventData} />
        )
    }

};

export const MyFormComponent = ({ eventData }) => {

    return (
        <Formik
            initialValues={{ category: 'Hackathon' }}
            onSubmit={(resetForm) => { false, resetForm() }}
        >
            {(formik) => (
                <div>
                    <div className='multiOption'>
                        <div id="my-radio-group">Category</div>
                        <div role="group" aria-labelledby="my-radio-group" className='optionDiv'>
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

                    {formik.values.category == "Grants" && (
                        <Grants eventData={null} />
                    )}

                    {formik.values.category == "Conferences" && (
                        <Conferences eventData={null} />
                    )}

                </div>
            )}
        </Formik>
    );

}

function Hackathon({ eventData }) {

    const { user, username } = useContext(UserContext);

    if (eventData == null) {

        return (
            <Formik
                initialValues={{
                    eventN: '',
                    link: '',
                    appS: '',
                    appE: '',
                    eventS: '',
                    eventE: '',
                    postedBy: '',
                    filters: '',
                }}
                onSubmit={async (values) => {

                    values.postedBy = username;

                    toast.loading(`Adding ${values.eventN} for the community`);

                    await post("add", "Hackathon", values, user);

                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div>
                            <label htmlFor="eventN">Hackathon</label>
                            <Field name="eventN" placeholder="Hackathon" validate={(value) => {
                                if (!value) {
                                    return 'Title is required';
                                }
                            }} />
                            <ErrorMessage name="eventN" />
                        </div>

                        <div>
                            <label htmlFor="link">Link</label>
                            <Field name="link" placeholder="HackthonURL" validate={(value) => {
                                if (!value) {
                                    return 'Link is required';
                                }
                            }} />
                            <ErrorMessage name="link" />
                        </div>

                        <div className='multiOption'>
                            <div id="my-radio-group">Filters</div>
                            <div role="group" aria-labelledby="my-radio-group" className='optionDiv'>
                                <label>
                                    <Field type="radio" name="filters" value="onsite" />
                                    Onsite
                                </label>
                                <label>
                                    <Field type="radio" name="filters" value="remote" />
                                    Remote
                                </label>
                                <label>
                                    <Field type="radio" name="filters" value="hybrid" />
                                    Hybrid
                                </label>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="appS">Application Starts</label>
                            <Field name="appS" type="date" validate={(value) => {
                                if (!value) {
                                    return 'Application Start Date is required';
                                }
                            }} />
                            <ErrorMessage name="appS" />
                        </div>

                        <div>
                            <label htmlFor="appE">Application Ends</label>
                            <Field name="appE" type="date" validate={(value) => {
                                if (!value) {
                                    return 'Application End Date is required';
                                }
                            }} />
                            <ErrorMessage name="appE" />
                        </div>

                        <div>
                            <label htmlFor="eventS">Hackathon Beings</label>
                            <Field name="eventS" type="date" />
                            <ErrorMessage name="eventS" />
                        </div>

                        <div>
                            <label htmlFor="eventE">Hackathon Ends</label>
                            <Field name="eventE" type="date" />
                        </div>

                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>

                        <Toaster />
                    </Form>
                )}
            </Formik>
        )

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
                    values.discordMessageID = eventData.discordMessageID ? eventData.discordMessageID : "";

                    await post("edit", "Hackathon", values, user, eventData.id);

                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div>
                            <label htmlFor="eventN">Hackathon</label>
                            <Field name="eventN" placeholder="Title" validate={(value) => {
                                if (!value) {
                                    return 'Hackathon Title is required';
                                }
                            }} />
                            <ErrorMessage name="eventN" />
                        </div>

                        <div>
                            <label htmlFor="link">Link</label>
                            <Field name="link" placeholder="Hackathon URL" validate={(value) => {
                                if (!value) {
                                    return 'Hackathon URL is required';
                                }
                            }} />
                            <ErrorMessage name="link" />
                        </div>

                        <div className='multiOption'>
                            <div id="my-radio-group">Filters</div>
                            <div role="group" aria-labelledby="my-radio-group" className='optionDiv'>
                                <label>
                                    <Field type="radio" name="filters" value="onsite" />
                                    Onsite
                                </label>
                                <label>
                                    <Field type="radio" name="filters" value="remote" />
                                    Remote
                                </label>
                                <label>
                                    <Field type="radio" name="filters" value="hybrid" />
                                    Hybrid
                                </label>
                            </div>
                        </div>

                        <label htmlFor="appS">Registration Begins</label>
                        <Field name="appS" type="date" validate={(value) => {
                            if (!value) {
                                return 'Application Start date is required';
                            }
                        }} />

                        <label htmlFor="appE">Registration Ends</label>
                        <Field name="appE" type="date" validate={(value) => {
                            if (!value) {
                                return 'Application End date is required';
                            }
                        }} />

                        <label htmlFor="eventS">Conference Beings</label>
                        <Field name="eventS" type="date" />

                        <label htmlFor="eventE">Conference Ends</label>
                        <Field name="eventE" type="date" />

                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>

                        <Toaster />
                    </Form>
                )}
            </Formik>
        )

    }

}

function Internship({ eventData }) {

    const { user, username } = useContext(UserContext);

    if (eventData == null) {

        return (
            <Formik
                initialValues={{
                    eventN: '',
                    link: '',
                    appS: '',
                    appE: '',
                    eventS: '',
                    eventE: '',
                    filters: '',
                    postedBy: '',
                }}
                onSubmit={async (values) => {

                    values.postedBy = username;

                    toast.loading(`Adding ${values.eventN} for the community`);

                    await post("add", "Internship", values, user);

                }}
            >
                {({ isSubmitting }) => (
                    <Form>

                        <div>
                            <label htmlFor="eventN">Company</label>
                            <Field name="eventN" placeholder="Internship" validate={(value) => {
                                if (!value) {
                                    return 'Internship Title is required';
                                }
                            }} />
                            <ErrorMessage name="eventN" />
                        </div>

                        <div>
                            <label htmlFor="link">Link</label>
                            <Field name="link" placeholder="Link to application" validate={(value) => {
                                if (!value) {
                                    return 'Internship URL is required';
                                }
                            }} />
                            <ErrorMessage name="link" />
                        </div>

                        <div className='multiOption'>
                            <div id="my-radio-group">Type</div>
                            <div role="group" aria-labelledby="my-radio-group" className='optionDiv'>
                                <label>
                                    <Field type="radio" name="filters" value="remote" />
                                    Onsite
                                </label>
                                <label>
                                    <Field type="radio" name="filters" value="remote" />
                                    Remote
                                </label>
                                <label>
                                    <Field type="radio" name="filters" value="hybrid" />
                                    Hybrid
                                </label>
                            </div>
                        </div>

                        <div>
                            <div>
                                <label htmlFor="appS">Application Starts</label>
                                <Field name="appS" type="date" validate={(value) => {
                                    if (!value) {
                                        return 'Application Start date is required';
                                    }
                                }} />
                                <ErrorMessage name="appS" />
                            </div>
                            <div>
                                <label htmlFor="appE">Application Ends</label>
                                <Field name="appE" type="date" validate={(value) => {
                                    if (!value) {
                                        return 'Application End date is required';
                                    }
                                }} />
                            </div>
                        </div>

                        <div>
                            <div>
                                <label htmlFor="eventS">Internship Beings</label>
                                <Field name="eventS" type="date" />
                                <ErrorMessage name="eventS" />
                            </div>
                            <div>
                                <label htmlFor="eventE">Internship Ends</label>
                                <Field name="eventE" type="date" />
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>

                        <Toaster />
                    </Form>
                )}
            </Formik>
        )

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
                    values.discordMessageID = eventData.discordMessageID ? eventData.discordMessageID : "";

                    toast.loading(`Adding ${values.eventN} for the community`);

                    await post("edit", "Internship", values, user, eventData.id);

                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <label htmlFor="eventN">Company</label>
                        <Field name="eventN" placeholder="" validate={(value) => {
                            if (!value) {
                                return 'Company title is required';
                            }
                        }} />

                        <label htmlFor="link">Link</label>
                        <Field name="link" placeholder="hackHar.com" validate={(value) => {
                            if (!value) {
                                return 'Internship application URL is required';
                            }
                        }} />

                        <div id="my-radio-group">Picked</div>
                        <div role="group" aria-labelledby="my-radio-group">
                            <label>
                                <Field type="radio" name="filters" value="onsite" />
                                Onsite
                            </label>
                            <label>
                                <Field type="radio" name="filters" value="remote" />
                                Remote
                            </label>
                            <label>
                                <Field type="radio" name="filters" value="hybrid" />
                                Hybrid
                            </label>
                        </div>

                        <label htmlFor="appS">Application Starts</label>
                        <Field name="appS" type="date" validate={(value) => {
                            if (!value) {
                                return 'Application Start date is required';
                            }
                        }} />

                        <label htmlFor="appE">Application Ends</label>
                        <Field name="appE" type="date" validate={(value) => {
                            if (!value) {
                                return 'Application End date is required';
                            }
                        }} />

                        <label htmlFor="eventS">Hackathon Beings</label>
                        <Field name="eventS" type="date" />

                        <label htmlFor="eventE">Hackathon Ends</label>
                        <Field name="eventE" type="date" />

                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>

                        <Toaster />
                    </Form>
                )}
            </Formik>
        )

    }




}

function Grants({ eventData }) {

    const { user, username } = useContext(UserContext);

    if (eventData == null) {

        return (
            <Formik
                initialValues={{
                    eventN: '',
                    link: '',
                    appS: '',
                    appE: '',
                    filters: '',
                    postedBy: '',
                }}
                //if edit then set initial values to eventData
                onSubmit={async (values) => {

                    values.postedBy = username;

                    toast.loading(`Adding ${values.eventN} for the community`);

                    await post("add", "Grants", values, user);

                }}
            >
                {({ isSubmitting }) => (
                    <Form>

                        <div>
                            <label htmlFor="eventN">Company</label>
                            <Field name="eventN" placeholder="Grant Title" validate={(value) => {
                                if (!value) {
                                    return 'Title is required';
                                }
                            }} />
                            <ErrorMessage name="eventN" />
                        </div>

                        <div>
                            <label htmlFor="link">Link</label>
                            <Field name="link" placeholder="Application link" validate={(value) => {
                                if (!value) {
                                    return 'Link to application is required';
                                }
                            }} />
                            <ErrorMessage name="link" />
                        </div>

                        <div className='multiOption'>
                            <div id="my-radio-group">Type</div>
                            <div role="group" aria-labelledby="my-radio-group" className='optionDiv'>
                                <label>
                                    <Field type="radio" name="filters" value="travel" />
                                    Travel
                                </label>
                                <label>
                                    <Field type="radio" name="filters" value="course" />
                                    Course
                                </label>
                                <label>
                                    <Field type="radio" name="filters" value="conference" />
                                    Conference
                                </label>
                            </div>
                        </div>

                        <div>
                            <div>
                                <label htmlFor="appS">Application Starts</label>
                                <Field name="appS" type="date" validate={(value) => {
                                    if (!value) {
                                        return 'Application Start date is required';
                                    }
                                }} />
                                <ErrorMessage name="appS" />
                            </div>
                            <div>
                                <label htmlFor="appE">Application Ends</label>
                                <Field name="appE" type="date" validate={(value) => {
                                    if (!value) {
                                        return 'Application End date is required';
                                    }
                                }} />
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>

                        <Toaster />
                    </Form>
                )}
            </Formik>
        )

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
                    values.discordMessageID = eventData.discordMessageID ? eventData.discordMessageID : "";

                    toast.loading(`Adding ${values.eventN} for the community`);

                    await post("edit", "Grants", values, user, eventData.id);

                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <label htmlFor="eventN">Grant</label>
                        <Field name="eventN" placeholder="" validate={(value) => {
                            if (!value) {
                                return 'Grant title is required';
                            }
                        }} />

                        <label htmlFor="link">Link</label>
                        <Field name="link" placeholder="hackHar.com" validate={(value) => {
                            if (!value) {
                                return 'Grant application url is required';
                            }
                        }} />

                        <div id="my-radio-group">Picked</div>
                        <div role="group" aria-labelledby="my-radio-group">
                            <label>
                                <Field type="radio" name="filters" value="travel" />
                                Travel
                            </label>
                            <label>
                                <Field type="radio" name="filters" value="course" />
                                Course
                            </label>
                            <label>
                                <Field type="radio" name="filters" value="conference" />
                                Conference
                            </label>
                        </div>

                        <label htmlFor="appS">Application Starts</label>
                        <Field name="appS" type="date" validate={(value) => {
                            if (!value) {
                                return 'Application Start date is required';
                            }
                        }} />

                        <label htmlFor="appE">Application Ends</label>
                        <Field name="appE" type="date" validate={(value) => {
                            if (!value) {
                                return 'Application End date is required';
                            }
                        }} />

                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>

                        <Toaster />
                    </Form>
                )}
            </Formik>
        )

    }

}

function Conferences({ eventData }) {

    const { user, username } = useContext(UserContext);

    if (eventData == null) {

        return (
            <Formik
                initialValues={{
                    eventN: '',
                    link: '',
                    appS: '',
                    appE: '',
                    eventS: '',
                    eventE: '',
                    filters: '',
                    postedBy: '',
                }}
                onSubmit={async (values) => {

                    values.postedBy = username;

                    toast.loading(`Adding ${values.eventN} for the community`);

                    await post("add", "Conferences", values, user);

                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div>
                            <label htmlFor="eventN">Conference Title</label>
                            <Field name="eventN" placeholder="Title" validate={(value) => {
                                if (!value) {
                                    return 'Conference Title is required';
                                }
                            }} />
                            <ErrorMessage name="eventN" />
                        </div>

                        <div>
                            <label htmlFor="link">Link</label>
                            <Field name="link" placeholder="Conference URL" validate={(value) => {
                                if (!value) {
                                    return 'Conference url is required';
                                }
                            }} />
                            <ErrorMessage name="link" />
                        </div>

                        <div className='multiOption'>
                            <div id="my-radio-group">Picked </div>
                            <div role="group" aria-labelledby="my-radio-group" className='optionDiv'>
                                <label>
                                    <Field type="radio" name="filters" value="design" />
                                    Design
                                </label>
                                <label>
                                    <Field type="radio" name="filters" value="launch event" />
                                    Launch Event
                                </label>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="appS">Registration Starts</label>
                            <Field name="appS" type="date" validate={(value) => {
                                if (!value) {
                                    return 'Registration Start date is required';
                                }
                            }} />
                            <ErrorMessage name="appS" />
                        </div>

                        <div>
                            <label htmlFor="appE">Registration Ends</label>
                            <Field name="appE" type="date" validate={(value) => {
                                if (!value) {
                                    return 'Registration End date is required';
                                }
                            }} />
                        </div>

                        <div>
                            <label htmlFor="eventS">Conference Beings</label>
                            <Field name="eventS" type="date" />
                            <ErrorMessage name="eventS" />
                        </div>

                        <div>
                            <label htmlFor="eventE">Conference Ends</label>
                            <Field name="eventE" type="date" />
                        </div>

                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>

                        <Toaster />
                    </Form>
                )}
            </Formik>
        )


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
                    values.discordMessageID = eventData.discordMessageID ? eventData.discordMessageID : "";

                    toast.loading(`Adding ${values.eventN} for the community`);

                    await post("edit", "Conferences", values, user, eventData.id);

                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div>
                            <label htmlFor="eventN">Conference Title</label>
                            <Field name="eventN" placeholder="Title" validate={(value) => {
                                if (!value) {
                                    return 'Conference Title is required';
                                }
                            }} />
                            <ErrorMessage name="eventN" />
                        </div>

                        <div>
                            <label htmlFor="link">Link</label>
                            <Field name="link" placeholder="Conference URL" validate={(value) => {
                                if (!value) {
                                    return 'Conference URL is required';
                                }
                            }} />
                            <ErrorMessage name="link" />
                        </div>

                        <div id="my-radio-group">Picked</div>
                        <div role="group" aria-labelledby="my-radio-group">
                            <label>
                                <Field type="radio" name="filters" value="design" />
                                Design
                            </label>
                            <label>
                                <Field type="radio" name="filters" value="launch event" />
                                Launch Event
                            </label>
                        </div>

                        <label htmlFor="appS">Registration Begins</label>
                        <Field name="appS" type="date" validate={(value) => {
                            if (!value) {
                                return 'Application Start date is required';
                            }
                        }} />

                        <label htmlFor="appE">Registration Ends</label>
                        <Field name="appE" type="date" validate={(value) => {
                            if (!value) {
                                return 'Application End date is required';
                            }
                        }} />

                        <label htmlFor="eventS">Conference Beings</label>
                        <Field name="eventS" type="date" />

                        <label htmlFor="eventE">Conference Ends</label>
                        <Field name="eventE" type="date" />

                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                        <Toaster />
                    </Form>
                )}
            </Formik>
        )

    }

}

async function post(type, category, values, user, firestoreid) {

    toast.promise(
        fetch(`/api/${type}/`, {
            method: 'POST',
            headers: {
                Authorization: `${user.accessToken}`,
                category: category,
                firestoreid: firestoreid ? firestoreid : "",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        }).then(response => {
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

//Event DS
/*
    eventN: '',
    link: '',
    appS: '',
    appE: '',
    eventS: '',
    eventE: '',
    filters: '',
    postedBy: '',
*/

//validation schema
/*
const hackathonValidationSchema = Yup.object({
    eventN: Yup.string().min(4, 'Too short').max(30, 'Hackathon Name only').required('Event name is required'),
    link: Yup.string().min(3, 'Shorten URLs not allowed').max(60, 'Hackathon HomePage Link only').url('Please only homepage link'),
    appS: Yup.date().required('Application start date is required'),
    appE: Yup.date(),
    eventS: Yup.date(),
    eventE: Yup.date(),
    filters: Yup.string(),
    postedBy: Yup.string().required('Posted by is required')
});
*/
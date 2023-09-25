import React, { useEffect, useState } from 'react';
import 'react-responsive-modal/styles.css';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { auth, firestore } from '@lib/firebase';

import { useContext } from 'react';
import { UserContext } from '@lib/context';

export function Social() {

    const { user, username } = useContext(UserContext);
    const [eventData, seteventData] = useState(false);

    useEffect(() => {
        if (!username) return;
        firestore.collection('usernames').doc(username).get().then((doc) => {
            seteventData(doc.data());
        });
    }, [username]);

    return (
        <div className='flex items-center justify-center'> 
            <Formik
                initialValues={{
                    discord: '',
                    telegram: '',
                    twitter: '',
                    instagram: '',
                }}

                onSubmit={async (values) => {
                    toast.promise(firestore.collection('usernames').doc(username).update({
                        discord: values.discord,
                        telegram: values.telegram,
                        twitter: values.twitter,
                        instagram: values.instagram,
                    }), {
                        loading: 'Adding socials...',
                        success: <b>Added socials!</b>,
                        error: <b>Failed to add socials</b>,
                    });
                }}
            >
                {({ isSubmitting, values }) => (
                    <form className="flex flex-col gap-4 text-center w-72 p-4 border border-black rounded-lg shadow-lg">
                        <div className="flex items-center space-x-2 bg-white border border-black rounded-md">
                            <div>Discord:</div>
                            <Field
                                name="discord"
                                placeholder={eventData ? eventData.discord : 'username'}
                                className="text-xl p-2 w-full "
                                validate={(value) => { }}
                            />
                        </div>

                        <div className="flex items-center space-x-2 bg-white border border-black rounded-md">
                            <div>Telegram:</div>
                            <Field
                                name="telegram"
                                placeholder={eventData ? (eventData.telegram ? eventData.telegram : 'id') : 'id'}
                                className="text-xl p-2 w-full"
                                validate={(value) => { }}
                            />
                        </div>

                        <div className="flex items-center space-x-2 bg-white border border-black rounded-md">
                            <div>Twitter.com/</div>
                            <Field
                                name="twitter"
                                placeholder={eventData ? (eventData.twitter ? eventData.twitter : 'handle') : 'handle'}
                                className="text-xl p-2 w-full"
                                validate={(value) => { }}
                            />
                        </div>

                        <div className="flex items-center space-x-2 bg-white border border-black rounded-md">
                            <div>Instagram.com/</div>
                            <Field
                                name="instagram"
                                placeholder={eventData ? (eventData.instagram ? eventData.instagram : 'handle') : 'handle'}
                                className="text-xl p-2 w-full"
                                validate={(value) => { }}
                            />
                        </div>

                        <div className="mx-auto">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-32 h-10 text-lg bg-blue-500 text-white rounded-md"
                            >
                                Save
                            </button>
                        </div>

                        <Toaster />
                    </form>
                )}
            </Formik>
        </div>
    )

}

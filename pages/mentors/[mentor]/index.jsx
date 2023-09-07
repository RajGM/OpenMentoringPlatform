"use client";
import { firestore } from "@lib/firebase";
import { useEffect, useState } from "react";
import MentorFeed from "@components/MentorFeed";
import Image from "next/image";

export default function Mentors() {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          height: "800px",
        }}
      >
        <div style={{ width: "25%" }}>
          <div
            href="#"
            className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8"
          >
            <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

            <div className="sm:flex sm:justify-between sm:gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                  Building a SaaS product as a software developer
                </h3>

                <p className="mt-1 text-xs font-medium text-gray-600">
                  By John Doe
                </p>
              </div>

              <div className="hidden sm:block sm:shrink-0">
                <img
                  alt="Paul Clapton"
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
                  className="h-16 w-16 rounded-lg object-cover shadow-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <p className="max-w-[40ch] text-sm text-gray-500">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. At
                velit illum provident a, ipsa maiores deleniti consectetur nobis
                et eaque.
              </p>
            </div>

            <dl className="mt-6 flex gap-4 sm:gap-6">
              <div className="flex flex-col-reverse">
                <dt className="text-sm font-medium text-gray-600">Published</dt>
                <dd className="text-xs text-gray-500">31st June, 2021</dd>
              </div>

              <div className="flex flex-col-reverse">
                <dt className="text-sm font-medium text-gray-600">Reading time</dt>
                <dd className="text-xs text-gray-500">3 minute</dd>
              </div>
            </dl>
            <div style={{ height: "20px" }}></div>
            <div>
              <a
                className="group relative inline-block text-sm font-medium text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                href="#"
              >
                <span className="absolute inset-0 translate-x-0 translate-y-0 bg-indigo-600 transition-transform group-hover:translate-y-0.5 group-hover:translate-x-0.5"></span>

                <span className="relative block border border-current bg-white px-8 py-3">
                  Schedule a meeting
                </span>
              </a>
            </div>
            <div style={{ height: "20px" }}></div>
            <div>
              <div
                className="relative w-screen max-w-sm border border-gray-600 bg-gray-100 px-4 py-8 sm:px-6 lg:px-8"
                aria-modal="true"
                role="dialog"
                tabindex="-1"
              >
                <div className="mt-4 space-y-6">
                  <ul className="space-y-4">
                    <li className="flex items-center gap-4">
                      <img
                        src="https://www.insead.edu/profiles/custom/insead/themes/insead_core/images/logo.png"
                        alt=""
                        className="h-16 w-16 rounded object-cover"
                      />

                      <div>
                        <h3 className="text-sm text-gray-900">
                          Insead Business School
                        </h3>

                        <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                          <div>
                            <dt className="inline">MBA</dt>
                          </div>
                        </dl>

                        <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                          <div>
                            <dd className="inline">Year:2010-2014</dd>
                          </div>
                        </dl>
                      </div>
                    </li>

                    <li className="flex items-center gap-4">
                      <svg
                        width="70"
                        height="32"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 73 38"
                      >
                        <path
                          d="M28 0v31h8V0h37v38h-7V7h-8v31h-7V7h-8v31H21V7h-7v31H7V7H0V0h28z"
                          fill="currentColor"
                        ></path>
                      </svg>

                      <div>
                        <h3 className="text-sm text-gray-900">
                          Technical University of Munich
                        </h3>

                        <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                          <div>
                            <dt className="inline">MS in CS</dt>
                          </div>
                        </dl>

                        <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                          <div>
                            <dd className="inline">Year:2008-2010</dd>
                          </div>
                        </dl>
                      </div>
                    </li>

                    <li className="flex items-center gap-4">
                      <img
                        src="data:image/png;base64,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"
                        alt=""
                        className="h-16 w-16 rounded object-cover"
                      />

                      <div>
                        <h3 className="text-sm text-gray-900">
                          University of Cambridge
                        </h3>

                        <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                          <div>
                            <dt className="inline">BSs in CS</dt>
                          </div>

                          <div>
                            <dt className="inline">Year:</dt>
                            <dd className="inline">2004-2008</dd>
                          </div>
                        </dl>
                      </div>
                    </li>
                  </ul>

                  <div className="space-y-4 text-center">
                    <a
                      href="#"
                      className="inline-block text-sm text-gray-500 underline underline-offset-4 transition hover:text-gray-600"
                    >
                      Portfolio
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div></div>
        </div>
        <div>
          <section>
            <div className="max-w-screen-xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
              <header className="text-center">
                <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                  Investments
                </h2>

                <p className="max-w-md mx-auto mt-4 text-gray-500">
                  Love to invest in edTech, DeepTech space with average check
                  size of $200k if the product has atleast 10k daily active
                  users fugit natus?
                </p>
              </header>

              <ul className="grid gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-4">
                <li>
                  <article className="flex items-end justify-between rounded-lg border border-gray-100 bg-white p-6">
                    <div className="flex items-center gap-4">
                      <span className="hidden rounded-full bg-gray-100 p-2 text-gray-600 sm:block">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </span>

                      <div>
                        <p className="text-sm text-gray-500">2018 Round A</p>

                        <p className="text-2xl font-medium text-gray-900">
                          Meta
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex gap-2 rounded bg-green-100 p-1 text-green-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>

                      <span className="text-xs font-medium"> $200k </span>
                    </div>
                  </article>
                </li>

                <li>
                  <article className="flex items-end justify-between rounded-lg border border-gray-100 bg-white p-6">
                    <div className="flex items-center gap-4">
                      <span className="hidden rounded-full bg-gray-100 p-2 text-gray-600 sm:block">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </span>

                      <div>
                        <p className="text-sm text-gray-500">2020 Early Stage</p>

                        <p className="text-2xl font-medium text-gray-900">
                          Nothing.T
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex gap-2 rounded bg-green-100 p-1 text-green-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>

                      <span className="text-xs font-medium"> $500k </span>
                    </div>
                  </article>
                </li>

                <li>
                  <article className="flex items-end justify-between rounded-lg border border-gray-100 bg-white p-6">
                    <div className="flex items-center gap-4">
                      <span className="hidden rounded-full bg-gray-100 p-2 text-gray-600 sm:block">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </span>

                      <div>
                        <p className="text-sm text-gray-500">2021 Round C</p>

                        <p className="text-2xl font-medium text-gray-900">
                          Alpha
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex gap-2 rounded bg-green-100 p-1 text-green-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>

                      <span className="text-xs font-medium"> $400k </span>
                    </div>
                  </article>
                </li>

                <li>
                  <article className="flex items-end justify-between rounded-lg border border-gray-100 bg-white p-6">
                    <div className="flex items-center gap-4">
                      <span className="hidden rounded-full bg-gray-100 p-2 text-gray-600 sm:block">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </span>

                      <div>
                        <p className="text-sm text-gray-500">2022 Round C</p>

                        <p className="text-2xl font-medium text-gray-900">
                          Meta
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex gap-2 rounded bg-green-100 p-1 text-green-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>

                      <span className="text-xs font-medium"> $800k </span>
                    </div>
                  </article>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

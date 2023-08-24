"use client";
import { firestore } from "@lib/firebase";
import { useEffect, useState } from "react";
import MentorFeed from "@components/MentorFeed/MentorFeed";

const data = [
  {
    id: 1,
    message: "Hart Hagerty from United States",
  },
  {
    id: 2,
    message: "THis is left message",
  },
];

export default function Chat() {
  return (
    <>
      <div
        className="join"
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          minHeight: "90vh",
        }}
      >
        <div
          className="join join-vertical"
          style={{ backgroundColor: "pink", width: "20%" }}
        >
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Chats</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src="/next.svg"
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">Hart Hagerty</div>
                      <div className="text-sm opacity-50">United States</div>
                    </div>
                  </div>
                </td>
              </tr>
              {/* row 2 */}
              <tr>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src="/next.svg"
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">Hart Hagerty</div>
                      <div className="text-sm opacity-50">United States</div>
                    </div>
                  </div>
                </td>
              </tr>
              {/* row 3 */}
              <tr>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src="/next.svg"
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">Hart Hagerty</div>
                      <div className="text-sm opacity-50">United States</div>
                    </div>
                  </div>
                </td>
              </tr>
              {/* row 4 */}
              <tr>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src="/next.svg"
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">Hart Hagerty</div>
                      <div className="text-sm opacity-50">United States</div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            {/* foot */}
          </table>
        </div>
        <ChatWindow dataArr={data} />
      </div>
    </>
  );
}

const ChatInput = () => {
  return (
    <div className="relative">
      <label htmlFor="UserEmail" className="sr-only">
        Chat
      </label>

      <input
        type="text"
        id="UserEmail"
        placeholder="Amazing Chats ..."
        className="w-full rounded-md border-gray-200 pe-10 shadow-sm sm:text-sm"
      />

      <span className="pointer-events-none absolute inset-y-0 end-0 grid w-10 place-content-center text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M5.404 14.596A6.5 6.5 0 1116.5 10a1.25 1.25 0 01-2.5 0 4 4 0 10-.571 2.06A2.75 2.75 0 0018 10a8 8 0 10-2.343 5.657.75.75 0 00-1.06-1.06 6.5 6.5 0 01-9.193 0zM10 7.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </div>
  );
};

const ChatWindow = ({dataArr}) => {
  return (
    <div
      className="overflow-x-auto"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "80%",
        backgroundColor: "lightblue",
        padding: "10px",
      }}
    >
      <div style={{ height: "90%", width: "100%" }}>
        {dataArr.map((item) => (
          <div
            key={item.id}
            className={item.id === 1 ? "chat chat-start" : "chat chat-end"}
          >
            <div className="chat-bubble">{item.message}</div>
          </div>
        ))}

      </div>

      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <input
              type="text"
              id="UserEmail"
              placeholder="Amazing Chats ..."
              className="w-full rounded-md border-gray-200 pe-10 shadow-sm sm:text-sm"
              style={{
                width: "400px",
                minHeight: "40px",
                padding: "10px",
                border: "1px solid black",
                textAlign: "center",
              }}
            />
            
          </div>
        </div>
      </div>
    </div>
  );
};

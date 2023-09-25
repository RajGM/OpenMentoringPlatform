// @ts-nocheck

import React, { useState, useEffect } from "react";
import { firestore, getUserWithUsername, getUserWithId } from "@lib/firebase";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { UserContext } from "@lib/context";
import { useContext } from "react";

// someComponent.tsx or someOtherFile.ts
import {
  DatePickerCarouselProps,
  Slot,
  FormData,
  SlotType,
  ICSData,
} from "@lib/types"; // adjust the path as necessary

// Now you can use these types and interfaces in your component or any other logic

import {
  getDayOfWeek,
  formatDate,
  getYearMonthDate,
  getAvailableSlots,
  createICS,
  to24HourFormat,
  breakDownSlots,
} from "@lib/utils";

const DatePickerCarousel: React.FC<DatePickerCarouselProps> = ({
  userID,
  session,
}) => {
  console.log("userID from DAte pick:", userID);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const daysToShow = 7; // Number of days to show in the carousel
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null); // Initialize with null or default value

  const { user, username } = useContext(UserContext);
  const router = useRouter();

  // Function to generate date items
  const generateDateItems = () => {
    const dateItems = [];

    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      const formattedDate = formatDate(date);
      const dayOfWeek = getDayOfWeek(date);

      dateItems.push(
        <div
          key={formattedDate}
          className={`date-item ${
            formattedDate === selectedDate ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => fetchDataFromFirestore(dayOfWeek, formattedDate, date)}
        >
          <div className="date">{formattedDate}</div>
          <div className="day">{dayOfWeek}</div>
        </div>
      );
    }

    return dateItems;
  };

  // Function to handle clicking the next button
  const handleNextClick = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  // Function to fetch available slots from Firestore
  const fetchDataFromFirestore = async (
    dayOfWeek: any,
    formattedDate: any,
    date: any
  ) => {
    setSelectedDate(formattedDate);

    try {
      const fullDate = getYearMonthDate(date);

      const docRef1 = firestore
        .collection("users")
        .doc(userID.id)
        .collection("availability")
        .doc(dayOfWeek);
      const docRef2 = firestore
        .collection("users")
        .doc(userID.id)
        .collection("booking")
        .doc(String(fullDate));

      // Fetch both documents in parallel
      const [doc, doc2] = await Promise.all([docRef1.get(), docRef2.get()]);

      if (doc.exists) {
        const data = doc.data();
        const data2 = doc2.data();

        let freeSlots = data?.slots;

        if (data2) {
          freeSlots = getAvailableSlots(data?.slots, data2.slots);
        }

        // Break down the original slots with the specified gapAmount
        const brokenSlots = breakDownSlots(freeSlots, session.duration);

        // Set the available slots in state
        setAvailableSlots(brokenSlots);
        setShowForm(false);
      } else {
        // If no data is available, reset the available slots
        setAvailableSlots([]);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
    }
  };

  const handleButtonClick = (index: number): void => {
    const clickedSlot: SlotType = availableSlots[index];
    setSelectedSlot(clickedSlot);
    setShowForm(true);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    // Update the form data when input fields change
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function convertSelectedDate(
    selectedDate: string,
    currentDateFormatted: string
  ): string {
    // Extract the year from currentDateFormatted
    const year = currentDateFormatted.substring(0, 4);

    // Split the selectedDate to get month and day
    const [month, day] = selectedDate.split("/");

    // Return the combined date in YYMMDD format
    return `${year}${month}${day}`;
  }

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const loadingToast = toast.loading("Booking...");

    const formattedSelectedDate = convertSelectedDate(
      selectedDate,
      getYearMonthDate(currentDate)
    );
    const userDoc = await getUserWithId(userID.id);
    const userMeetingLink = userDoc ? userDoc.meetingLink : "Online Meeting"; // Default to "Online Meeting" if no meetingLink is found

    // Create a new object with formData, selectedDate, and selectedSlot
    const eventForICS = {
      start: `${formattedSelectedDate}T${to24HourFormat(
        selectedSlot.startTime
      )}:00+05:30`,
      end: `${formattedSelectedDate}T${to24HourFormat(
        selectedSlot.endTime
      )}:00+05:30`,
      summary: "Meeting with " + [userDoc.displayName, username].join(", "),
      description: session.title,
      location: userMeetingLink,
      date: formattedSelectedDate,
      startTime: selectedSlot?.startTime,
      endTime: selectedSlot?.endTime,
      enteredEmail: formData.email,
    };

    // Make a request to the /book endpoint with the updated formData
    try {
      const response = await fetch("api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: user?.accessToken,
        },
        body: JSON.stringify({ ...eventForICS, mentor: username }),
      });

      toast.dismiss(loadingToast);
      router.push('/');

      if (response.ok) {
        // Handle successful booking, e.g., show a confirmation message
        toast.success("Booking successful");
      } else {
        // Handle booking error, e.g., show an error message
        toast.error("Booking failed");
      }
    } catch (error) {
      toast.dismiss(loadingToast); // Dismiss the loading toast in case of an error
      toast.error("Error booking: " + error);
    }

    // Reset the form and hide it
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
    });
    setShowForm(false);
  };

  useEffect(() => {
    // Set the initial date to today
    setCurrentDate(new Date());
  }, [availableSlots]);

  return (
    <div className="date-picker space-y-4">
      <div className="date-picker-inner space-y-4">{generateDateItems()}</div>
      <button className="btn btn-primary" onClick={handleNextClick}>
        Next
      </button>

      {/* Display available slots */}
      <div className="available-slots">
        {availableSlots.length > 0 ? (
          <ul>
            {availableSlots.map((slot, index) => (
              <li key={index}>
                <button
                  className={`btn btn-outline ${
                    selectedSlot === slot ? "bg-blue-500 text-white" : ""
                  }`}
                  onClick={() => handleButtonClick(index)}
                >
                  {slot.startTime}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-red-500">No available slots for this date.</p>
        )}
      </div>

      {/* Display the form when showForm is true */}
      {showForm && (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input input-bordered"
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input input-bordered"
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700">Phone Number (optional):</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="input input-bordered"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Confirm Booking
          </button>
        </form>
      )}
    </div>
  );
};

export default DatePickerCarousel;

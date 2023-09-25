import React, { useState, useEffect } from "react";
import { firestore } from "@lib/firebase";
import { useRouter } from "next/router";

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
  gapAmount,
}) => {
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

  console.log("userID:", userID);

  const router = useRouter();
  const { username } = router.query;
  console.log("username Calendar:", username);

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
          className="date-item"
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
  const fetchDataFromFirestore = async (dayOfWeek, formattedDate, date) => {
    // Replace 'userID' with the actual user ID
    setSelectedDate(formattedDate);

    try {
      console.log("userID:", userID);

      const fullDate = getYearMonthDate(date);

      console.log(fullDate);

      const docRef1 = firestore
        .collection("users")
        .doc(userID.uid)
        .collection("availability")
        .doc(dayOfWeek);
      const docRef2 = firestore
        .collection("users")
        .doc(userID.uid)
        .collection("booking")
        .doc(String(fullDate));

      // Fetch both documents in parallel
      const [doc, doc2] = await Promise.all([docRef1.get(), docRef2.get()]);

      if (doc.exists) {
        const data = doc.data();
        const data2 = doc2.data();
        console.log("data:", data);
        console.log("data2:", data2);

        let freeSlots = data.slots;

        if (data2) {
          freeSlots = getAvailableSlots(data.slots, data2.slots);
        }

        // Break down the original slots with the specified gapAmount
        const brokenSlots = breakDownSlots(freeSlots, gapAmount);

        // Set the available slots in state
        setAvailableSlots(brokenSlots);
      } else {
        // If no data is available, reset the available slots
        setAvailableSlots([]);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update the form data when input fields change
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function sendEmailWithInvite(
    recipients: string[],
    htmlBody: string,
    subject: string,
    plainBody: string,
    icsString: string
  ): void {
    const base64Ics = btoa(icsString);
    const docRef = firestore.collection("mail");

    const emailData = {
      to: recipients,
      message: {
        html: htmlBody,
        subject: subject,
        text: plainBody,
        attachments: [
          {
            filename: "invite.ics",
            content: base64Ics,
            encoding: "base64",
            type: "text/calendar",
          },
        ],
      },
    };

    docRef.add(emailData);
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("currentDate:", currentDate);
    // Create a new object with formData, selectedDate, and selectedSlot
    const formDataWithDetails = {
      date: getYearMonthDate(currentDate), // Add the selectedDate
      attendees: [userID.displayName, formData.name],
      email: [userID.email, formData.email],
      startTime: to24HourFormat(selectedSlot.startTime), // Add the selectedSlot start time
      endTime: to24HourFormat(selectedSlot.endTime), // Add the selectedSlot end time
    };

    console.log("Form data with details:", formDataWithDetails);

    const eventTest = {
      start: `${formDataWithDetails.date}T${formDataWithDetails.startTime}:00+05:30`, // Start time in YYMMDDTHHmmssZ format
      end: `${formDataWithDetails.date}T${formDataWithDetails.endTime}:00+05:30`, // End time in YYMMDDTHHmmssZ format
      summary: "Meeting with " + formDataWithDetails.attendees.join(", "),
      description: "Mentoring Session",
      location: "Online Meeting", // You can set your own location
    };

    const icsString = createICS(eventTest);
    // console.log("icsString:", icsString);

    // const event2 = {
    //   start: "20230921T100000Z", // Start time in YYYYMMDDTHHmmssZ format
    //   end: "20230921T110000Z", // End time in YYYYMMDDTHHmmssZ format
    //   summary: "Meeting with John",
    //   description: "Discuss project updates",
    //   location: "Conference Room A",
    // };

    // console.log(createICS(event2))

    // const event = {
    //   start: "20230921T100000Z", // Start time in YYYYMMDDTHHmmssZ format
    //   end: "20230921T110000Z", // End time in YYYYMMDDTHHmmssZ format
    //   summary: "Meeting with John",
    //   description: "Discuss project updates",
    //   location: "Conference Room A",
    // };

    // const icsString = createICS(event);

    const recipientsArray = ["rajgmsocial19@gmail.com"];
    const htmlBody = "Code HTML body";
    const subjectText = "Hello subject";
    const plainBodyText = "This is a plain email body";

    sendEmailWithInvite(
      recipientsArray,
      htmlBody,
      subjectText,
      plainBodyText,
      icsString
    );

    return;

    // Make a request to the /book endpoint with the updated formData
    try {
      const response = await fetch("/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithDetails),
      });

      if (response.ok) {
        // Handle successful booking, e.g., show a confirmation message
        console.log("Booking successful");
      } else {
        // Handle booking error, e.g., show an error message
        console.error("Booking failed");
      }
    } catch (error) {
      console.error("Error booking:", error);
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
                  className="btn btn-outline"
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

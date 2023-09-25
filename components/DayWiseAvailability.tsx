// @ts-nocheck

import { useState, useContext, useEffect } from "react";
import { firestore } from "@lib/firebase";
import { UserContext } from "@lib/context";

import { TimeSlot, Availability, TimeSlots, Error } from "@lib/types";

import { toast } from 'react-hot-toast';

const DayWiseAvailability = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Availability>({});
  const [timeSlots, setTimeSlots] = useState<TimeSlots>({});
  const [error, setError] = useState<Error>({});
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const { user, username } = useContext(UserContext);

  const addSlot = (day: string) => {
    if (
      !timeSlots[day] ||
      !timeSlots[day].startTime ||
      !timeSlots[day].endTime
    ) {
      setError({ ...error, [day]: "Please provide valid time slots." });
      return;
    }

    const startTime = new Date(`1970-01-01T${timeSlots[day].startTime}`);
    const endTime = new Date(`1970-01-01T${timeSlots[day].endTime}`);

    if (endTime <= startTime) {
      setError({
        ...error,
        [day]: "End time must be greater than start time.",
      });
      return;
    }

    setError({ ...error, [day]: "" });

    const newSlot = {
      startTime: startTime.toTimeString().slice(0, 5),
      endTime: endTime.toTimeString().slice(0, 5),
    };

    // Check for overlapping slots and merge if needed
    const overlappingSlots = availability[day] || [];
    let mergedSlots:Availability = [];
    let addedNewSlot = false;

    const slotsToRemove = []; // Store slots to remove

    for (const slot of overlappingSlots) {
      const slotStartTime = new Date(`1970-01-01T${slot.startTime}`);
      const slotEndTime = new Date(`1970-01-01T${slot.endTime}`);

      // Check for overlap
      if (
        (startTime >= slotStartTime && startTime <= slotEndTime) || // Case 1: New slot's start time is within the existing slot
        (endTime >= slotStartTime && endTime <= slotEndTime) || // Case 2: New slot's end time is within the existing slot
        (startTime <= slotStartTime && endTime >= slotEndTime) // Case 3: New slot completely contains the existing slot
      ) {
        // Merge the overlapping slots
        startTime.setTime(Math.min(startTime, slotStartTime));
        endTime.setTime(Math.max(endTime, slotEndTime));
        addedNewSlot = true;

        // Add the slots that will be removed to the list
        slotsToRemove.push(slot);
      } else {
        mergedSlots.push(slot);
      }
    }

    // Remove the slots that are part of the new merged slot
    for (const slotToRemove of slotsToRemove) {
      mergedSlots = mergedSlots.filter((slot) => slot !== slotToRemove);
    }

    // Add the new merged slot (if created)
    if (addedNewSlot) {
      mergedSlots.push({
        startTime: startTime.toTimeString().slice(0, 5),
        endTime: endTime.toTimeString().slice(0, 5),
      });
    } else {
      mergedSlots.push(newSlot);
    }

    mergedSlots = mergedSlots.sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

    setAvailability((prevAvailability) => ({
      ...prevAvailability,
      [day]: mergedSlots,
    }));

    // Clear input fields after adding a slot
    setTimeSlots({ ...timeSlots, [day]: { startTime: "", endTime: "" } });
  };

  const deleteSlot = (day:string, index:any) => {
    const updatedAvailability = { ...availability };
    updatedAvailability[day].splice(index, 1);
    setAvailability(updatedAvailability);
  };

  const toggleDay = (day:string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(
        selectedDays.filter((selectedDay) => selectedDay !== day)
      );
      // Remove the day's slots when it is unchecked
      const updatedAvailability = { ...availability };
      delete updatedAvailability[day];
      setAvailability(updatedAvailability);
    } else {
      setSelectedDays([...selectedDays, day]);
      // Initialize timeSlots for the newly selected day
      setTimeSlots({ ...timeSlots, [day]: { startTime: "", endTime: "" } });
    }
  };

  const fetchAvailabilityFromFirestore = async () => {
    try {
      const userUid = user?.uid;
      const availabilityRef = firestore
        .collection("users")
        .doc(userUid)
        .collection("availability");

      const availabilityData = {};
      const availableDays : string[] = [];

      const querySnapshot = await availabilityRef.get();

      querySnapshot.forEach((doc) => {
        const day = doc.id;
        const slots = doc.data().slots;
        availabilityData[day] = slots;
        if (slots.length > 0) {
          availableDays.push(day);
        }
      });

      setAvailability(availabilityData);
      setSelectedDays(availableDays);
    } catch (error) {
      console.error("Error fetching availability data:", error);
    }
  };

  useEffect(() => {
    if (user && username) {
      fetchAvailabilityFromFirestore();
    }
  }, [user, username]);

  const sortedSelectedDays = selectedDays
    .slice()
    .sort((a, b) => days.indexOf(a) - days.indexOf(b));

  const saveAvailabilityToFirestore = (userUid:string, availabilityData) => {

    // Start the loading toast
    const toastId = toast.loading('Saving availability...');

    const availabilityRef = firestore
      .collection("users")
      .doc(userUid)
      .collection("availability");
    const batch = firestore.batch();

    for (const day in availabilityData) {
      const dayAvailability = availabilityData[day];
      const dayDocRef = availabilityRef.doc(day);
      batch.set(dayDocRef, { slots: dayAvailability });
    }

    // Commit the batched write
    return batch
      .commit()
      .then(() => {
       
        // Update the toast to show success
        toast.success('Availability saved successfully!', { id: toastId });
      })
      .catch((error) => {
        console.error("Error performing batch write:", error);

        // Update the toast to show error
        toast.error('Failed to save availability.', { id: toastId });
      });
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-md mx-auto w-full md:w-3/4 lg:w-1/2">
        <h2 className="text-2xl font-bold mb-6">Day-wise Availability</h2>
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Select Days:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {days.map((day) => (
              <div key={day} className="flex items-center">
                <input
                  type="checkbox"
                  id={day}
                  value={day}
                  className="mr-2"
                  checked={selectedDays.includes(day)}
                  onChange={() => toggleDay(day)}
                />
                <label htmlFor={day} className="cursor-pointer">
                  {day}
                </label>
              </div>
            ))}
          </div>
        </div>
  
        {sortedSelectedDays.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Create Slots for Selected Days:
            </h3>
            {sortedSelectedDays.map((day) => (
              <div key={day} className="mb-6">
                <h4 className="text-lg font-medium mb-2">{day}:</h4>
                {error[day] && <p className="text-red-500 mb-2">{error[day]}</p>}
                <div className="flex space-x-4 mb-4">
                  <input
                    type="time"
                    value={timeSlots[day]?.startTime || ""}
                    onChange={(e) =>
                      setTimeSlots((prevTimeSlots) => ({
                        ...prevTimeSlots,
                        [day]: {
                          ...prevTimeSlots[day],
                          startTime: e.target.value,
                        },
                      }))
                    }
                    className="border rounded-md p-2"
                  />
                  <input
                    type="time"
                    value={timeSlots[day]?.endTime || ""}
                    onChange={(e) =>
                      setTimeSlots((prevTimeSlots) => ({
                        ...prevTimeSlots,
                        [day]: {
                          ...prevTimeSlots[day],
                          endTime: e.target.value,
                        },
                      }))
                    }
                    className="border rounded-md p-2"
                  />
                  <button
                    onClick={() => addSlot(day)}
                    className="btn btn-primary"
                  >
                    Add Slot
                  </button>
                </div>
                <div>
                  <h5 className="text-lg font-medium mb-2">
                    Availability Slots:
                  </h5>
                  <ul className="list-disc pl-5">
                    {availability[day] &&
                      availability[day].map((slot, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center mb-2"
                        >
                          <span>{`${slot.startTime} to ${slot.endTime}`}</span>
                          <button
                            onClick={() => deleteSlot(day, index)}
                            className="btn btn-error btn-sm"
                          >
                            X
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
  
        <div className="flex justify-center mt-4">
          <button
            onClick={() => saveAvailabilityToFirestore(user?.uid, availability)}
            className="btn btn-success"
          >
            Save Availability
          </button>
        </div>
      </div>
    </div>
  );
  ;
};

export default DayWiseAvailability;

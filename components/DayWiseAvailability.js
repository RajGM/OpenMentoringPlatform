import { useState, useContext, useEffect } from 'react';
import { firestore } from '@lib/firebase';
import { UserContext } from '@lib/context'

const DayAvailability = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [availability, setAvailability] = useState({});
  const [timeSlots, setTimeSlots] = useState({});
  const [error, setError] = useState({});
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const { user, username } = useContext(UserContext)

  const addSlot = (day) => {
    if (!timeSlots[day] || !timeSlots[day].startTime || !timeSlots[day].endTime) {
      setError({ ...error, [day]: 'Please provide valid time slots.' });
      return;
    }

    const startTime = new Date(`1970-01-01T${timeSlots[day].startTime}`);
    const endTime = new Date(`1970-01-01T${timeSlots[day].endTime}`);

    if (endTime <= startTime) {
      setError({ ...error, [day]: 'End time must be greater than start time.' });
      return;
    }

    setError({ ...error, [day]: '' });

    const newSlot = {
      startTime: startTime.toTimeString().slice(0, 5),
      endTime: endTime.toTimeString().slice(0, 5),
    };

    // Check for overlapping slots and merge if needed
    const overlappingSlots = availability[day] || [];
    let mergedSlots = [];
    let addedNewSlot = false;

    const slotsToRemove = []; // Store slots to remove

    for (const slot of overlappingSlots) {
      const slotStartTime = new Date(`1970-01-01T${slot.startTime}`);
      const slotEndTime = new Date(`1970-01-01T${slot.endTime}`);

      // Check for overlap
      if (
        (startTime >= slotStartTime && startTime <= slotEndTime) || // Case 1: New slot's start time is within the existing slot
        (endTime >= slotStartTime && endTime <= slotEndTime) ||     // Case 2: New slot's end time is within the existing slot
        (startTime <= slotStartTime && endTime >= slotEndTime)      // Case 3: New slot completely contains the existing slot
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
    }else{
      mergedSlots.push(newSlot);
    }

    mergedSlots = mergedSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));

    setAvailability((prevAvailability) => ({
      ...prevAvailability,
      [day]: mergedSlots,
    }));

    // Clear input fields after adding a slot
    setTimeSlots({ ...timeSlots, [day]: { startTime: '', endTime: '' } });
  };

  const deleteSlot = (day, index) => {
    const updatedAvailability = { ...availability };
    updatedAvailability[day].splice(index, 1);
    setAvailability(updatedAvailability);
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((selectedDay) => selectedDay !== day));
      // Remove the day's slots when it is unchecked
      const updatedAvailability = { ...availability };
      delete updatedAvailability[day];
      setAvailability(updatedAvailability);
    } else {
      setSelectedDays([...selectedDays, day]);
      // Initialize timeSlots for the newly selected day
      setTimeSlots({ ...timeSlots, [day]: { startTime: '', endTime: '' } });
    }
  };

  const fetchAvailabilityFromFirestore = async () => {
    try {
      const userUid = user.uid;
      const availabilityRef = firestore.collection('users').doc(userUid).collection('availability');

      const availabilityData = {};
      const availableDays = [];

      const querySnapshot = await availabilityRef.get();

      querySnapshot.forEach((doc) => {
        const day = doc.id;
        const slots = doc.data().slots;
        console.log(doc.id, ' => ', doc.data());
        availabilityData[day] = slots;
        if (slots.length > 0) {
          availableDays.push(day);
        }
      });

      setAvailability(availabilityData);
      setSelectedDays(availableDays);
    } catch (error) {
      console.error('Error fetching availability data:', error);
    }
  };

  useEffect(() => {
    fetchAvailabilityFromFirestore();
  }, [user, username]);

  const sortedSelectedDays = selectedDays.slice().sort((a, b) => days.indexOf(a) - days.indexOf(b));

  const saveAvailabilityToFirestore = (userUid, availabilityData) => {
    const availabilityRef = firestore.collection('users').doc(userUid).collection('availability');
    const batch = firestore.batch();

    for (const day in availabilityData) {
      const dayAvailability = availabilityData[day];
      const dayDocRef = availabilityRef.doc(day);
      batch.set(dayDocRef, { slots: dayAvailability });
    }

    // Commit the batched write
    return batch.commit()
      .then(() => {
        console.log('Batch write successful');
      })
      .catch((error) => {
        console.error('Error performing batch write:', error);
      });
  };

  return (
    <div>
      <h2>Day-wise Availability</h2>
      <div>
        <h3>Select Days:</h3>

        {days.map((day) => (
          <div key={day}>
            <label>
              <input
                type="checkbox"
                value={day}
                checked={selectedDays.includes(day)}
                onChange={() => toggleDay(day)}
              />
              {day}
            </label>
          </div>
        ))}
      </div>

      {sortedSelectedDays.length > 0 && (
        <div>
          <h3>Create Slots for Selected Days:</h3>
          {sortedSelectedDays.map((day) => (
            <div key={day}>
              <h4>{day}:</h4>
              {error[day] && <p style={{ color: 'red' }}>{error[day]}</p>}
              <input
                type="time"
                value={timeSlots[day]?.startTime || ''}
                onChange={(e) =>
                  setTimeSlots((prevTimeSlots) => ({
                    ...prevTimeSlots,
                    [day]: {
                      ...prevTimeSlots[day],
                      startTime: e.target.value,
                    },
                  }))
                }
              />

              <input
                type="time"
                value={timeSlots[day]?.endTime || ''}
                onChange={(e) =>
                  setTimeSlots((prevTimeSlots) => ({
                    ...prevTimeSlots,
                    [day]: {
                      ...prevTimeSlots[day],
                      endTime: e.target.value,
                    },
                  }))
                }
              />
              <button onClick={() => addSlot(day)}>Add Slot</button>
              <div>
                <h5>Availability Slots:</h5>
                <ul>
                  {availability[day] &&
                    availability[day].map((slot, index) => (
                      <li key={index}>
                        {`${slot.startTime} to ${slot.endTime}`}
                        <button onClick={() => deleteSlot(day, index)}>X</button>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => saveAvailabilityToFirestore('6yFshQm091N8zItTNpQmUX60twm1', availability)}>Save Availability</button>

    </div>
  );
};

export default DayAvailability;

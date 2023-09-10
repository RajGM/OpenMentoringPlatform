import { useState } from 'react';

const DayAvailability = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [availability, setAvailability] = useState({});
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  const addSlot = () => {
    if (selectedDays.length === 0 || !startTime || !endTime) {
      setError('Please select days and provide valid time slots.');
      return;
    }

    if (endTime <= startTime) {
      setError('End time must be greater than start time.');
      return;
    }

    setError('');

    const newSlot = {
      startTime,
      endTime,
    };

    selectedDays.forEach((day) => {
      setAvailability((prevAvailability) => ({
        ...prevAvailability,
        [day]: [...(prevAvailability[day] || []), newSlot],
      }));
    });

    // Clear input fields after adding a slot
    setStartTime('');
    setEndTime('');
  };

  const deleteSlot = (day, index) => {
    const updatedAvailability = { ...availability };
    updatedAvailability[day].splice(index, 1);
    setAvailability(updatedAvailability);
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((selectedDay) => selectedDay !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <div>
      <h2>Day-wise Availability</h2>
      <div>
        <h3>Select Days:</h3>
        <div>
          <label>
            <input
              type="checkbox"
              value="Monday"
              checked={selectedDays.includes('Monday')}
              onChange={() => toggleDay('Monday')}
            />
            Monday
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              value="Tuesday"
              checked={selectedDays.includes('Tuesday')}
              onChange={() => toggleDay('Tuesday')}
            />
            Tuesday
          </label>
        </div>
        <div>
          {/* Repeat similar code for other days */}
        </div>
      </div>
      {selectedDays.length > 0 && (
        <div>
          <h3>Create Slots for Selected Days:</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <button onClick={addSlot}>Add Slot</button>
          <div>
            <h4>Availability Slots:</h4>
            {selectedDays.map((day) => (
              <div key={day}>
                <h5>{day}:</h5>
                <ul>
                  {availability[day] &&
                    availability[day].map((slot, index) => (
                      <li key={index}>
                        {`${slot.startTime} to ${slot.endTime}`}
                        <button onClick={() => deleteSlot(day, index)}>
                          X
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DayAvailability;

// components/DatePickerCarousel.js
import { useState, useEffect } from 'react';
import { firestore } from '@lib/firebase';

const DatePickerCarousel = ({ userID }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const daysToShow = 7; // Number of days to show in the carousel
    const [availableSlots, setAvailableSlots] = useState([]);

    console.log("userID:", userID)

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
                    onClick={() => fetchDataFromFirestore(dayOfWeek)}
                >
                    <div className="date">{formattedDate}</div>
                    <div className="day">{dayOfWeek}</div>
                </div>
            );
        }

        return dateItems;
    };

    // Function to format a date as "MM/DD"
    const formatDate = (date) => {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}/${day}`;
    };

    // Function to get the day of the week
    const getDayOfWeek = (date) => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return daysOfWeek[date.getDay()];
    };

    // Function to select a date
    const selectDate = (date) => {
        alert(`Selected date: ${formatDate(date)}`);
    };

    // Function to handle clicking the next button
    const handleNextClick = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 1);
        setCurrentDate(newDate);
    };

    // Function to fetch available slots from Firestore
    const fetchDataFromFirestore = async (formattedDate) => {
        // Replace 'userID' with the actual user ID
        const day = formattedDate;

        try {
            console.log("userID:", userID)
            const docRef = firestore.collection('users').doc(userID.uid).collection('availability').doc(formattedDate);
            const doc = await docRef.get();

            console.log("doc:", doc)

            if (doc.exists) {
                const data = doc.data();
                console.log("data:", data)
                console.log("data.slots:", data.slots)
                // Set the available slots in state
                setAvailableSlots(data.slots);
            } else {
                // If no data is available, reset the available slots
                setAvailableSlots([]);
            }
        } catch (error) {
            console.error('Error fetching data from Firestore:', error);
        }
    };

    useEffect(() => {
        // Set the initial date to today
        setCurrentDate(new Date());
    }, [availableSlots]);

    return (
        <div className="date-picker">
            <div className="date-picker-inner">{generateDateItems()}</div>
            <button onClick={handleNextClick}>Next</button>

            {/* Display available slots */}
            <div className="available-slots">
                {console.log("availableSlots:", availableSlots)}
                {availableSlots.length > 0 ? (
                    <ul>
                        {availableSlots.map((slot, index) => (
                            <li key={index}>{slot.startTime}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No available slots for this date.</p>
                )}
            </div>

            <style jsx>{`
        .date-picker {
          display: flex;
          overflow: hidden;
        }

        .date-picker-inner {
          display: flex;
          transition: transform 0.3s ease-in-out;
        }

        .date-item {
          width: 150px;
          height: 100px;
          background-color: #eee;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          border: 1px solid #ccc;
          cursor: pointer;
        }

        .date {
          font-weight: bold;
        }

        .day {
          margin-top: 8px;
        }

        button {
          width: 100px;
          height: 40px;
          background-color: #007bff;
          color: #fff;
          border: none;
          cursor: pointer;
        }
      `}</style>
        </div>
    );
};

export default DatePickerCarousel;

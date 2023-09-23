// components/DatePickerCarousel.js
import { useState, useEffect } from 'react';
import { firestore } from '@lib/firebase';
import { date } from 'yup';

const DatePickerCarousel = ({ userID, gapAmount }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const daysToShow = 7; // Number of days to show in the carousel
    const [availableSlots, setAvailableSlots] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
    });
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null); // Initialize with null or default value

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
                    onClick={() => fetchDataFromFirestore(dayOfWeek, formattedDate,date)}
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

    function getYearMonthDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so we add 1. We also ensure it's two digits.
        const day = date.getDate().toString().padStart(2, '0'); // Ensure the day is two digits.
        return `${year}${month}${day}`;
    }

    // Function to fetch available slots from Firestore
    const fetchDataFromFirestore = async (dayOfWeek, formattedDate,date) => {
        // Replace 'userID' with the actual user ID
        setSelectedDate(formattedDate);

        try {
            console.log("userID:", userID)
            
            const fullDate = getYearMonthDate(date);

            console.log(fullDate);

            const docRef1 = firestore.collection('users').doc(userID.uid).collection('availability').doc(dayOfWeek);
            const docRef2 = firestore.collection('users').doc(userID.uid).collection('booking').doc(String(fullDate));

            // Fetch both documents in parallel
            const [doc, doc2] = await Promise.all([
                docRef1.get(),
                docRef2.get()
            ]);

            if (doc.exists) {
                const data = doc.data();
                const data2 = doc2.data();
                console.log("data:", data)
                console.log("data2:", data2)


                /// here 
                function convertToMinutes(time) {
                    const [hours, minutes] = time.split(':').map(Number);
                    return hours * 60 + minutes;
                }
                
                function formatMinutesToTime(minutes) {
                    const hour = Math.floor(minutes / 60);
                    const minute = minutes % 60;
                    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                }
                
                function overlap(slot1, slot2) {
                    return convertToMinutes(slot1.startTime) < convertToMinutes(slot2.endTime) && convertToMinutes(slot1.endTime) > convertToMinutes(slot2.startTime);
                }
                
                function getAvailableSlots(data1, data2) {
                    let availableSlots = [];
                
                    for (let slot of data1) {
                        let isOverlapping = false;
                        let tempSlots = [slot];
                
                        for (let booked of data2) {
                            if (overlap(slot, booked)) {
                                isOverlapping = true;
                                let newSlots = [];
                
                                for (let tempSlot of tempSlots) {
                                    if (convertToMinutes(booked.startTime) > convertToMinutes(tempSlot.startTime)) {
                                        newSlots.push({
                                            startTime: tempSlot.startTime,
                                            endTime: formatMinutesToTime(convertToMinutes(booked.startTime))
                                        });
                                    }
                                    if (convertToMinutes(booked.endTime) < convertToMinutes(tempSlot.endTime)) {
                                        newSlots.push({
                                            startTime: formatMinutesToTime(convertToMinutes(booked.endTime)),
                                            endTime: tempSlot.endTime
                                        });
                                    }
                                }
                
                                tempSlots = newSlots;
                            }
                        }
                
                        if (!isOverlapping) {
                            availableSlots.push(slot);
                        } else {
                            availableSlots = availableSlots.concat(tempSlots);
                        }
                    }
                
                    return availableSlots;
                }

                let freeSlots = data.slots//getAvailableSlots(data.slots, data2.slots); 

                if(data2){
                    freeSlots = getAvailableSlots(data.slots, data2.slots);
                }

                ////here 
                
                const breakDownSlots = (slots, gap) => {
                    const brokenSlots = [];
                    for (const slot of slots) {
                        const parseTime = (time) => {
                            const [hours, minutes] = time.split(':');
                            return new Date(0, 0, 0, hours, minutes);
                        };

                        const start = parseTime(slot.startTime);
                        const end = parseTime(slot.endTime);
                        let current = start;
                        while (current < end) {
                            let nextEnd = new Date(current.getTime() + gap * 60000); // Convert gap to milliseconds
                            if (nextEnd > end) {
                                // Ensure the broken slot doesn't exceed the original slot's end time
                                nextEnd = end;
                            }
                            brokenSlots.push({
                                startTime: current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                endTime: nextEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            });
                            current = nextEnd;
                        }
                    }
                    return brokenSlots;
                };

                // Break down the original slots with the specified gapAmount
                const brokenSlots = breakDownSlots(freeSlots, gapAmount);

                // Set the available slots in state
                setAvailableSlots(brokenSlots);

            } else {
                // If no data is available, reset the available slots
                setAvailableSlots([]);
            }
        } catch (error) {
            console.error('Error fetching data from Firestore:', error);
        }
    };

    const handleButtonClick = (index) => {
        // Show the form when a button is clicked
        const clickedSlot = availableSlots[index];
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

    function sendEmailWithInvite(recipients, htmlBody, subject, plainBody, icsString) {
        const base64Ics = btoa(icsString);
        const docRef = firestore.collection('mail');

        docRef.add({
            to: recipients,
            message: {
                html: htmlBody,
                subject: subject,
                text: plainBody,
                attachments: [
                    {
                        filename: 'invite.ics',
                        content: base64Ics,
                        encoding: 'base64',
                        type: 'text/calendar'
                    }
                ]
            }
        });
    }

    function createICS(event) {
        const { start, end, summary, description, location } = event;

        return [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "BEGIN:VEVENT",
            `DTSTART:${start}`,
            `DTEND:${end}`,
            `SUMMARY:${summary}`,
            `DESCRIPTION:${description}`,
            `LOCATION:${location}`,
            "END:VEVENT",
            "END:VCALENDAR"
        ].join('\r\n');
    }

    function to24HourFormat(time) {
        const [mainHour, rest] = time.split(':');
        const [minutes, period] = rest.split(' ').map(str => str.trim());
        let hour = parseInt(mainHour, 10);
    
        if (period === 'PM' && hour !== 12) {
            hour += 12;
        } else if (period === 'AM' && hour === 12) {
            hour = 0;
        }
    
        return `${hour.toString().padStart(2, '0')}:${minutes}`;
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log("currentDate:",currentDate)
        // Create a new object with formData, selectedDate, and selectedSlot
        const formDataWithDetails = {
            date: getYearMonthDate(currentDate), // Add the selectedDate
            attendees :[userID.displayName, formData.name],
            email: [userID.email, formData.email],
            startTime: to24HourFormat(selectedSlot.startTime), // Add the selectedSlot start time
            endTime: to24HourFormat(selectedSlot.endTime), // Add the selectedSlot end time
        };

        console.log('Form data with details:', formDataWithDetails);

        return
        const event = {
            start: '20230921T100000Z', // Start time in YYYYMMDDTHHmmssZ format
            end: '20230921T110000Z',   // End time in YYYYMMDDTHHmmssZ format
            summary: 'Meeting with John',
            description: 'Discuss project updates',
            location: 'Conference Room A'
        };

        const icsString = createICS(event);

        const recipientsArray = ['rajgmsocial19@gmail.com'];
        const htmlBody = "Code HTML body";
        const subjectText = "Hello subject";
        const plainBodyText = "This is a plain email body";

        sendEmailWithInvite(recipientsArray, htmlBody, subjectText, plainBodyText, icsString);

        return

        // Make a request to the /book endpoint with the updated formData
        try {
            const response = await fetch('/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataWithDetails),
            });

            if (response.ok) {
                // Handle successful booking, e.g., show a confirmation message
                console.log('Booking successful');
            } else {
                // Handle booking error, e.g., show an error message
                console.error('Booking failed');
            }
        } catch (error) {
            console.error('Error booking:', error);
        }

        // Reset the form and hide it
        setFormData({
            name: '',
            email: '',
            phoneNumber: '',
        });
        setShowForm(false);
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
                            <li key={index}>
                                <button onClick={() => handleButtonClick(index)}>{slot.startTime}</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No available slots for this date.</p>
                )}
            </div>

            {/* Display the form when showForm is true */}
            {showForm && (
                <form onSubmit={handleFormSubmit}>
                    <label>
                        Name:
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </label>
                    <label>
                        Phone Number (optional):
                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
                    </label>
                    <button type="submit">Confirm Booking</button>
                </form>
            )}

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

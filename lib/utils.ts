// Function to format a date as "MM/DD"
export const formatDate = (date: Date): string => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}/${day}`;
};

// Function to get the day of the week
export  const getDayOfWeek = (date: Date): string => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[date.getDay()];
};

export  function getYearMonthDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed, so we add 1. We also ensure it's two digits.
  const day = date.getDate().toString().padStart(2, "0"); // Ensure the day is two digits.
  return `${year}${month}${day}`;
}

export  function convertToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export  function formatMinutesToTime(minutes: number): string {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

import { ICSData, Slot } from '@lib/types';

export function overlap(slot1: Slot, slot2: Slot): boolean {
  return convertToMinutes(slot1.startTime) < convertToMinutes(slot2.endTime) && 
         convertToMinutes(slot1.endTime) > convertToMinutes(slot2.startTime);
}

export function getAvailableSlots(data1: Slot[], data2: Slot[]): Slot[] {
  let availableSlots: Slot[] = [];
  
  for (let slot of data1) {
      let isOverlapping = false;
      let tempSlots: Slot[] = [slot];
  
      for (let booked of data2) {
          if (overlap(slot, booked)) {
              isOverlapping = true;
              let newSlots: Slot[] = [];
  
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

export function createICS(event: ICSData): string {
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

export function to24HourFormat(time: string): string {
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

export const breakDownSlots = (slots, gap) => {
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
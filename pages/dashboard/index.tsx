import UniversityEmailChecker from "@components/UniversityEmailChecker";
import DayWiseAvailability from "@components/DayWiseAvailability";
import Sessions from "@components/Sessions";
import { Social } from "@components/Social";
import Calendar from "@components/Calendar";
import Profile from "@components/Profile";
import { useState } from "react";

const UserProfilePage: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState(
    "UniversityEmailChecker"
  );

  return (
    <div className="bg-gray-100 min-h-screen p-8 md:p-12">
    <div className="flex justify-center mb-4 md:mb-8 flex-wrap">
      <div className="flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm flex-wrap">
       <button
          className={`inline-block px-4 py-2 text-sm font-medium ${activeComponent === "UniversityEmailChecker" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-50"} focus:relative`}
          onClick={() => setActiveComponent("UniversityEmailChecker")}
        >
          Email Checker
        </button>

        <button
          className={`inline-block px-4 py-2 text-sm font-medium ${activeComponent === "DayWiseAvailability" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-50"} focus:relative`}
          onClick={() => setActiveComponent("DayWiseAvailability")}
        >
          Availability
        </button>

        <button
          className={`inline-block px-4 py-2 text-sm font-medium ${activeComponent === "Sessions" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-50"} focus:relative`}
          onClick={() => setActiveComponent("Sessions")}
        >
          Sessions
        </button>

        <button
          className={`inline-block px-4 py-2 text-sm font-medium ${activeComponent === "Profile" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-50"} focus:relative`}
          onClick={() => setActiveComponent("Profile")}
        >
          Profile
        </button>

        <button
          className={`inline-block px-4 py-2 text-sm font-medium ${activeComponent === "Social" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-50"} focus:relative`}
          onClick={() => setActiveComponent("Social")}
        >
          Social
        </button>

        <button
          className={`inline-block px-4 py-2 text-sm font-medium ${activeComponent === "Calendar" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-50"} focus:relative`}
          onClick={() => setActiveComponent("Calendar")}
        >
          Calendar
        </button>
      </div>
    </div>

    {activeComponent === "UniversityEmailChecker" && <UniversityEmailChecker />}
    {activeComponent === "DayWiseAvailability" && <DayWiseAvailability />}
    {activeComponent === "Sessions" && <Sessions />}
    {activeComponent === "Profile" && <Profile />}
    {activeComponent === "Social" && <Social />}
    {activeComponent === "Calendar" && <Calendar />}
  </div>
  );
};

export default UserProfilePage;

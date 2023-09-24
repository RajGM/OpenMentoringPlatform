import UniversityEmailChecker from "@components/UniversityEmailChecker";
import DayWiseAvailability from "@components/DayWiseAvailability";
import Sessions from "@components/Sessions";
import { UserContext } from "@lib/context";
import { useState, useContext, useEffect } from "react";

const UserProfilePage: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState(
    "UniversityEmailChecker"
  );

  return (
    <div className="bg-gray-100 min-h-screen p-8">
    <div className="flex justify-center mb-8">
      <span className="inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm">
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
      </span>
    </div>

    {activeComponent === "UniversityEmailChecker" && <UniversityEmailChecker />}
    {activeComponent === "DayWiseAvailability" && <DayWiseAvailability />}
    {activeComponent === "Sessions" && <Sessions />}
  </div>
  );
};

export default UserProfilePage;

/*
<div>
<UniversityEmailChecker />
</div>
<div>
<DayWiseAvailability />
</div>
<div>
<Sessions />
</div>
*/

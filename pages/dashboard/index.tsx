import UniversityEmailChecker from "@components/UniversityEmailChecker";
import DayWiseAvailability from "@components/DayWiseAvailability";
import Sessions from "@components/Sessions";
import { UserContext } from "@lib/context";
import { useState, useContext, useEffect } from "react";

const UserProfilePage: React.FC = () => {
  const { user, username } = useContext(UserContext);

  useEffect(() => {}, [user, username]);

  return (
    <main>
      <div>
        <UniversityEmailChecker />
      </div>
      <div>
        <DayWiseAvailability />
      </div>
      <div>
        <Sessions />
      </div>
    </main>
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

import UniversityEmailChecker from "@components/UniversityEmailChecker";
import DayWiseAvailability from "@components/DayWiseAvailability";
import Sessions from "@components/Sessions";
import { UserContext } from '@lib/context';
import { useState, useContext, useEffect } from 'react';

const UserProfilePage: React.FC = () => {
  return (
    <main>
      <div>THIS IS DASHBOARD</div>
      <div>
        <UniversityEmailChecker />
      </div>
      <div>
        <DayWiseAvailability />
      </div>
      <div>
       <Sessions/>
      </div>
    </main>
  );
}

export default UserProfilePage;

import UniversityEmailChecker from "@components/UniversityEmailChecker";
import DayWiseAvailability from "@components/DayWiseAvailability";
import Sessions from "@components/Sessions";
import { UserContext } from '@lib/context';
import { useState, useContext, useEffect } from 'react';

export default function UserProfilePage() {
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

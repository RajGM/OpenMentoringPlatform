// Define the type for the atom's value
export type TextType = string;
export type CategoryType = string;
export type FilterType = string;

export type ProviderData = {
    providerId: string;
    uid: string;
    displayName: string;
    email: string;
    phoneNumber: string | null;
    photoURL: string;
  };
  
  export type STSTokenManager = {
    refreshToken: string;
    accessToken: string;
    expirationTime: number;
  };
  
  export type User = {
    uid: string;
    email: string;
    emailVerified: boolean;
    displayName: string;
    isAnonymous: boolean;
    photoURL: string;
    providerData: ProviderData[];
    stsTokenManager: STSTokenManager;
    createdAt: string;
    lastLoginAt: string;
    apiKey: string;
    appName: string;
  };
  
  export type UserContextType = {
    user: User | null;
    username: string | null;
  };
  
  export interface CalendarLinkProps {
    link: string;
    text: string;
  }

  export interface CategoriesFeedProps {
    categories: string[];
    cChanger: (category: string) => void;
  }
  
  export interface CategoryBarProps {
    category: string;
    cChanger: (category: string) => void;
  }

  export type CategoriesType = string[];

  export interface ClickToCopyProps {
    text: string;
  }

  export interface DatePickerCarouselProps {
    userID: {
      uid: string;
      displayName: string;
      email: string;
    };
    gapAmount: number;
  }
  
  export interface Slot {
    startTime: string;
    endTime: string;
  }
  
  export interface FormData {
    name: string;
    email: string;
    phoneNumber: string;
  }
  
  export type SlotType = {
      startTime: string;
      endTime: string;
  };
  
  export type ICSData = {
      start: string;
      end: string;
      summary: string;
      description: string;
      location: string;
  };

  export interface TimeSlot {
    startTime: string;
    endTime: string;
  }
  
  export interface Availability {
    [key: string]: TimeSlot[];
  }
  
  export interface TimeSlots {
    [key: string]: TimeSlot;
  }
  
  export interface Error {
    [key: string]: string;
  }

  export interface FilterBarProps {
    selectedC: string;
  }

  export const categoriesAndFilters: Record<string, string[]> = {
    "Hackathon": ["Onsite", "Remote", "Hybrid", "All"],
    "Internship": ["Onsite", "Remote", "Hybrid"],
    "Grants": ["Travel", "Course", "Conference"],
    "Conferences": ["Design", "Launch Event"]
  }
  
  export interface FilterFeedProps {
    selectedCategory: string;
  }
  
  export interface FilterBarProps {
    filter: string;
  }

export interface HackathonTileProps {
    data: {
        eventN: string;
        sponsored?: boolean;
        logoUrl?: string;
        link: string;
        appS: string;
        appE: string;
        eventS?: string;
        eventE?: string;
        postedBy: string;
    };
}

export interface LoaderProps {
  show: boolean;
  className?: string;  // Added className property
}

export interface CardFieldProps {
  arrData: any[]; // You should replace 'any' with the actual type of the data
}

export type MentorFeedProps = {
  arrData: any[]; // You can replace 'any' with the specific type of data if known
};

export interface MetatagsProps {
  title?: string;
  description?: string;
}

export interface ModalButtonProps {
  eventData: any; // You should replace 'any' with the actual type of the eventData
}

export interface Post {
  title?: string;
  content?: string;
  username?: string;
  createdAt: number | { toDate: () => Date };
}

export interface PostContentProps {
  post: Post;
}

export interface PostFeedProps {
  posts: Post[];
  admin?: boolean;
}

export interface PostItemProps {
  post: Post;
  admin?: boolean;
}

export interface SessionModalProps {
  gapAmount: number;
}

export interface Session {
  id: string;
  title: string;
  duration: string;
}

export interface InitialValues {
  discord: string;
  telegram: string;
  twitter: string;
  instagram: string;
}

export interface UserProfileProps {
  user: {
    photoURL?: string;
    username: string;
    displayName?: string;
  };
}
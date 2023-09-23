import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  button,
} from "react";
import { Menu, MenuButton, MenuList, MenuItem } from "@reach/menu-button";
import Image from "next/image";
import { firestore } from "@lib/firebase";
import { useAtom } from "jotai";
import { categoriesAtom, filterAtom } from "@lib/atoms";
import { UserContext } from "@lib/context";
import { useContext } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

interface HoverMenuButtonProps {
  data: any; // You should replace 'any' with the actual type of the data
}

const HoverMenuButton: React.FC<HoverMenuButtonProps> = ({ data }) => {
  let [isOverButton, setIsOverButton] = useState(false);
  let [isOverList, setIsOverList] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isTouchInput, setIsTouchInput] = useState<boolean>(false);
  const [hasClicked, setHasClicked] = useState<boolean>(false);
  const button = useRef<HTMLButtonElement | null>(null);
  const [category] = useAtom(categoriesAtom);
  const { user, username } = useContext(UserContext);
  const router = useRouter();

  useLayoutEffect(() => {
    if (button.current) {
      // Check if button.current is not null
      if (isOpen && !isOverButton && !isOverList && !isTouchInput) {
        button.current.click();
        setIsOpen(false);
      } else if (!isOpen && (isOverButton || isOverList) && !isTouchInput) {
        button.current.click();
        setIsOpen(true);
      }
    }
  }, [isOverButton, isOverList]);

  useEffect(() => {
    setIsTouchInput(false);
    setHasClicked(false);
  }, [hasClicked]);

  return (
    <Menu>
      <MenuButton
        ref={button}
        onTouchStart={() => {
          setIsTouchInput(true);
        }}
        onMouseEnter={(event) => {
          setIsOverButton(true);
        }}
        onMouseLeave={(event) => {
          setIsOverButton(false);
        }}
        onClick={() => {
          setHasClicked(true);
          setIsOpen(!isOpen);
        }}
        onKeyDown={() => {
          setIsOpen(!isOpen);
        }}
        style={{
          backgroundColor: "white",
          padding: "5px",
          boxShadow: "2px 2px",
          border: "1px solid black",
        }}
      >
        <Image
          src="/dots.png"
          alt="Description of Image"
          width={10}
          height={10}
        />
      </MenuButton>
      <MenuList
        onMouseEnter={(event) => {
          setIsOverList(true);
        }}
        onMouseLeave={(event) => {
          setIsOverList(false);
        }}
        className="mt-[-100px] bg-white shadow-lg rounded-lg"
      >
        <MenuItem
          onSelect={() => {
            setIsOpen(false);
          }}
        >
          <button
            onClick={() => {
              if (!user) {
                toast.success(`Please login to upvote`);
                return;
              }
              post("vote", category, user, data.id, username);
            }}
            className="btn btn-primary w-full"
          >
            UpVote
          </button>
        </MenuItem>
        <MenuItem
          onSelect={() => {
            setIsOpen(false);
          }}
        >
          <button
            onClick={() => {
              if (!user) {
                toast.success(`Please login to mark`);
                return;
              }
              post("close", category, user, data.id, username);
            }}
            className="btn btn-secondary w-full mt-2"
          >
            Mark Closed
          </button>
        </MenuItem>
      </MenuList>

    </Menu>
  );
};

async function post(
  type: string,
  category: string,
  user: any,
  firestoreid: string,
  username: string
) {
  //redirect if not loggedIN

  console.log("POST WORKING");
  category = category.charAt(0).toUpperCase() + category.slice(1);
  console.log(type, category, user, firestoreid);

  toast.loading(getMessage(type));

  fetch("/api/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      category: category,
      firestoreid: firestoreid,
      authorization: user ? user.accessToken : undefined,
    },
    body: JSON.stringify({
      type: type,
      user: user,
      username: username,
    }),
  })
    .then((response) => {
      if (response.ok) {
        toast.dismiss();
        toast.success(`Thanks for your contribution`);
      } else {
        toast.dismiss();
        toast.error(`Error occurred while adding`);
      }
    })
    .catch((error) => {
      toast.dismiss();
      toast.error(`Error occurred while adding`);
    });
}

function getMessage(type: string): string {
  if (type == "vote") {
    return "Upvoting...";
  } else if (type == "close") {
    return "Marking...";
  }
  return "Processing..."; // Default return value
}

export default HoverMenuButton;

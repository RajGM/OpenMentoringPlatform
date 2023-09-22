import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  button,
} from "react";
import { Menu, MenuButton, MenuList, MenuItem } from "@reach/menu-button";
import Image from "next/image";
import { useAtom } from "jotai";
import { categoriesAtom, filterAtom } from "./atoms";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "@lib/context";
import { useContext } from "react";
import { useRouter } from "next/router";
import { auth } from "@lib/firebase";

const HoverModalButton: React.FC = () => {
  const signOut = () => {
    auth.signOut();
    router.reload();
  };

  let [isOverButton, setIsOverButton] = useState(false);
  let [isOverList, setIsOverList] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  let [isTouchInput, setIsTouchInput] = useState(false);
  let [hasClicked, setHasClicked] = useState(false);
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
          border: "none",
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <img src={user?.photoURL || "/hacker.png"} />
      </MenuButton>
      <MenuList
        onMouseEnter={(event) => {
          setIsOverList(true);
        }}
        onMouseLeave={(event) => {
          setIsOverList(false);
        }}
        style={{ display: "inline-block" }}
      >
        <MenuItem
          onSelect={() => {
            setIsOpen(false);
          }}
        >
          <button
            onClick={() => {
              router.push(`/${username}`);
            }}
            style={{ width: "150px", marginLeft: "-10px" }}
          >
            Profile Page
          </button>
        </MenuItem>
        <MenuItem
          onSelect={() => {
            setIsOpen(false);
          }}
        >
          <button
            onClick={signOut}
            style={{ width: "150px", marginLeft: "-10px" }}
          >
            Sign Out
          </button>
        </MenuItem>
      </MenuList>
      <Toaster />
    </Menu>
  );
};

export default HoverModalButton;

/*
Go TO Sponsor button
<MenuItem
                    onSelect={() => {
                        setIsOpen(false);
                    }}
                >
                    <button onClick={() => {
                        if (!user) {
                            toast.success(`Please login to add sponsored opportunties`);
                            return;
                        } else {
                            router.push('/sponsor');
                            return;
                        }
                    }} style={{width:'150px', marginLeft:'-10px'}}>
                        Sponsor Opp
                    </button>
                </MenuItem>
*/

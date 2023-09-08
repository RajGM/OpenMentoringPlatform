import React, { useEffect, useLayoutEffect, useRef, useState, button } from "react";
import { Menu, MenuButton, MenuList, MenuItem } from "@reach/menu-button";
import Image from 'next/image'
import { firestore } from "@lib/firebase";
import { useAtom } from 'jotai';
import { categoriesAtom, filterAtom } from './atoms';
import toast, { Toaster } from 'react-hot-toast';
import { UserContext } from '@lib/context';
import { useContext } from 'react';
import { useRouter } from 'next/router';

export default function HoverMenuButton({ data }) {

    let [isOverButton, setIsOverButton] = useState(false);
    let [isOverList, setIsOverList] = useState(false);
    let [isOpen, setIsOpen] = useState();
    let [isTouchInput, setIsTouchInput] = useState();
    let [hasClicked, setHasClicked] = useState();
    let button = useRef(null);
    const [category] = useAtom(categoriesAtom);
    const { user, username } = useContext(UserContext);
    const router = useRouter();

    useLayoutEffect(() => {
        if (isOpen && !isOverButton && !isOverList && !isTouchInput) {
            button.current.click();
            setIsOpen(false);
        } else if (!isOpen && (isOverButton || isOverList) && !isTouchInput) {
            button.current.click();
            setIsOpen(true);
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
                onMouseEnter={event => {
                    setIsOverButton(true);
                }}
                onMouseLeave={event => {
                    setIsOverButton(false);
                }}
                onClick={() => {
                    setHasClicked(true);
                    setIsOpen(!isOpen);
                }}
                onKeyDown={() => {
                    setIsOpen(!isOpen);
                }}
                style={{backgroundColor:'white', padding:'5px', boxShadow:'2px 2px', border:'1px solid black'}}
            >
                <Image src="/dots.png" width={10} height={10} />
            </MenuButton>
            <MenuList
                onMouseEnter={event => {
                    setIsOverList(true);
                }}
                onMouseLeave={event => {
                    setIsOverList(false);
                }}
                style={{marginTop:'-100px'}}
            >
                <MenuItem
                    onSelect={() => {
                        setIsOpen(false);
                    }}
                >
                    <button onClick={() => {
                        if (!user) {
                            toast.success(`Please login to upvote`);
                            return;
                        }
                        post("vote", category, user, data.id,username);
                    }} className="smallButton">
                        UpVote
                    </button>
                </MenuItem>
                <MenuItem
                    onSelect={() => {
                        setIsOpen(false);
                    }}
                >
                    <button onClick={() => {
                        if (!user) {
                            toast.success(`Please login to mark`);
                            return;
                        }
                        post("close", category, user,data.id,username);
                    }} className="smallButton">
                        Mark Closed
                    </button>
                </MenuItem>
                
            </MenuList>
            <Toaster />
        </Menu>
    );
}

async function post(type, category, user, firestoreid,username) {

    //redirect if not loggedIN

    console.log("POST WORKING");
    category = category.charAt(0).toUpperCase() + category.slice(1)
    console.log(type, category, user, firestoreid);

    toast.loading(getMessage(type));
    
    fetch('/api/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'category': category,
            'firestoreid': firestoreid,
            'authorization': user?user.accessToken:undefined
        },
        body: JSON.stringify({
            type: type,
            user: user,
            username:username
        })
    }).then(response => {
        if (response.ok) {
            toast.dismiss();
            toast.success(`Thanks for your contribution`);
        } else {
            toast.dismiss();
            toast.error(`Error occurred while adding`);
        }
    }
    ).catch((error) => {
        toast.dismiss();
        toast.error(`Error occurred while adding`);
    }
    );

}

function getMessage(type){
    if(type=="vote"){
        return "Upvoting...";
    }else if(type=="close"){
        return "Marking...";
    }
    // else if(type=="spam"){
    //     return "Reporting...";
    // }
}
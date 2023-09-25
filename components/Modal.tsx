import React, { useState, useContext } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { Customform, MyFormComponent } from "./Form";
import { categoriesAtom } from "../lib/atoms";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { UserContext } from "@lib/context";
import { ModalButtonProps } from "@lib/types";

const ModalButton: React.FC<ModalButtonProps> = ({ eventData }) => {
  const { user, username } = useContext(UserContext);
  const router = useRouter();
  const [category] = useAtom(categoriesAtom);

  const [open, setOpen] = useState(false);

  const onOpenModal = () => {
    if (!username) {
      router.push("/enter");
      return;
    } else {
      setOpen(true);
    }
  };

  const onCloseModal = () => setOpen(false);

  if (eventData != null) {
    return (
      <div style={{display:'flex',flexDirection:'row', justifyContent:'center'}}>
        <div>
          <button
            className="inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
            onClick={onOpenModal}
          >
            <span className="block rounded-full bg-white px-8 py-3 text-sm font-medium hover:bg-transparent">
              {"Update " + eventData.eventN}
            </span>
          </button>
        </div>

        <div>
          <Modal open={open} onClose={onCloseModal} center>
            <Customform eventData={eventData} categoryTest={category} />
          </Modal>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <button onClick={onOpenModal}>Add Opp</button>
        <Modal open={open} onClose={onCloseModal} center>
          <MyFormComponent eventData={eventData} />
        </Modal>
      </div>
    );
  }
};

export default ModalButton;

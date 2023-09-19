import React, { useState } from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { SessionForm } from './Form';
import { categoriesAtom } from './atoms';
import { useAtom } from 'jotai';

import { useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@lib/context';

export default function ModalButton({ eventData }) {

    const { user, username } = useContext(UserContext);
    const router = useRouter();
    const [category] = useAtom(categoriesAtom);

    const [open, setOpen] = useState(false);

    const onOpenModal = () => {
        if (!username) {
            router.push('/enter');
            return;
        } else {
            setOpen(true)
        };
    }

    const onCloseModal = () => setOpen(false);

    return (
        <div>
            <button onClick={onOpenModal}>Opp</button>
            <Modal open={open} onClose={onCloseModal} center>
                <SessionForm eventData={eventData} />
            </Modal>
        </div>
    )

};

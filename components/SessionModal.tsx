// @ts-nocheck
import React, { useState, useContext } from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { SessionForm } from './Form';
import { categoriesAtom } from '@lib/atoms';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { UserContext } from '@lib/context';
import { SessionModalProps } from '@lib/types';

const SessionModal: React.FC<SessionModalProps> = ({ session }) => {
  const { user, username } = useContext(UserContext);
  const router = useRouter();
  const [category] = useAtom(categoriesAtom);

  const [open, setOpen] = useState(false);

  const onOpenModal = () => {
    if (!username) {
      router.push('/enter');
      return;
    } else {
      setOpen(true);
    }
  };

  const onCloseModal = () => setOpen(false);

  return (
    <div>
      <button onClick={onOpenModal}>Opp</button>
      <Modal open={open} onClose={onCloseModal} center>
        <SessionForm session={session} />
      </Modal>
    </div>
  );
};

export default SessionModal;

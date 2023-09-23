import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

interface ClickToCopyProps {
  text: string;
}

const ClickToCopy: React.FC<ClickToCopyProps> = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <>
            <CopyToClipboard text={text} onCopy={handleCopy}>
                <button className='copy-button'>{copied ? 'Copied!' : <FaCopy />}</button>
            </CopyToClipboard>
        </>
    );
}

export default ClickToCopy;

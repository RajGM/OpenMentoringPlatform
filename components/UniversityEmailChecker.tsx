import { useState, useContext, use, useEffect } from 'react';
import { UserContext } from "@lib/context";

const UniversityEmailChecker = () => {
    const [website, setWebsite] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [websiteDomain, setWebsiteDomain] = useState<string>('');
    const { user, username } = useContext(UserContext);
    const [sendToFirebase, setSendToFirebase] = useState<boolean>(false);
    const [listMentor, setListMentor] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [meetingLink, setMeetingLink] = useState<string>('');

    useEffect(() => {
        if (user) {
            setEmail(user.email);
        }
    }, [user]);

    const handleWebsiteChange = (e) => {
        const websiteValue = e.target.value;
        setWebsite(websiteValue);
        setIsFormValid(websiteValue.trim() !== '' && email.trim() !== '');

        // Extract the domain from the website URL
        const domainMatch = websiteValue.match(/:\/\/(www\.)?([^/]+)/) || websiteValue.match(/(www\.)?([^/]+)/);

        if (domainMatch) {
            const extractedDomain = domainMatch[2];
            setWebsiteDomain(extractedDomain);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setIsFormValid(e.target.value.trim() !== '' && website.trim() !== '');
    };

    const handleMeetingLinkChange = (e) => {
        setMeetingLink(e.target.value);
    };

    const checkEmail = async () => {

        if (!isFormValid) {
            setResult('Please fill in both fields.');
            return;
        }

        if (listMentor) {
            // Check if Meeting link are filled when listMentor is checked
            if (!meetingLink) {
                setError('Meeting Link are mandatory when adding to Mentor Board.');
                return;
            }
        }

        try {
            // Define a regular expression pattern for matching the university domain
            const domainPattern = new RegExp(`${websiteDomain.replace('.', '\\.')}$`);

            // Check if the email domain matches the domain pattern
            if (domainPattern.test(email.split('@')[1]) || websiteDomain.includes(email.split('@')[1])) {
                // Send a request to the backend
                const response = await fetch('/api/verify-email', {
                    method: 'POST',
                    body: JSON.stringify({ email, website, websiteDomain, listMentor }),
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: user.accessToken,
                    },
                });

                if (response.ok) {
                    console.log("RESPONSE OK")
                    const data = await response.json();
                    setResult(data.message);
                    setSendToFirebase(true)
                } else {
                    setSendToFirebase(false);
                    setResult('Error occurred while verifying email.');
                }
            } else {
                setSendToFirebase(false);
                setResult('Email does not belong to the university domain, email us from your university email');
            }
        } catch (error) {
            console.error('Error:', error);
            setResult('An error occurred.');
        }
    };

    return (
        <div>
            <h1>University Email Checker</h1>
            <label>
                University Website:
                <input
                    type="text"
                    value={website}
                    onChange={handleWebsiteChange}
                />
            </label>
            <br />
            <label>
                Email:
                <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={true}
                />
            </label>
            <br />
            <button onClick={checkEmail} disabled={!isFormValid}>
                Check Email
            </button>
            <p>{result}</p>

            {sendToFirebase && (

                <div>
                    {/* Checkbox for sending to Firebase */}
                    <label>
                        Add to Mentor Board:
                        <input
                            type="checkbox"
                            checked={listMentor}
                            onChange={() => setListMentor(!listMentor)}
                        />
                    </label>

                    <br />

                    <label>
                        Meeting Link:
                        <input
                            type="text"
                            value={meetingLink}
                            onChange={handleMeetingLinkChange}
                        />
                    </label>
                    <br />

                    {/* Button to send to Firebase */}
                    <div>
                        <button onClick={checkEmail}>Send to Firebase</button>
                    </div>

                </div>

            )}

            {error && (
                <div>
                    <p>{error}</p>
                </div>
            )}

        </div>
    );
};

export default UniversityEmailChecker;

//show this that this is made by TDD
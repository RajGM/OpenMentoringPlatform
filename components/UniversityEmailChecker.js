import { useState } from 'react';
import url from 'url-parse';

const UniversityEmailChecker = () => {
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [universityDomain, setUniversityDomain] = useState('');

  const handleWebsiteChange = (e) => {
    const websiteValue = e.target.value;
    setWebsite(websiteValue);
    setIsFormValid(websiteValue.trim() !== '' && email.trim() !== '');

    const parsedUrl = new url(websiteValue);
    const extractedDomain = parsedUrl.hostname;
    setUniversityDomain(extractedDomain);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsFormValid(e.target.value.trim() !== '' && website.trim() !== '');
  };

  const checkEmail = async () => {
    if (!isFormValid) {
      setResult('Please fill in both fields.');
      return;
    }

    try {
      // Define a regular expression pattern for matching the university domain
      const domainPattern = new RegExp(`@(\\w+\\.)*${universityDomain}`);

     console.log(domainPattern.test(email));
      return 
      // Check if the email matches the domain pattern
      if (domainPattern.test(email)) {
        // Send a request to the backend
        const response = await fetch('/api/verify-email', {
          method: 'POST',
          body: JSON.stringify({ email, website, universityDomain }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setResult(data.message);
        } else {
          setResult('Error occurred while verifying email.');
        }
      } else {
        setResult('Email does not belong to the university domain.');
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
        />
      </label>
      <br />
      <button onClick={checkEmail} disabled={!isFormValid}>
        Check Email
      </button>
      <p>{result}</p>
    </div>
  );
};

export default UniversityEmailChecker;

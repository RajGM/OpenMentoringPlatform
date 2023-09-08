import { useState } from 'react';

const UniversityEmailChecker = () => {
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [websiteDomain, setWebsiteDomain] = useState('');

  const handleWebsiteChange = (e) => {
    const websiteValue = e.target.value;
    setWebsite(websiteValue);
    setIsFormValid(websiteValue.trim() !== '' && email.trim() !== '');

    // Extract the domain from the website URL
    const domainMatch = websiteValue.match(/:\/\/(www\.)?([^/]+)/);
    if (domainMatch) {
      const extractedDomain = domainMatch[2];
      setWebsiteDomain(extractedDomain);
    }
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
      const domainPattern = new RegExp(`@.*${websiteDomain.replace('.', '\\.')}`);

        console.log(domainPattern)
        console.log(email)
        console.log(domainPattern.test(email))
      return 
      // Check if the email matches the domain pattern
      if (domainPattern.test(email)) {
        // Send a request to the backend
        const response = await fetch('/api/verify-email', {
          method: 'POST',
          body: JSON.stringify({ email, website, websiteDomain }),
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

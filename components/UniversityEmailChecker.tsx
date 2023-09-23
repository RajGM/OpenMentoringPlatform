import { useState, useContext, use, useEffect } from "react";
import { UserContext } from "@lib/context";
import toast from "react-hot-toast";

const UniversityEmailChecker = () => {
  const [website, setWebsite] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [websiteDomain, setWebsiteDomain] = useState<string>("");
  const { user, username } = useContext(UserContext);
  const [sendToFirebase, setSendToFirebase] = useState<boolean>(false);
  const [listMentor, setListMentor] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [meetingLink, setMeetingLink] = useState<string>("");

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const handleWebsiteChange = (e) => {
    const websiteValue = e.target.value;
    setWebsite(websiteValue);
    setIsFormValid(websiteValue.trim() !== "" && email.trim() !== "");

    // Extract the domain from the website URL
    const domainMatch =
      websiteValue.match(/:\/\/(www\.)?([^/]+)/) ||
      websiteValue.match(/(www\.)?([^/]+)/);

    if (domainMatch) {
      const extractedDomain = domainMatch[2];
      setWebsiteDomain(extractedDomain);
    }
  };

  const handleMeetingLinkChange = (e) => {
    setMeetingLink(e.target.value);
  };

  const checkEmail = async () => {
    toast.loading("Verifying University email...");

    if (!isFormValid) {
      setResult("Please fill in both fields.");
      return;
    }

    if (listMentor) {
      // Check if Meeting link are filled when listMentor is checked
      if (!meetingLink) {
        setError("Meeting Link are mandatory when adding to Mentor Board.");
        return;
      }
    }

    try {
      // Define a regular expression pattern for matching the university domain
      const domainPattern = new RegExp(`${websiteDomain.replace(".", "\\.")}$`);

      // Check if the email domain matches the domain pattern
      if (
        domainPattern.test(email.split("@")[1]) ||
        websiteDomain.includes(email.split("@")[1])
      ) {
        // Send a request to the backend
        const response = await fetch("/api/verify-email", {
          method: "POST",
          body: JSON.stringify({ email, website, websiteDomain, listMentor }),
          headers: {
            "Content-Type": "application/json",
            authorization: user.accessToken,
          },
        });

        if (response.ok) {
          console.log("RESPONSE OK");
          toast.dismiss();
          toast.success(
            "Eamil verified successfully and added to mentors list!"
          );
          const data = await response.json();
          setResult(data.message);
          setSendToFirebase(true);
        } else {
          toast.dismiss();
          toast.error("Error occurred while verifying email.");
          setSendToFirebase(false);
          setResult("Error occurred while verifying email.");
        }
      } else {
        toast.dismiss();
        toast.error("Error occurred while verifying email.");
        setSendToFirebase(false);
        setResult(
          "Email does not belong to the university domain, email us from your university email"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">University Email Checker</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            University Website:
          </label>
          <input
            type="text"
            value={website}
            onChange={handleWebsiteChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Email:
          </label>
          <input
            type="email"
            value={email}
            disabled={true}
            className="input input-bordered w-full"
          />
        </div>

        <button
          onClick={checkEmail}
          disabled={!isFormValid}
          className="btn btn-primary w-full mb-4"
        >
          Check Email
        </button>

        <p className="text-sm text-gray-600 mb-4">{result}</p>

        {sendToFirebase && (
          <div className="mb-4">
            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={listMentor}
                onChange={() => setListMentor(!listMentor)}
                className="checkbox checkbox-primary"
              />
              <span>Add to Mentor Board:</span>
            </label>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Meeting Link:
              </label>
              <input
                type="text"
                value={meetingLink}
                onChange={handleMeetingLinkChange}
                className="input input-bordered w-full"
              />
            </div>

            <button onClick={checkEmail} className="btn btn-secondary w-full">
              Send to Firebase
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded text-red-600">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityEmailChecker;

//show this that this is made by TDD

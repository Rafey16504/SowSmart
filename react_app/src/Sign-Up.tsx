import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://sowsmart.onrender.com/";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [isVerificationVisible, setIsVerificationVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [userInputCode, setUserInputCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const checkExisting = async () => {
    try {
      console.log(`Checking if email "${email}" already exists...`);
      const response = await axios.post(`${BASE_URL}get-farmer`, { email });

      if (response.data.success) {
        console.log(`TC-002 Failed: Email "${email}" already exists.`);
        return true;
      }

      console.log(`TC-001 Passed: Email "${email}" is new.`);
      return false;
    } catch (error) {
      console.error("Error while checking existing email:", error);
      return false;
    }
  };

  const handleEmailSubmit = async () => {
    console.log(`User entered email: "${email}"`);

    if (!email) {
      console.log("TC-003 Failed: Email field is empty.");
      setErrorMessage("Please enter your email!");
      return;
    }

    if (!email.includes("@")) {
      console.log(`TC-003 Failed: Invalid email format entered: "${email}"`);
      setErrorMessage("Please enter a valid email!");
      return;
    }

    if (await checkExisting()) {
      setErrorMessage("Email already exists. Please sign in!");
      return;
    }

    console.log(`TC-004: Sending verification code to "${email}"...`);
    setSuccessMessage("Please wait while we send you a verification code!");

    try {
      const { data } = await axios.post(`${BASE_URL}send-email/`, { email });

      console.log(`Verification code sent successfully. Code: ${data.message}`);
      setIsVerificationVisible(true);
      setSuccessMessage("Check your email for the verification code!");
      setVerificationCode(data.message);
    } catch (error) {
      console.error("TC-004 Failed: Error sending verification email:", error);
      setErrorMessage("Error sending email. Please try again!");
    }
  };

  const handleVerifyCode = () => {
    console.log(`Verifying code. User entered: "${userInputCode}", Expected: "${verificationCode}"`);

    if (userInputCode !== verificationCode) {
      console.log("TC-001 Failed: Code mismatch. Verification failed.");
      setErrorMessage("Invalid code. Please try again.");
      return;
    }

    console.log(`TC-001 Passed: Verification successful for "${email}"`);
    setSuccessMessage("Verification successful!");
    setTimeout(() => {
      navigate("/input-details", { state: { email } });
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isVerificationVisible) {
        handleVerifyCode();
      } else {
        handleEmailSubmit();
      }
    }
  };

  useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() => {
        setErrorMessage("in timeout");
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [errorMessage]);

  return (
    <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col items-center justify-center space-y-8">
        <div className="text-center -mt-16">
          <h1 className="font-grotesk font-extrabold text-6xl text-green-800">SowSmart</h1>
        </div>

        <div className="w-9/12 h-1/6">
          <p className="font-grotesk font-semibold text-5xl text-green-700">Welcome</p>
          <p className="font-grotesk text-lg text-green-600">Sign Up</p>
        </div>

        <div className="w-3/4 flex flex-col items-center space-y-6">
          {!isVerificationVisible ? (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-green-500 w-full pb-2"
              required
            />
          ) : (
            <input
              type="text"
              placeholder="Enter verification code"
              value={userInputCode}
              onChange={(e) => setUserInputCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-green-500 w-full pb-2"
              required
            />
          )}
        </div>

        {!isVerificationVisible ? (
          <button
            className="bg-green-800 rounded-full px-16 py-3 text-white font-semibold w-3/4"
            onClick={handleEmailSubmit}
          >
            Sign Up
          </button>
        ) : (
          <button
            className="bg-green-700 rounded-full px-16 py-3 text-white font-semibold w-3/4"
            onClick={handleVerifyCode}
          >
            Verify
          </button>
        )}

        <p className="text-center">
          Already have an account?{" "}
          <Link to="/signin" className="underline hover:text-blue-500">
            Sign In
          </Link>
        </p>

        {errorMessage && (
          <div className="message font-grotesk text-red-600">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="message font-grotesk text-green-600">{successMessage}</div>
        )}
      </div>
    </div>
  );
};

export default SignUp;

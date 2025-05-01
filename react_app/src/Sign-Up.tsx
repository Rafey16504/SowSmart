import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

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
      const response = await axios.post("https://sowsmart.onrender.com/get-farmer", {
        email: email,
      });
      if (response.data.success) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      setErrorMessage("Please enter your email!");
      return;
    }

    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email!");
      return;
    }

    if ((await checkExisting()) === true) {
      setErrorMessage("Email already exists. Please sign in!");
    } else {
      setSuccessMessage("Please wait while we send you a verification code!");
      try {
        const { data } = await axios.post("https://sowsmart.onrender.com/send-email/", {
          email,
        });

        setIsVerificationVisible(true);
        setSuccessMessage("Check your email for the verification code!");
        setVerificationCode(data.message);
      } catch (error) {
        setErrorMessage("Error sending email. Please try again!");
      }
    }
  };

  const handleVerifyCode = () => {
    if (userInputCode !== verificationCode) {
      setErrorMessage("Invalid code. Please try again.");
      return;
    }

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

  setTimeout(() => {
    setErrorMessage("");
  }, 3000);

  return (
    <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
      <div className="w-full h-full bg-white flex flex-col items-center justify-center space-y-8">
        <div className="text-center -mt-16">
          <h1 className="font-grotesk font-extrabold text-6xl text-green-800">
            SowSmart
          </h1>
        </div>

        <div className="w-9/12 h-1/6">
          <p className="font-grotesk font-semibold text-5xl text-green-700">
            Welcome
          </p>
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
          <div className="message font-grotesk text-green-600">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
import { useState, useEffect } from "react";

function Feedback() {
  const [feedback, setFeedback] = useState("");
  const [submittedFeedback, setSubmittedFeedback] = useState([]);

  useEffect(() => {
    const savedFeedback = JSON.parse(localStorage.getItem("feedback")) || [];
    setSubmittedFeedback(savedFeedback);
  }, []);

  const handleSubmit = () => {
    if (feedback.trim() === "") return;

    const newFeedback = [...submittedFeedback, feedback];
    setSubmittedFeedback(newFeedback);
    localStorage.setItem("feedback", JSON.stringify(newFeedback));
    setFeedback("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Feedback</h1>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write your feedback here..."
          rows="4"
        ></textarea>
        <button
          className="w-full bg-blue-500 text-white p-2 rounded-lg mt-3 hover:bg-blue-600 transition"
          onClick={handleSubmit}
        >
          Submit
        </button>

        <h2 className="text-xl font-semibold mt-6 mb-2">Previous Feedback</h2>
        <ul className="max-h-40 overflow-y-auto border-t pt-2">
          {submittedFeedback.length === 0 ? (
            <p className="text-gray-500 text-sm">No feedback submitted yet.</p>
          ) : (
            submittedFeedback.map((fb, index) => (
              <li
                key={index}
                className="p-2 bg-gray-100 rounded-lg mt-2 shadow-sm text-gray-700"
              >
                {fb}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default Feedback;

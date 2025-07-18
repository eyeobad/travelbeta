import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ReserveVacation() {
  const { vacationId } = useParams();
  const navigate = useNavigate();
  const [vacationDetail, setVacationDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch vacation details on mount
  useEffect(() => {
    const fetchVacationDetail = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/vacations/${vacationId}/`);
        if (!response.ok) {
          throw new Error("Failed to fetch vacation details");
        }
        const data = await response.json();
        setVacationDetail(data);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (vacationId) {
      fetchVacationDetail();
    } else {
      setFetchError("No vacation ID provided.");
      setLoading(false);
    }
  }, [vacationId]);

  // Handle form submission for reservation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setSuccessMessage("");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/vacations/${vacationId}/reserve/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          surname: surname,
          phone_number: phoneNumber,
          email: email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Reservation failed");
      }
      setSuccessMessage("Your reservation was submitted successfully. We will contact you soon!");
      // Clear form fields
      setFirstName("");
      setSurname("");
      setPhoneNumber("");
      setEmail("");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Close modal: navigate back or to a specific route
  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl relative overflow-y-auto max-h-screen">
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column: Reservation Form */}
          <div>
            <h2 className="text-2xl font-bold mb-4">PACKAGE RESERVATION</h2>
            <p className="mb-4">Provide your contact information. We'll handle your enquiry.</p>
            {formError && <p className="text-red-600 mb-2">{formError}</p>}
            {successMessage && (
              <p className="text-green-600 mb-2 font-semibold">{successMessage}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">First Name</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded w-full p-2"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Surname</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded w-full p-2"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded w-full p-2"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  className="border border-gray-300 rounded w-full p-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4 flex space-x-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="bg-[#FFC107] text-black font-bold py-2 px-4 rounded hover:bg-[#e6ac0c] transition-colors"
                >
                  {formLoading ? "Submitting..." : "Submit Reservation"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-black font-bold py-2 px-4 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Right column: Dynamic Summary Section */}
          <div className="bg-gray-100 p-6 rounded">
            {loading ? (
              <p>Loading package details...</p>
            ) : vacationDetail ? (
              <>
                <h2 className="text-xl font-bold">{vacationDetail.package_name}</h2>
                <p className="text-lg mt-2">
                  1 or {vacationDetail.number_of_adults} Adults at{" "}
                  <strong>₦{Number(vacationDetail.price).toLocaleString()}</strong>
                </p>
                <p className="mt-4">
                  We are very approachable and would be happy to assist you.
                  Feel free to reach out via email, text us, or simply complete
                  the enquiry form.
                </p>
                <p className="mt-2 font-bold">
                  tourist@travelbeta.com
                  <br />
                  hotels@travelbeta.com
                  <br />
                  090 000 0111
                </p>
              </>
            ) : (
              <p className="text-red-600">Failed to load vacation details.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

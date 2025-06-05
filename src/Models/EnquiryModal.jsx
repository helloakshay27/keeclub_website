import React, { useState, useEffect } from "react";

const EnquiryModal = ({ isOpen, onClose, onSubmit, projectId }) => {
  const [formData, setFormData] = useState({
    first_name: localStorage.getItem("first_name") || "",
    last_name: localStorage.getItem("last_name") || "",
    mobile_number: localStorage.getItem("mobile_number") || "",
    email: localStorage.getItem("email") || "",
    user_id: localStorage.getItem("id") || "",
    project_id: projectId || "",
  });

  // Sync formData when modal opens or projectId changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        first_name: localStorage.getItem("first_name") || "",
        last_name: localStorage.getItem("last_name") || "",
        mobile_number: localStorage.getItem("mobile_number") || "",
        email: localStorage.getItem("email") || "",
        user_id: localStorage.getItem("id") || "",
        project_id: projectId || "",
      });
    }
  }, [isOpen, projectId ,localStorage.getItem("first_name"), localStorage.getItem("last_name"), localStorage.getItem("mobile_number"), localStorage.getItem("email"), localStorage.getItem("id")]);

  // Auto submit form 2 seconds after modal opens, then close modal
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onSubmit({ enquiry_form: formData });
        onClose();
      }, 2000); // 2 seconds delay to show modal briefly

      return () => clearTimeout(timer);
    }
  }, [isOpen, formData, onSubmit, onClose]);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-title"
      aria-describedby="enquiry-description"
    >
      <div className="bg-white rounded-md p-6 w-80 text-center shadow-lg">
        <div className="flex justify-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
            alt="Confirmed"
            className="w-12 h-12"
          />
        </div>
        <h2
          id="enquiry-title"
          className="font-semibold underline text-lg mb-2 text-[#003366]"
        >
          Enquiry Confirmed!!
        </h2>
        <p id="enquiry-description" className="text-sm mb-6">
          Our sales executive will contact you within 3 working days.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-[#FF5722] hover:bg-[#e64a19] text-white rounded-md font-Poppins text-[16px] transition"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default EnquiryModal;

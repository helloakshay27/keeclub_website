import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import BASE_URL from "../Confi/baseurl"

const SiteVisitModal = ({ isOpen, onClose, onSubmit, projectId }) => {
    const [siteSchedules, setSiteSchedules] = useState([]);
    const [formData, setFormData] = useState({
        scheduled_at: "",
        site_schedule_id: "",
        project_id: projectId || "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                scheduled_at: "",
                site_schedule_id: "",
                project_id: projectId || "",
            });
            setError("");
            setLoading(false);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, projectId]);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "scheduled_at") {
            try {
                setLoading(true);
                const formattedDate = new Date(value).toLocaleDateString("en-GB"); // "dd/mm/yyyy"

                const response = await fetch(
                    `${BASE_URL}site_schedules.json?q[project_id_null]=${projectId}&q[start_date_null]=${formattedDate}&q[end_date_null]=${formattedDate}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + localStorage.getItem("salesforce_access_token"),
                        },
                    }
                );

                const data = await response.json();
                setSiteSchedules(data.site_visits || []);
            } catch (err) {
                console.error("Failed to load site schedule:", err);
                setSiteSchedules([]);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.scheduled_at) {
            setError("Please select a valid date.");
            return;
        }

        if (!formData.site_schedule_id) {
            setError("Please select a time slot.");
            return;
        }

        setLoading(true);

        const payload = {
            site_schedule_request: {
                scheduled_at: new Date(formData.scheduled_at).toISOString(),
                project_id: Number(formData.project_id),
                site_schedule_id: Number(formData.site_schedule_id),
            },
        };

        try {
            const res = await fetch(
                `${BASE_URL}site_schedule_requests`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("salesforce_access_token")}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                throw new Error(`Failed: ${res.statusText}`);
            }

            const data = await res.json();
            toast.success("Site visit booked successfully!");
            setLoading(false);
            onSubmit(data);
            onClose();
        } catch (e) {
            setError(e.message || "Submission failed");
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
                <h2 className="text-2xl font-semibold mb-5 text-gray-800">
                    Book a Site Visit
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <label className="block text-left font-medium mb-1" htmlFor="scheduled_at">
                        Prefer Date                    </label>
                    <input
                        type="date"
                        id="scheduled_at"
                        name="scheduled_at"
                        value={formData.scheduled_at}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                        disabled={loading}
                    />

                    {siteSchedules.length > 0 && (
                        <div className="mt-2">
                            <label className="block text-left font-medium mb-1" htmlFor="site_schedule_id">
                                Prefer Time                            </label>
                            <select
                                id="site_schedule_id"
                                name="site_schedule_id"
                                value={formData.site_schedule_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                                required
                            >
                                <option value="">-- Select Time Slot --</option>
                                {siteSchedules.map((schedule) => (
                                    <option key={schedule.id} value={schedule.id}>
                                        {schedule.ampm_timing}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            className="px-5 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#FF5722] hover:bg-[#e64a19] text-white rounded-md font-Poppins text-[16px] transition"
                            disabled={loading}
                        >
                            {loading ? "Booking..." : "Book Visit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SiteVisitModal;

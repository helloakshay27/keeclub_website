import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useApiFetch from "../../hooks/useApiFetch";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useApiFetch("https://piramal-loyalty-dev.lockated.com/events.json");

  const events = data?.events || [];
  const event = events[parseInt(id)];

  if (!event) return <div className="text-center py-10 text-red-500">Event not found</div>;

  const images = [event.attachfile?.document_url];

  return (
    <div className="px-4 py-4 sm:py-6 md:py-10 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 text-orange-600 font-semibold text-base sm:text-lg mb-6 sm:mb-10 flex-wrap">
        <button onClick={() => navigate(-1)} className="hover:text-orange-800 cursor-pointer">
          <ArrowLeft size={22} className="sm:size-6" />
        </button>
        <span className="text-sm sm:text-lg">{event.event_name}</span>
      </div>

      <h2 className="text-base sm:text-xl font-semibold mb-4 uppercase">Event Pictures</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {images.map((img, i) => (
          <img
            key={i}
            src={img || "https://via.placeholder.com/400x300?text=No+Image"}
            alt={`Event ${i + 1}`}
            className="w-full h-auto max-h-[320px] object-cover rounded shadow"
          />
        ))}
      </div>
    </div>
  );
};

export default EventDetail;

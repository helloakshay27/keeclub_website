import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useApiFetch from "../../hooks/useApiFetch";

const EventDetail = () => {
  const token = localStorage.getItem("authToken");
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useApiFetch(`https://piramal-loyalty-dev.lockated.com/events/${id}.json`, token);

  const events = data?.event_images || [];
  const event = events[parseInt(id)];
  const images = [data?.event_images];


  if (!event) return <div className="text-center py-10 text-red-500">Event not found</div>;



  return (
    <div className="px-4 py-4 sm:py-6 md:py-10 max-w-7xl md:mt-20 mx-auto">
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
            src={img.document_url || "https://via.placeholder.com/400x300?text=No+Image"}
            alt={`Event ${i + 1}`}
            className="w-full h-auto max-h-[320px] object-cover rounded shadow"
          />
        ))}
      </div>
    </div>
  );
};

export default EventDetail;

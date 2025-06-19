import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useApiFetch from "../../hooks/useApiFetch";

const EventDetail = () => {
  const token = localStorage.getItem("authToken");
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useApiFetch(`https://piramal-loyalty-dev.lockated.com/events/${id}.json`, token);

  const event = data && data.id;
  const images = [data?.attachfile];


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
        {images?.map((img, i) => (
          <img
            key={i}
            src={img?.document_url}
            alt={`Event ${i + 1}`}
            className="w-full h-auto max-h-[320px] object-cover rounded shadow"
          />
        ))}
      </div>
    </div>
  );
};

export default EventDetail;


// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";

// const staticEvents = [
//   {
//     id: "1",
//     event_name: "Luxury Movie Night",
//     project_name: "Piramal Mahalaxmi",
//     from_time: "2024-02-20T18:00:00",
//     attachfile: {
//       document_url: "https://images.pexels.com/photos/799137/pexels-photo-799137.jpeg?auto=compress&cs=tinysrgb&w=600"
//     }
//   },
//   {
//     id: "2",
//     event_name: "Art & Wine Evening",
//     project_name: "Piramal Aranya",
//     from_time: "2024-03-10T19:00:00",
//     attachfile: {
//       document_url: "https://images.pexels.com/photos/670702/pexels-photo-670702.jpeg?auto=compress&cs=tinysrgb&w=600"
//     }
//   },
//   {
//     id: "3",
//     event_name: "Wellness Retreat",
//     project_name: "Piramal Revanta",
//     from_time: "2024-04-05T08:30:00",
//     attachfile: {
//       document_url: "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=600"
//     }
//   },
//   {
//     id: "4",
//     event_name: "Private Concert Night",
//     project_name: "Piramal Vaikunth",
//     from_time: "2024-05-15T20:00:00",
//     attachfile: {
//       document_url: "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=600"
//     }
//   }
// ];

// const EventDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // Match event based on URL param
//   const event = staticEvents.find((e) => e.id === id);
//   const images = event?.attachfile ? [event.attachfile] : [];

//   if (!event) {
//     return <div className="text-center py-10 text-red-500">Event not found</div>;
//   }

//   return (
//     <div className="px-4 py-4 sm:py-6 md:py-10 max-w-7xl md:mt-20 mx-auto">
//       <div className="flex items-center gap-2 text-orange-600 font-semibold text-base sm:text-lg mb-6 sm:mb-10 flex-wrap">
//         <button onClick={() => navigate(-1)} className="hover:text-orange-800 cursor-pointer">
//           <ArrowLeft size={22} className="sm:size-6" />
//         </button>
//         <span className="text-sm sm:text-lg">{event.event_name}</span>
//       </div>

//       <h2 className="text-base sm:text-xl font-semibold mb-4 uppercase">Event Pictures</h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
//         {images.map((img, i) => (
//           <img
//             key={i}
//             src={img.document_url}
//             alt={`Event ${i + 1}`}
//             className="w-full h-auto max-h-[320px] object-cover rounded shadow"
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default EventDetail;


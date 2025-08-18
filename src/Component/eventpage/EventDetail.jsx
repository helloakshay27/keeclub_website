import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useApiFetch from "../../hooks/useApiFetch";
import BASE_URL from "../../Confi/baseurl";

const EventDetail = () => {
  const token = localStorage.getItem("authToken");
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useApiFetch(`${BASE_URL}events/${id}.json`, token);

  const event = data && data.id;
  // Use data.event_images if available, else fallback to single attachfile
  const images = Array.isArray(data?.event_images) && data.event_images.length > 0
    ? data.event_images
    : data?.attachfile
      ? [data.attachfile]
      : [];

  if (!event)
    return (
      <div className="text-center py-10 text-red-500">Event not found</div>
    );
  console.log("Event Data:", data);

  return (
    <div className="px-4 py-4 sm:py-6 md:py-10 max-w-7xl md:mt-20 mx-auto">
      <div className="flex items-center gap-2 text-orange-600 font-semibold text-base sm:text-lg mb-6 sm:mb-10 flex-wrap">
        <button
          onClick={() => navigate(-1)}
          className="hover:text-orange-800 cursor-pointer"
        >
          <ArrowLeft size={22} className="sm:size-6" />
        </button>
        <span className="text-sm sm:text-lg">{data?.event_name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Event Images */}
        <div>
          <h2 className="text-base sm:text-xl font-semibold mb-4">
            Event Pictures
          </h2>
          <div className="space-y-4">
            {images?.map((img, i) => (
              <div key={i} className="rounded-lg overflow-hidden shadow-md">
                <img
                  src={img?.document_url}
                  alt={`Event ${i + 1}`}
                  className="w-full h-auto max-h-[300px] object-cover"
                />
              </div>
            ))}
          </div>
          
          {/* Map Section */}
          {/* {data?.project_name && (
            <div className="mt-6">
              <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
                <span className="text-gray-500">Map Location - {data.project_name}</span>
              </div>
            </div>
          )} */}
        </div>

        {/* Right Column - Event Details */}
        <div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event</h1>
            
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <span className="text-sm text-gray-600 font-medium">
                  {data?.from_time ? new Date(data.from_time).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Date TBD'}
                </span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {data?.event_type || 'Experiences'}
                </span>
              </div>

              {/* <p className="text-gray-700 text-sm leading-relaxed">
                {data?.description || `A Premier Outdoors takes place on June 19, July 26, and August 14 at the Picnic Shelter.`}
              </p> */}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Project:</span>
                  <div className="font-medium">{data?.project_name || 'Piramal Revanta'}</div>
                </div>
                <div>
                  <span className="text-gray-500">Event ID:</span>
                  <div className="font-medium">{data?.id || 'N/A'}</div>
                </div>
                
                <div>
                  <span className="text-gray-500">Event Type:</span>
                  <div className="font-medium">{data?.event_type || 'Entertainment'}</div>
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <div className="font-medium">
                    {data?.from_time && data?.to_time ? 
                      (() => {
                        const from = new Date(data.from_time);
                        const to = new Date(data.to_time);
                        const diffHours = Math.round((to - from) / (1000 * 60 * 60));
                        return diffHours > 24 ? `${Math.round(diffHours / 24)} days` : `${diffHours} hours`;
                      })() 
                      : '2 hours'
                    }
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-500">Event At:</span>
                  <div className="font-medium">{data?.event_at || 'Mumbai'}</div>
                </div>
                <div>
                  <span className="text-gray-500">Time:</span>
                  <div className="font-medium">
                    {data?.from_time ? new Date(data.from_time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    }) : '12 PM'}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <span className="text-gray-500">Event From:</span>
                  <div className="font-medium">
                    {data?.from_time ? new Date(data.from_time).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : '14 August, 2024'}
                  </div>
                </div>

                {data?.to_time && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Event To:</span>
                    <div className="font-medium">
                      {new Date(data.to_time).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                )}

                {/* {data?.interested !== undefined && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Interested People:</span>
                    <div className="font-medium">{data.interested} people interested</div>
                  </div>
                )} */}
              </div>

              {/* <div className="pt-4">
                <p className="text-xs text-gray-500 mb-4">
                  This is a free event, but registration is required. Click "Get Tickets" to register.
                </p>
                
                <button className="w-full bg-gray-800 text-white py-3 px-6 rounded font-medium hover:bg-gray-900 transition-colors">
                  Get Ticket
                </button>
              </div> */}
            </div>
          </div>
        </div>
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
//   );
// };

// export default EventDetail;

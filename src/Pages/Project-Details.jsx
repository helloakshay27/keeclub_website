import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Share2 } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ProjectDetail = () => {
  const { id } = useParams();
  const galleryRef = useRef(null);
  const amenitiesRef = useRef(null);
  const highlightsRef = useRef(null);
  const videoGalleryRef = useRef(null);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Gallery");
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://piramal-loyalty-dev.lockated.com/get_all_projects.json`,
          {
            headers: {
              // Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;

        const projects = Array.isArray(data) ? data : data.projects;

        const selectedProject = projects.find(
          (p) => p.id.toString() === id.toString()
        );

        if (selectedProject) {
          setProject(selectedProject);
        } else {
          setError("Project not found");
        }
      } catch (error) {
        setError("Error fetching project data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleGoBack = () => {
    window.history.back();
  };

  const openGalleryModal = (image) => {
    setSelectedGalleryImage(image);
    setShowGalleryModal(true);
  };

  const closeGalleryModal = () => {
    setShowGalleryModal(false);
  };

  const openVideoModal = (url) => {
    setSelectedVideoUrl(url);
  };

  const closeModal = () => {
    setSelectedVideoUrl(null);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: project.project_name || project.name,
          text: `Check out ${project.project_name || project.name} in ${
            project.location?.city || "Mumbai"
          }`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4 text-center">
        <p className="text-xl text-gray-600 mb-2">Error Loading Project</p>
        <p className="text-sm text-gray-500">{error}</p>
        <button
          onClick={handleGoBack}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Project not found</p>
      </div>
    );
  }

  const amenityStyles = {
    Jacuzzi: { bg: "bg-yellow-50", icon: "🕯️", iconColor: "text-yellow-500" },
    "Swimming Pool": {
      bg: "bg-blue-50",
      icon: "🏊‍♂️",
      iconColor: "text-blue-500",
    },
    "Climbing Wall": {
      bg: "bg-cyan-50",
      icon: "🧗‍♂️",
      iconColor: "text-cyan-500",
    },
    "Half Basketball Court": {
      bg: "bg-green-50",
      icon: "🏀",
      iconColor: "text-green-500",
    },
    "Party Lawn": {
      bg: "bg-purple-50",
      icon: "🔲",
      iconColor: "text-purple-800",
    },
    "Squash Court": { bg: "bg-red-50", icon: "🎾", iconColor: "text-red-400" },
    "Jogging/Bicycle Track": {
      bg: "bg-rose-50",
      icon: "👟",
      iconColor: "text-rose-500",
    },
    Spa: { bg: "bg-amber-50", icon: "🕯️", iconColor: "text-amber-500" },
    "Clubhouse Lounge": {
      bg: "bg-violet-50",
      icon: "🔲",
      iconColor: "text-violet-800",
    },
    Gym: { bg: "bg-yellow-50", icon: "🏋️‍♂️", iconColor: "text-yellow-500" },
  };

  const amenities = Object.keys(amenityStyles).map((name) => ({
    name,
    ...amenityStyles[name],
  }));

  const scrollWithOffset = (ref) => {
    if (ref.current) {
      const top =
        ref.current.getBoundingClientRect().top + window.pageYOffset - 110; // offset for header
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="lg:w-1/3 lg:h-screen lg:sticky lg:top-0 p-6">
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-70 rounded-full"
          >
            <ArrowLeft className="text-black" size={20} />
          </button>
        </div>

        <div className="mt-14 mb-6">
          <h1 className="text-2xl font-bold">
            {project.project_name || project.name}
          </h1>
          <p className="text-gray-500 italic">
            {project.location?.city || "Mumbai"}
          </p>
          <button className="mt-2 px-2 py-1 text-indigo-700 bg-indigo-100 bg-opacity-50 rounded text-sm">
            {project.status || "Under Construction"}
          </button>
        </div>

        <hr className="my-4 border-gray-200" />

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Project Details</h2>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-gray-500 uppercase tracking-wider">AREA</p>
              <p className="font-bold text-base">
                {project.land_area || "6.84"} {project.land_uom || "acres"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 uppercase tracking-wider">
                APARTMENTS
              </p>
              <p className="font-bold text-base">
                {project.configurations && project.configurations.length > 0
                  ? project.configurations
                      .map((config) => config.name)
                      .join(", ")
                  : "2, 3 & 4 BHK"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 uppercase tracking-wider">STARTING</p>
              <p className="font-bold text-base">
                ₹{project.price || "3.16 Cr*"}
              </p>
            </div>
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <button
            className={`cursor-pointer text-center py-2 ${
              activeTab === "Gallery"
                ? "text-indigo-700 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("Gallery");
              scrollWithOffset(galleryRef);
            }}
          >
            Gallery
          </button>
          <button
            className={`cursor-pointer text-center py-2 ${
              activeTab === "Amenities"
                ? "text-indigo-700 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("Amenities");
              scrollWithOffset(amenitiesRef);
            }}
          >
            Amenities
          </button>
          <button
            className={` cursor-pointer text-center py-2 ${
              activeTab === "Highlights"
                ? "text-indigo-700 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("Highlights");
              scrollWithOffset(highlightsRef);
            }}
          >
            Highlights
          </button>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button className="flex-1 bg-orange-500 text-white py-2 rounded-md font-medium">
            Enquire Now
          </button>
          <button
            className="flex-1 border-2 border-gray-200 py-2 rounded-md cursor-pointer text-gray-600 hover:bg-gray-100 transition duration-200"
            onClick={() => Navigate("/login")}
          >
            Book A Site Visit
          </button>
        </div>

        {/* RERA Details */}
        <div className="border-2 border-gray-200 rounded p-3 text-gray-600">
          <p className="font-medium">RERA Details</p>
          <p className="text-sm break-all">
            {project.rera_number_multiple?.length > 0
              ? project.rera_number_multiple.join(" | ")
              : project.rera_number ||
                "P51900015854 | P51900016482 | P51900021057"}
          </p>
          <p className="text-sm break-all">
            {project.rera_url || "https://maharera.mahaonline.gov.in/"}
          </p>
        </div>
      </div>

      {/* Right Panel (Content) */}
      <div className="lg:w-2/3 mr-5">
        {/* Main Project Image */}
        <div className="w-full h-64 sm:h-96 md:h-[300px] relative">
          <img
            src={
              project.image_url ||
              "https://piramalprod.s3.ap-south-1.amazonaws.com/Document/Project/2/21521044.jpg"
            }
            alt={project.project_name || project.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Project Content */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-6 relative">
            <div>
              <h1 className="text-2xl font-bold">
                {project.project_name || project.name}
              </h1>
              <p className="text-gray-500">
                {project.location?.city || "Mumbai"}
              </p>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md"
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>

          <h2 className="text-xl font-bold mb-3">Project Description</h2>
          <p className="text-gray-700 mb-8">
            {project.project_description ||
              "Located in a scenic setting that overlooks the Mahalaxmi Racecourse and the Arabian Sea. Piramal Mahalaxmi is the new address for luxury in maximum city Mumbai. The project has three landmark towers i.e. Tower I (South), Tower II (Central), and Tower III (North), each offering unique breathtaking views and unparalleled luxuries. Piramal Mahalaxmi project is a luxurious residential development like no other"}
          </p>

          {/* Gallery Section */}
          <div className="mb-8" ref={galleryRef}>
            <h2 className="text-3xl font-bold mb-6">Gallery</h2>
            <div className="flex flex-row gap-4">
              {/* Main Large Image */}
              <div
                className="flex-shrink-0 w-[40%] aspect-[3/2] overflow-hidden rounded"
                onClick={() =>
                  openGalleryModal(
                    project.gallery_image?.[0]?.attachfiles?.[0]?.document_url
                  )
                }
              >
                <img
                  src={
                    project.gallery_image?.[0]?.attachfiles?.[0]
                      ?.document_url || "/api/placeholder/800/600"
                  }
                  alt="Main Gallery"
                  className="w-full h-full object-cover rounded"
                />
              </div>

              {/* 5 Equal Sized Images in a Row */}
              <div className="grid grid-cols-5 gap-4 w-[60%]">
                {project.gallery_image
                  ?.flatMap((galleryItem, galleryIndex) =>
                    galleryItem.attachfiles
                      ?.slice(galleryIndex === 0 ? 1 : 0) // Skip the first image
                      .map((file, fileIndex) => (
                        <div
                          key={`${galleryIndex}-${fileIndex}`}
                          className="aspect-[3/4] overflow-hidden rounded cursor-pointer"
                          onClick={() => openGalleryModal(file.document_url)}
                        >
                          <img
                            src={file.document_url}
                            alt={`Gallery Image ${fileIndex}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                  )
                  .slice(0, 5)}
              </div>
            </div>
          </div>

          <div className="mb-8" ref={videoGalleryRef}>
            <h2 className="text-3xl font-bold mb-6">Video Gallery</h2>
            <div className="flex flex-row gap-4">
              {/* Main Large Video */}
              <div
                className="flex-shrink-0 w-[40%] aspect-[3/2] overflow-hidden rounded cursor-pointer"
                onClick={() =>
                  openVideoModal(project.videos?.[0]?.document_url)
                }
              >
                <video
                  controls
                  src={
                    project.videos?.[0]?.document_url ||
                    "/api/placeholder/video.mp4"
                  }
                  className="w-full h-full object-cover rounded"
                />
              </div>

              {/* 5 Equal Sized Videos in a Row */}
              <div className="grid grid-cols-5 gap-4 w-[60%]">
                {project.videos
                  ?.slice(1) // Skip the first video (already shown as main)
                  .slice(0, 5) // Limit to 5 thumbnails
                  .map((videoItem, index) => (
                    <div
                      key={index}
                      className="aspect-[3/4] overflow-hidden rounded cursor-pointer"
                      onClick={() => openVideoModal(videoItem.document_url)}
                    >
                      <video
                        src={videoItem.document_url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Brochures Section */}
          <div className="mt-8">
            <h2 className="text-xl text-[#130E2F] font-bold font-Poppins mb-3">
              Brochures
            </h2>
            <div className="p-3 rounded-lg w-[300px] font-Montserrat z-10 bg-gray-200 p-4 rounded-xl cursor-pointer border-white border-2 hover:border-primary ">
              <div className="flex items-center mb-3">
                <div
                  className="w-10 h-10 bg-red-600 text-white cursor-pointer font-semibold flex items-center justify-center text-sm rounded mr-2"
                  onClick={() => {
                    const url = project.brochure?.document_url;
                    if (url) {
                      window.open(url, "_blank");
                    }
                  }}
                >
                  PDF
                </div>
                <span className="text-lg font-medium text-gray-800">PDF</span>
              </div>
              <div className="bg-white rounded overflow-hidden">
                <div className="aspect-[16/9] bg-gray-200 relative">
                  <iframe
                    src={project.brochure?.document_url}
                    title="Brochure Preview"
                    className="w-full h-[150px] border-none"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="mb-8 mt-8" ref={amenitiesRef}>
            <h2 className="text-xl font-bold mb-4">Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {project.amenities?.length > 0
                ? project.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="p-2 flex items-center space-x-3 rounded-lg"
                      style={{ border: "2px solid #e4e7ec" }}
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <img
                          src={amenity.icon_url || "/api/placeholder/32/32"}
                          alt={amenity.name}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <span className="text-base text-gray-800 font-medium">
                        {amenity.name}
                      </span>
                    </div>
                  ))
                : [
                    "Swimming Pool",
                    "Gym",
                    "Garden",
                    "Children Play Area",
                    "Club House",
                    "Security",
                    "Indoor Games",
                    "Jogging Track",
                  ].map((name, index) => (
                    <div
                      key={index}
                      className="p-2 flex items-center space-x-3 rounded-lg"
                      style={{ border: "2px solid #e4e7ec" }}
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <img
                          src="/api/placeholder/32/32"
                          alt={name}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <span className="text-base text-gray-800 font-medium">
                        {name}
                      </span>
                    </div>
                  ))}
            </div>
          </div>

          {/* Location Highlights Section */}
          <div className="flex gap-6 mb-7" ref={highlightsRef}>
            <div className="w-full">
              <h2 className="text-2xl font-bold mb-4">Location Highlights</h2>
              <div className="h-[500px] bg-gray-100 rounded overflow-hidden shadow-md w-full">
                {project.map_url ? (
                  <iframe
                    src="https://maps.google.com/maps?width=600&height=400&hl=en&q=Piramal Revanta Sales Office&t=&z=13&ie=UTF8&iwloc=B&output=embed"
                    title="Google Map"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                ) : (
                  <img
                    src="/api/placeholder/600/400?text=Location Map"
                    alt="Location map"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            <div className="w-full flex flex-col gap-4 mt-12">
              {[
                { label: "Railway Station", icon: "🚉" },
                { label: "Bus Depot", icon: "🚌" },
                { label: "Mall", icon: "🏙️" },
                { label: "School", icon: "🏫" },
                { label: "Restaurants", icon: "🍽️" },
                { label: "Medical Center", icon: "🏥" },
                { label: "Airport", icon: "✈️" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="flex items-center justify-between px-4 py-3 bg-white border rounded shadow-sm hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-gray-800 font-medium">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Disclaimer Section */}
          <div className="bg-white px-1 md:px-1 mb-5 py-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Disclaimer</h2>
            <p className="text-normal leading-relaxed">
              {project.project_disclaimer}
            </p>
          </div>

          {/* Highlights Tab Content */}
          {/* <div>
            <h2 className="text-xl font-medium mb-4">Highlights</h2>
            <div className="space-y-4">
              <div className="mt-6">
                <h3 className="font-medium mb-3">Project Information</h3>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-600">
                  <li>• Towers: {project.no_of_towers || '3'}</li>
                  <li>• Apartments: {project.no_of_apartments || 'Premium'}</li>
                  <li>• Floors: {project.no_of_floors || 'Multiple'}</li>
                  <li>• Status: {project.status || 'Under Construction'}</li>
                  <li>• Land Area: {project.land_area || '6.84'} {project.land_uom || 'acres'}</li>
                  <li>• Starting Price: ₹{project.price || '3.16 Cr*'}</li>
                </ul>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-3">Key Features</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Luxury residential towers with breathtaking views</li>
                  <li>• Prime location overlooking Mahalaxmi Racecourse</li>
                  <li>• State-of-the-art amenities and facilities</li>
                  <li>• Premium living experience in Mumbai</li>
                </ul>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeGalleryModal}
        >
          <div className="max-w-4xl max-h-full p-4">
            <img
              src={selectedGalleryImage || "/api/placeholder/800/600"}
              alt="Gallery view"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <button
            className="absolute top-4 right-4 text-white"
            onClick={closeGalleryModal}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;

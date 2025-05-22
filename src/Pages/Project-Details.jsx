import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProjectDetail = () => {
  // Extract projectId from URL parameters
  const { id } = useParams();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Gallery');
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
   const [selectedBrochure, setSelectedBrochure] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api-connect.panchshil.com/get_all_projects.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        const data = response.data;
        
        // check if projects is nested or direct
        const projects = Array.isArray(data) ? data : data.projects;

        const selectedProject = projects.find((p) => 
          p.id.toString() === id.toString()
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

   const openBrochure = (url) => {
    setSelectedBrochure(url);
  };

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: project.project_name || project.name,
        text: `Check out ${project.project_name || project.name} in ${project.location?.city || 'Mumbai'}`,
        url: window.location.href,
      })
      .catch(error => console.log('Error sharing', error));
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

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Panel (Project Details) */}
      <div className="lg:w-1/3 lg:h-screen lg:sticky lg:top-0 p-6">
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <button 
            onClick={handleGoBack} 
            className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-70 rounded-full"
          >
            <ArrowLeft className="text-black" size={20} />
          </button>
        </div>

        {/* Project Header */}
        <div className="mt-14 mb-6">
          <h1 className="text-2xl font-bold">{project.project_name || project.name}</h1>
          <p className="text-gray-500 italic">{project.location?.city || 'Mumbai'}</p>
          <button className="mt-2 px-2 py-1 text-indigo-700 bg-indigo-100 bg-opacity-50 rounded text-sm">
            {project.status || 'Under Construction'}
          </button>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* Project Details */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Project Details</h2>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-gray-500 uppercase tracking-wider">AREA</p>
              <p className="font-bold text-base">{project.land_area || '6.84'} {project.land_uom || 'acres'}</p>
            </div>
            
            <div>
              <p className="text-gray-500 uppercase tracking-wider">APARTMENTS</p>
              <p className="font-bold text-base">
                {project.configurations && project.configurations.length > 0 
                  ? project.configurations.map(config => config.name).join(', ') 
                  : '2, 3 & 4 BHK'}
              </p>
            </div>
            
            <div>
              <p className="text-gray-500 uppercase tracking-wider">STARTING</p>
              <p className="font-bold text-base">₹{project.price || '3.16 Cr*'}</p>
            </div>
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <button 
            className={`text-center py-2 ${activeTab === 'Gallery' ? 'text-indigo-700 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Gallery')}
          >
            Gallery
          </button>
          <button 
            className={`text-center py-2 ${activeTab === 'Amenities' ? 'text-indigo-700 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Amenities')}
          >
            Amenities
          </button>
          <button 
            className={`text-center py-2 ${activeTab === 'Highlights' ? 'text-indigo-700 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Highlights')}
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
          <button className="flex-1 border-2 border-gray-200 py-2 rounded-md">
            Book A Site Visit
          </button>
        </div>

        {/* RERA Details */}
        <div className="border-2 border-gray-200 rounded p-3 text-gray-600">
          <p className="font-medium">RERA Details</p>
          <p className="text-sm break-all">
            {project.rera_number_multiple?.length > 0 
              ? project.rera_number_multiple.join(' | ') 
              : (project.rera_number || 'P51900015854 | P51900016482 | P51900021057')}
          </p>
          <p className="text-sm break-all">
            {project.rera_url || 'https://maharera.mahaonline.gov.in/'}
          </p>
        </div>
      </div>

      {/* Right Panel (Content) */}
      <div className="lg:w-2/3">
        {/* Main Project Image */}
        <div className="w-full h-64 sm:h-96 md:h-[500px] relative">
          <img 
            src={project.image?.[0]?.document_url || "https://piramalprod.s3.ap-south-1.amazonaws.com/Document/Project/2/21521044.jpg"} 
            alt={project.project_name || project.name}
            className="w-full h-full object-cover"
          />
          <button 
            onClick={handleShare}
            className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md"
          >
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>

        {/* Project Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{project.project_name || project.name}</h1>
          <p className="text-gray-500 mb-6">{project.location?.city || 'Mumbai'}</p>

          <h2 className="text-xl font-bold mb-3">Project Description</h2>
          <p className="text-gray-700 mb-8">
            {project.project_description || 
             'Located in a scenic setting that overlooks the Mahalaxmi Racecourse and the Arabian Sea. Piramal Mahalaxmi is the new address for luxury in maximum city Mumbai. The project has three landmark towers i.e. Tower I (South), Tower II (Central), and Tower III (North), each offering unique breathtaking views and unparalleled luxuries. Piramal Mahalaxmi project is a luxurious residential development like no other'}
          </p>

          {/* Gallery Section */}
          {activeTab === 'Gallery' && (
            <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {project.gallery_image?.flatMap((galleryItem, index) => 
                galleryItem.attachfiles?.map((file, fileIndex) => (
                  <div 
                    key={`${index}-${fileIndex}`} 
                    className="relative h-32 rounded overflow-hidden cursor-pointer"
                    onClick={() => openGalleryModal(file.document_url)}
                  >
                    <img 
                      src={file.document_url || "/api/placeholder/400/320"} 
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) || Array(6).fill(0).map((_, index) => (
                <div 
                  key={index} 
                  className="relative h-32 rounded overflow-hidden cursor-pointer"
                  onClick={() => openGalleryModal(`/api/placeholder/400/320?text=Image${index+1}`)}
                >
                  <img 
                    src={`/api/placeholder/400/320?text=Image${index+1}`}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          )}

            <div className="mt-8 flex flex-col">
            <h2 className="z-10 text-xl text-[#130E2F] my-2 font-bold font-Poppins">Brochures</h2>
            <div className="bg-gray-100 p-4 rounded">
              <div className="mb-2">
                <button 
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded mr-2"
                  onClick={() => setSelectedBrochure(project.brochure?.document_url || null)}
                >
                  PDF
                </button>
                <button 
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded"
                  onClick={() => setSelectedBrochure(project.Project_PPT?.[0]?.attachfiles?.[0]?.document_url || null)}
                >
                  PPT
                </button>
              </div>
              
              <div className="border bg-white rounded overflow-hidden">
                <div className="aspect-[4/3] bg-gray-50 relative">
                  {selectedBrochure ? (
                    <iframe 
                      src={selectedBrochure}
                      className="w-full h-full"
                      title="Brochure preview"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <img 
                        src="/api/placeholder/400/320?text=Brochure Preview" 
                        alt="Brochure preview"
                        className="max-w-full max-h-full"
                      />
                    </div>
                  )}
                </div>
                <div className="h-6 bg-gray-100 border-t flex items-center justify-center">
                  <div className="w-1/2 h-2 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {project.amenities?.map((amenity, index) => (
                <div 
                  key={index} 
                  className="border border-gray-100 rounded p-3 flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                    <img 
                      src={amenity.icon_url || "/api/placeholder/32/32"} 
                      alt={amenity.name} 
                      className="w-4 h-4 object-contain"
                    />
                  </div>
                  <span className="text-sm">{amenity.name}</span>
                </div>
              )) || [
                { name: 'Jacuzzi', icon: '🛀' },
                { name: 'Swimming Pool', icon: '🏊' },
                { name: 'Climbing Wall', icon: '🧗' },
                { name: 'Gym', icon: '🏋️' },
                { name: 'Children\'s Play Area', icon: '🧒' },
                { name: 'Garden', icon: '🌳' }
              ].map((amenity, index) => (
                <div 
                  key={index} 
                  className="border border-gray-100 rounded p-3 flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                    <span className="text-sm">{amenity.icon}</span>
                  </div>
                  <span className="text-sm">{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Location Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Location</h2>
            <div className="aspect-video bg-gray-100 rounded overflow-hidden">
              {project.map_url ? (
                <iframe 
                  src={project.map_url} 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  allowFullScreen 
                  loading="lazy"
                  title="Project location"
                ></iframe>
              ) : (
                <img 
                  src="/api/placeholder/600/400?text=Location Map"
                  alt="Location map"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <p className="mt-2 text-gray-600 text-sm">
              {project.location?.addressLine1 || ''} 
              {project.location?.addressLine1 && project.location?.address_line_two ? ', ' : ''}
              {project.location?.address_line_two || ''}
              {(project.location?.addressLine1 || project.location?.address_line_two) && project.location?.city ? ', ' : ''}
              {project.location?.city || ''}
              {project.location?.pin_code ? ` - ${project.location.pin_code}` : ''}
            </p>
          </div>

          {/* Highlights Tab Content */}
          {activeTab === 'Highlights' && (
            <div>
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
            </div>
          )}
        </div>
      </div>

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" onClick={closeGalleryModal}>
          <div className="max-w-4xl max-h-full p-4">
            <img 
              src={selectedGalleryImage || "/api/placeholder/800/600"} 
              alt="Gallery view" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <button className="absolute top-4 right-4 text-white" onClick={closeGalleryModal}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
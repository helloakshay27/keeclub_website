import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../Confi/baseurl"

const categories = [
    "All",
    "Banking and Finance",
    "Contest",
    "Health & Fitness",
    "Home & Interiors",
    "Education",
    "Lifestyle",
    "Home and Real Estate",
];

const POSTS_PER_PAGE = 6;

const LatestPosts = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${BASE_URL}blog_posts.json`)
            .then(res => res.json())
            .then(data => {
                // Use only posts with tag_type 'latest'
                const latest = Array.isArray(data)
                    ? data.filter(post => post.tag_type && post.tag_type.toLowerCase() === "latest")
                    : (Array.isArray(data.latest) ? data.latest : []);
                // Map API data to expected format
                const mapped = latest.map(post => ({
                    id: post.id,
                    title: post.heading,
                    description: post.summary,
                    date: post.publish_date
                        ? new Date(post.publish_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                        : "",
                    comments: post.comments_count === 0 || post.comments_count === null ? "No comments" : `${post.comments_count} comments`,
                    image: post.image_url,
                    category: post.tag_type || "Other",
                }));
                setAllPosts(mapped);
                setLoading(false);
            })
            .catch(() => {
                setAllPosts([]);
                setLoading(false);
            });
    }, []);

    const handleCategoryClick = (cat) => {
        if (cat === "All") {
            setSelectedCategories([]);
            setCurrentPage(1);
        } else {
            const isSelected = selectedCategories.includes(cat);
            const updated = isSelected
                ? selectedCategories.filter((c) => c !== cat)
                : [...selectedCategories, cat];
            setSelectedCategories(updated);
            setCurrentPage(1);
        }
    };

    const filteredPosts =
        selectedCategories.length === 0
            ? allPosts
            : allPosts.filter((post) => selectedCategories.includes(post.category));

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const currentPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    const navigate = useNavigate();

    const handleCardClick = (id) => {
        navigate(`/blog/${id}`);
    };


    return (
        <div className="max-w-[1200px] mx-auto px-4 py-12">
            <h1 className="text-center text-3xl sm:text-4xl font-bold mb-10">LATEST POSTS</h1>
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="col-span-full text-center text-gray-500">Loading...</p>
                    ) : currentPosts.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">No posts found in selected categories.</p>
                    ) : (
                        currentPosts.map((post, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">
                                <div className="relative">
                                    <img src={post.image} alt={post.title} className="w-full h-[200px] object-cover" />
                                    <span className="absolute top-3 right-3 bg-[#6B4F2B] text-white text-xs px-3 py-1 rounded-full">
                                        {post.category}
                                    </span>
                                </div>
                                <div className="p-4 sm:p-5 flex flex-col flex-1">
                                    <h2 className="font-bold text-base sm:text-lg leading-snug mb-2">{post.title}</h2>
                                    <p className="text-gray-600 text-sm sm:text-[15px] mb-4 flex-1">{post.description}...</p>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        handleCardClick(post.id);
                                    }} className="bg-[#FF3C00] cursor-pointer text-white px-4 py-2 rounded text-sm font-semibold w-fit mt-auto hover:bg-[#e53200] transition">
                                        READ MORE →
                                    </button>
                                </div>
                                <div className="bg-gray-100 text-gray-500 text-xs sm:text-sm px-4 py-3 flex justify-between">
                                    <span>{post.date}</span>
                                    <span>{post.comments}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Categories Sidebar */}
                <div className="w-full lg:w-[240px]">
                    <h3 className="text-[#FF3C00] text-lg font-bold mb-4 uppercase tracking-wide">Categories</h3>
                    <ul className="space-y-3 text-[15px]">
                        {categories.map((cat, i) => {
                            const isActive =
                                cat === "All"
                                    ? selectedCategories.length === 0
                                    : selectedCategories.includes(cat);
                            return (
                                <li
                                    key={i}
                                    className={`cursor-pointer flex items-center gap-2 transition ${isActive ? "text-[#FF3C00] font-semibold" : "text-gray-800"
                                        }`}
                                    onClick={() => handleCategoryClick(cat)}
                                >
                                    <span className="text-[#FF3C00]">›</span>
                                    {cat}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            {/* Pagination */}
            {filteredPosts.length > POSTS_PER_PAGE && (
                <div className="flex justify-center mt-10 gap-2 items-center text-sm sm:text-base">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        className={`px-3 py-2 rounded-md ${currentPage === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-800 border hover:bg-gray-100"
                            }`}
                        disabled={currentPage === 1}
                    >
                        «
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 font-semibold cursor-pointer rounded-md ${currentPage === i + 1
                                ? "bg-[#FF3C00] text-white"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                        >
                            {String(i + 1).padStart(2, "0")}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        className={`px-3 py-2 rounded-md ${currentPage === totalPages
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-800 border hover:bg-gray-100"
                            }`}
                        disabled={currentPage === totalPages}
                    >
                        »
                    </button>
                </div>
            )}
        </div>
    );
};

export default LatestPosts;

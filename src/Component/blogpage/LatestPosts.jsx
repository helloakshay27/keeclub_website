import React, { useState } from "react";

const allPosts = [
    {
        title: "Ace the Board Games Trivia: Win Exciting Rewards",
        description: "Play our Board Games Trivia Challenge and win exciting lifestyle vouchers!",
        date: "15th January 2025",
        comments: "No comments",
        image: "https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1736847736952_1736847736629_BlogBannersAllClients.jpg",
        category: "Contest",
    },
    {
        title: "Welcome to the Ultimate Christmas Treasure Hunt! 🎁✨",
        description: "Congratulations, you’re in the game! 🎄 This is the start of our Christmas Treasure Hunt",
        date: "19th December 2024",
        comments: "9 comments",
        image: "https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1734598376035_1734598374974_ChristmasblogGenricBannerV4.jpg",
        category: "Contest",
    },
    {
        title: "Children’s Day – Cartoon Quiz",
        description: "This Children’s Day let’s celebrate the joy and creativity of childhood with a fun Cartoon Quiz! 🧸✨",
        date: "14th November 2024",
        comments: "No comments",
        image: "https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1731330888660_1731330887909_GenrBannerS.jpg",
        category: "Contest",
    },
    {
        title: "WORLD TOURISM DAY",
        description: "World Tourism Day on 27th September celebrates the cultural and economic impact of tourism.",
        date: "27th September 2024",
        comments: "No comments",
        image: "https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1727246811696_1727246811459_Blo.jpg",
        category: "Contest",
    },
    {
        title: "INDEPENDENCE DAY TRIVIA",
        description: "How well do you know the Heroes of our Nation?",
        date: "13th August 2024",
        comments: "No comments",
        image: "https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1723467963601_1723467962863_Independence.jpg",
        category: "Education",
    },
    {
        title: "WORLD MUSIC DAY TRIVIA",
        description: "There’s nothing like hearing your favourite song on a terrible day",
        date: "21st June 2024",
        comments: "No comments",
        image: "https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1718716595685_1718716594614_Music.jpg",
        category: "Health & Fitness",
    },
    {
        title: "WORLD MUSIC DAY TRIVIA",
        description: "There’s nothing like hearing your favourite song on a terrible day",
        date: "21st June 2024",
        comments: "No comments",
        image: "https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1718716595685_1718716594614_Music.jpg",
        category: "Health & Fitness",
    },
];

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

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-12">
            <h1 className="text-center text-3xl sm:text-4xl font-bold mb-10">LATEST POSTS</h1>
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentPosts.length === 0 ? (
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
                                    <button className="bg-[#FF3C00] text-white px-4 py-2 rounded text-sm font-semibold w-fit mt-auto hover:bg-[#e53200] transition">
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
                                    className={`cursor-pointer flex items-center gap-2 transition ${
                                        isActive ? "text-[#FF3C00] font-semibold" : "text-gray-800"
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
                        className={`px-3 py-2 rounded-md ${
                            currentPage === 1
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
                            className={`px-4 py-2 font-semibold cursor-pointer rounded-md ${
                                currentPage === i + 1
                                    ? "bg-[#FF3C00] text-white"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                        >
                            {String(i + 1).padStart(2, "0")}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        className={`px-3 py-2 rounded-md ${
                            currentPage === totalPages
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

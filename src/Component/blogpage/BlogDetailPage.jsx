import React from 'react';
import {
    FaWhatsapp,
    FaFacebookF,
    FaLinkedinIn,
    FaEnvelope,
    FaTwitter
} from 'react-icons/fa';

const BlogDetailPage = () => {

    const slide = {
        bgImage: 'https://piramaluat.s3.ap-south-1.amazonaws.com/Website/Uploads/Piramal/Images/12674882.jpg',
        heading: "Blog",
    };

    const recentPosts = [
        {
            title: "Ace The Board Games Trivia: Win Exciting Rewards",
            date: "15ᵗʰ Jan 2025",
            img: "https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1736847736952_1736847736629_BlogBannersAllClients.jpg"
        },
        {
            title: "Welcome To The Ultimate Christmas Treasure Hunt! 🎁✨",
            date: "19ᵗʰ Dec 2024",
            img: "https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1734598376035_1734598374974_ChristmasblogGenricBannerV4.jpg"
        },
        {
            title: "Children’s Day – Cartoon Quiz",
            date: "14ᵗʰ Nov 2024",
            img: "https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1731330888660_1731330887909_GenrBannerS.jpg"
        },
        {
            title: "World Tourism Day",
            date: "27ᵗʰ Sep 2024",
            img: "https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1727246811696_1727246811459_Blo.jpg"
        },
        {
            title: "Independence Day Trivia",
            date: "13ᵗʰ Aug 2024",
            img: "https://loyalie-cms-dev.s3.ap-south-1.amazonaws.com/1723467963601_1723467962863_Independence.jpg"
        }
    ];

    return (
        <div>

            <section
                className="relative h-[70vh] md:min-h-[100vh] w-full text-white flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(18, 44, 59, 0.7), rgba(255, 71, 19, 0.3)), url(${slide.bgImage})`,
                }}
            >
                <div className="text-center max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold uppercase drop-shadow-md leading-snug">
                        {slide.heading}
                    </h1>
                    <div className="h-[2px] w-16 sm:w-24 bg-[#FF4F12] my-3 sm:my-4 mx-auto" />
                </div>
            </section>

            <div className="bg-white min-h-screen text-gray-800 p-4 md:p-10 font-sans">

                <div className="text-red-500 text-2xl mb-4 cursor-pointer">&larr;</div>

                <div className="flex flex-col md:flex-row gap-10">
                    <div className="flex-1 max-w-full md:max-w-none">
                        <h1 className="text-3xl md:text-3xl font-bold mb-3">
                            Ace the Board Games Trivia: Win Exciting Rewards
                        </h1>
                        <p className="font-semibold text-gray-600 text-sm mb-5">
                            Test your knowledge about board games from 15th to 19th January 2025 and win exciting lifestyle vouchers!
                        </p>

                        <p className="text-gray-500 mb-4 text-sm">
                            We’re inviting you to take part in our exclusive Board Games Trivia Challenge. Sharpen your wits, test your knowledge and you could be one of the lucky winners to walk away with some fabulous Lifestyle vouchers! <br />
                            Whether you’re a fan of chess, Scrabble or something more niche, this is your chance to prove your mastery.
                        </p>

                        <p className="text-gray-500 mb-2 text-sm">Here’s what’s on the line:</p>
                        <ul className="text-gray-500 mb-6 space-y-1 text-sm">
                            <li>🏆 <strong>1st Place:</strong> ₹2,500 Lifestyle Voucher</li>
                            <li>🥈 <strong>2nd Place:</strong> ₹1,500 Lifestyle Voucher</li>
                            <li>🥉 <strong>3rd Place:</strong> ₹1,000 Lifestyle Voucher</li>
                        </ul>

                        <div className="mb-6">
                            <p className="font-semibold text-sm text-gray-600">Important Details</p>
                            <p className="text-gray-500 text-sm"><strong>Contest Dates:</strong> 15th to 19th January 2025</p>
                            <p className="text-gray-500 text-sm"><strong>Eligibility:</strong> Open to all board game enthusiasts ready to answer and win!</p>
                        </div>

                        <div className="mb-6">
                            <p className="font-semibold text-sm text-gray-600">How to Join</p>
                            <p className="text-gray-500 text-sm"><strong>Start:</strong> Click on the quiz link, fill in your details and submit.</p>
                            <p className="text-gray-500 text-sm"><strong>Play:</strong> Answer challenging questions during the contest dates.</p>
                            <p className="text-gray-500 text-sm"><strong>Win:</strong> Showcase your skills and get your voucher!</p>
                        </div>

                        <p className="text-gray-500 mb-6 text-sm">Don’t miss your chance to turn your board game knowledge into real rewards.</p>

                        <button className="bg-black text-white text-lg px-8 py-4 font-semibold rounded w-full sm:w-auto">
                            CLICK HERE TO PARTICIPATE
                        </button>

                        <p className="text-red-500 text-sm mt-8 text-center md:text-left">
                            If you like the article, please feel free to share
                        </p>

                        <div className="flex space-x-4 mt-2 text-gray-600 text-xl justify-center sm:justify-start">
                            <FaWhatsapp />
                            <FaFacebookF />
                            <FaLinkedinIn />
                            <FaEnvelope />
                            <FaTwitter />
                        </div>
                    </div>

                    <div className="w-full md:w-1/4 space-y-7 max-w-full">
                        <h2 className="text-red-600 font-bold text-sm text-center md:text-left">RECENT POSTS</h2>

                        {recentPosts.map((post, i) => (
                            <div key={i} className="flex gap-4 items-center">
                                <img src={post.img} alt="post" className="w-20 h-14 object-cover rounded-md flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm">{post.title}</p>
                                    <p className="text-xs text-gray-500">{post.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;

import React from "react";

const ReferNow = () => (
    <section
        className="bg-white"
        style={{ backgroundSize: "30%", backgroundAttachment: "fixed" }}
    >
        <div>
            <section className="relative lg:-mt-20">
                <div className="block lg:hidden">
                    <div
                        className="relative hero hero-content max-w-full h-[75vh] md:h-[70vh] object-cover bg-center lg:bg-left"
                        style={{
                            backgroundImage:
                                'linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url("https://cdn.loyalie.in/1695057542516_referral%20banner")'
                        }}
                    >
                        <div className="hero-content w-full text-neutral-content">
                            <div className="w-full">
                                <p className="-mt-40 text-center lg:text-left text-white text-[15px] md:text-[20px] xl:text-[25px] uppercase lg:my-5 tracking-widest lg:w-[42%] ml-auto font-Poppins">
                                    Refer your loved ones and get rewards on every successful
                                    referral{" "}
                                </p>
                                <div
                                    className="flex lg:w-[42%] lg:ml-auto"
                                    style={{
                                        backgroundRepeat: "repeat",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center center",
                                        opacity: 1,
                                        transition: "opacity 0.5s ease-in-out"
                                    }}
                                >
                                    <button
                                        className="sc-gEvEer ewVeEI 
                                        z-10 mt-2 mx-auto lg:m-0 bg-primary rounded-sm text-[16px] py-1 xl:py-2 px-5 xl:px-10 self-center text-white font-Poppins  disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300 disabled:text-white disabled:hover:text-white disabled:hover:border-none disabled:border-none"
                                    >
                                        Start Referring Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block">
                    <div
                        className="relative hero hero-content max-w-full h-[75vh] md:h-[70vh] object-cover bg-center lg:bg-left"
                        style={{
                            backgroundImage:
                                'linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url("https://cdn.loyalie.in/1695057542516_referral%20banner")'
                        }}
                    >
                        <div className="text-center hero-content w-full text-neutral-content">
                            <div className="w-full">
                                <p className="-mt-40 text-center lg:text-left text-white text-[15px] md:text-[20px] xl:text-[25px] uppercase lg:my-5 tracking-widest lg:w-[42%] ml-auto font-Poppins">
                                    Refer your loved ones and get rewards on every successful
                                    referral{" "}
                                </p>
                                <div
                                    className="flex lg:w-[42%] lg:ml-auto"
                                    style={{
                                        backgroundRepeat: "repeat",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center center",
                                        opacity: 1,
                                        transition: "opacity 0.5s ease-in-out"
                                    }}
                                >
                                    <button
                                        className="sc-gEvEer ewVeEI 
                                        z-10 mt-2 mx-auto lg:m-0 bg-primary rounded-sm text-[16px] py-1 xl:py-2 px-5 xl:px-10 self-center text-white font-Poppins  disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300 disabled:text-white disabled:hover:text-white disabled:hover:border-none disabled:border-none"
                                    >
                                        Start Referring Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </section>
);

export default ReferNow;

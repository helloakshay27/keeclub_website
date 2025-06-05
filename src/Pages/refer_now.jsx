import React from "react";
import { useNavigate } from "react-router-dom";

const ReferNow = () => {
    const navigate = useNavigate();

    return (
        <>
            <div
                className="relative h-[88vh] w-full bg-cover bg-no-repeat bg-center flex items-center justify-end"
                style={{
                    backgroundImage:
                        'url("https://cdn.loyalie.in/1695057542516_referral%20banner")',
                }}
            >
                <div className="w-[45%] text-white text-start pr-20">
                    <p className="text-[20px] xl:text-[25px] uppercase font-Poppins tracking-widest mb-4">
                        Refer your loved ones and get rewards on every successful referral
                    </p>
                    <button
                        className="bg-[#FF5722] hover:bg-[#e64a19] text-white font-Poppins py-2 px-8 rounded-sm text-[16px]"
                        onClick={() => navigate("/login")}
                    >
                        Start Referring Now
                    </button>
                </div>
            </div>
        </>
    );
};

export default ReferNow;

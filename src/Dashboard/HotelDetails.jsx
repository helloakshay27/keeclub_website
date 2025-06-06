import React from 'react'
import Card3 from "../assets/Hotel/Card3.png"
import Hotel1_1 from "../assets/Hotel/Hotel1_1.png"
import Hotel1_2 from "../assets/Hotel/Hotel1_2.png"
import Hotel1_3 from "../assets/Hotel/Hotel1_3.png"
import Hotel1_4 from "../assets/Hotel/Hotel1_4.png"
import Check from "../assets/Hotel/icons/Check.png"
import Desk from "../assets/Hotel/icons/Desk.png"
import Parking from "../assets/Hotel/icons/Parking.png"
import Restraunt from "../assets/Hotel/icons/Restraunt.png"
import Sqft from "../assets/Hotel/icons/Sqft.png"
import Bed from "../assets/Hotel/icons/Bed.png"
import Person from "../assets/Hotel/icons/Person.png"
import Wifi from "../assets/Hotel/icons/Wifi.png"
import HotelBed from "../assets/Hotel/HotelBed.png"





const About=()=>{
    return(
        <div>About</div>
    );
}
const Rooms=()=>{
    return(
        <div>Rooms</div>
    );
}
const Accessibility=()=>{
    return(
        <div>Accessibility</div>
    );
}
const Overview=()=>{
    const PropertyDetails=[{
        name:"24/7 front desk",
        img:Desk
    },{
        name:"Parking Included",
        img:Parking
    },{
        name:"Restraunt",
        img:Restraunt
    },{
        name:"Free Wifi",
        img:Wifi
    },
    {
        name:"Housekeeping",
        img:Check
    }
]
const RoomDetails=[{
    name:"Free Self Parking",
    img:Parking
},
{
     name:"250 sq ft",
    img:Sqft
},
{
    name:"Sleeps 3",
    img:Person
},
{
    name:"1 King Bed",
    img:Bed
},
{
     name:"Reserve now, pay later",
    img:Check
},{
    name:"Free Wifi",
    img:Wifi
}
]
    
    return(
        <div className="flex justify-between gap-2 ">
            <div className="flex flex-col gap-4 w-[70%]">
                <h1 className="text-[20px] font-[600]">Coastal Gateway Resort, 3 min walk to Nagaon Beach</h1>
                <div className="flex gap-2">
                    <label className="bg-[#FA46151A]  px-2 py-1">3.8</label>
                    <label className="mt-1">Reviews</label>
                </div>
                <div>
                    <h1 className='font-[600] text-[20px]'>About this property</h1>
                    <span>Hotel in Alibag with 24-hour front desk and restaurant</span>
                </div>
                <div className="grid grid-cols-2 grid-rows-3 grid-flow-row gap-y-2 w-[500px] ">
                    {PropertyDetails.map((item)=>(  
                  <div className="flex gap-2">
                    <img src={item.img} className="w-[30px] h-[30px]" alt="" />
                    <span>{item.name}</span>
                  </div>
                    ))}
                </div>
                <div className="text-[#FA4615] underline cursor-pointer text-[15px] font-[400]">
                    See all about this property
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="font-[600] text-[20px]">Accessibility</h1>
                    <p className="w-[500px]">If you have requests for specific accessibility needs, please contact the property using the information on the reservation confirmation received after booking.</p>
                </div>
            </div>
            <div className="flex flex-col gap-3">
               <div className="flex justify-end gap-3">
                <span className="font-[600] text-[23px]">₹10,000</span>
                <span className="text-[14px] mt-3 font-[600]">for 4 nights</span>
                <button className="bg-[#24293D] text-white w-[135px] h-[40px] rounded">Book Now</button>
               </div>
               <div className="flex gap-2 justify-between border-1 border-[#3232323D] w-[650px] h-[340px] p-7 rounded">
                <div className="flex flex-col gap-3 text-[16px]">
                    <h1 className='font-[600]'>Standard Room</h1>
                    {RoomDetails.map((item)=>(
                        <div className="flex gap-2">
                            <img src={item.img} alt="" className="w-[20px] h-[20px]" />
                            <span>{item.name}</span>
                        </div>
                    ))}
                    <span className="text-[#FA4615] underline cursor-pointer">More Details</span>
                </div>
                <div className='flex flex-col gap-2'>
                   <img src={HotelBed} alt="" className='w-[340px] h-[160px] rounded' />
                   <div>
                   <span className='text-[#01643B] block '>Fully refundable</span>
                   <span>Before Thu, 12 Jun</span>
                   </div>
                </div>
               </div>
            </div>
        </div>
    )
}
const HotelDetails = () => {
 const [activeTab, setActiveTab] = React.useState("Overview");
  const tabs=["Overview" ,"About","Rooms","Accessibility"];
  return (
    <div className="p-10 m-10 mt-0">
        <div className="flex flex-col gap-3">
           <div className="grid grid-cols-3 gap-x-4 gap-y-2 grid-rows-2 h-[362px] grid-flow-row grid-cols-[2fr_1fr_1fr] grid-rows-[1fr_1fr]">
            <img src={Card3} alt="" className="col-span-1 row-span-2 w-[800px] h-[355px] object-cover rounded" />
            <img src={Hotel1_1} alt="" className="col-span-1 row-span-1 w-[370px] h-[170px] object-cover rounded" />
            <img src={Hotel1_2} alt="" className="col-span-1 row-span-1 w-[370px] h-[170px] object-cover rounded" />
            <img src={Hotel1_3} alt="" className="col-span-1 row-span-1 w-[370px] h-[170px] object-cover rounded" />
            <img src={Hotel1_4} alt="" className="col-span-1 row-span-1 w-[370px] h-[170px] object-cover rounded" />
           </div>
           <div>
           <div className="flex justify-start gap-9">
              {tabs.map((tab)=>(
                <div className={`cursor-pointer ${activeTab==tab?"text-orange-600 border-b-2 border-orange-600":"text-gray-600"}`} key={tab} onClick={()=>setActiveTab(tab)}>
                    <div className="mb-2">{tab}</div>
                </div>
              ))}
            </div>
           <hr className=' border-gray-300'/>
           </div>
           <div>
            {activeTab=="Overview" && <Overview />}
            {activeTab=="About" && <About />}
            {activeTab=="Rooms" && <Rooms />}
            {activeTab=="Accessibility" && <Accessibility />}
           </div>
        </div>
    </div>
  )
}

export default HotelDetails
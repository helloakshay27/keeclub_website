import React from 'react';
import Card from '../../Models/Card';

const cardsData = [
  {
    imageUrl: 'https://cdn.loyalie.in/58039376.jpg',
    title: 'One Family Many Rewards',
    subtitle: 'An exclusive referral campaign, curated just for you!',
    description:
      'Piramal Realty knows what it means to build model communities that care for each other, and with One Family Many Rewards, we intend to reward every member who helps build the Piramal family. We bring you the opportunity to include your loved ones in the Piramal family and win exclusive rewards for yourselves and the referred basis various slabs. To know more, please refer to the attached e-brochures.',
    highlightColor: '#FF4F12',
    buttonText: 'Know More',
    onButtonClick: () => alert('Know More clicked'),
    reverse: false,
  },
  {
    imageUrl: 'https://images.pexels.com/photos/20809163/pexels-photo-20809163/free-photo-of-black-volkswagen-golf-gti.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Referrals and Earning',
    subtitle: 'Turn your network into your net worth!',
    description: (
      <div>
        <p className="mb-4">
          We believe that the best communities are built on trust. As a Kee Club member, you have the opportunity to share your lifestyle with your family and friends and earn exclusive benefits on every successful referral.
        </p>
        <p className="mb-2">Kee Club offers the following referral rewards to each of its members:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Rewards worth 2% of agreement value you receive for buying again at Piramal Realty</li>
          <li>Rewards worth 0.65% of agreement value you receive for successfully referring a loved one</li>
          <li>Rewards worth 0.65% of agreement value your loved one receives on booking with us through your referral</li>
        </ul>
        <p>You are our brand ambassador in this vision.</p>
      </div>
    ),
    highlightColor: '#FF4F12',
    buttonText: 'Refer Now',
    onButtonClick: () => {
      window.location.href = '/refer-now'; // Navigate to the refer page
    },
    reverse: true,
  },
  {
    imageUrl: 'https://images.pexels.com/photos/13221876/pexels-photo-13221876.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Offers and Promotions',
    subtitle: '',
    description: (
      <div className="space-y-4">
        <p>
          Kee Club believes in putting your needs above everything else. We give you access to exclusive deals from premium and PAN-India brands like US Polo Assn, Hakkasan, Lenovo, Luxulo, and many more to elevate your lifestyle beyond the ordinary and deliver the luxury you deserve.
        </p>
        <p>
          Our goal is to bring you the best experiences from across the country and add value worth sharing with your social circle.
        </p>
        <p className="text-sm text-gray-500">
          <strong>Disclaimer*</strong><br />
          All offers on Kee Club are valid till promotions last and may change from time to time.
        </p>
      </div>
    ),
    highlightColor: '#FF4F12',
    buttonText: 'Avail Now',
    onButtonClick: () => alert('Avail Now clicked'),
    reverse: false,
  },
  {
    imageUrl: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Workshops and Events',
    subtitle: '',
    description: (
      <div className="space-y-4">
        <p>
          There is more to life than daily routines and Kee Club focuses on delivering each of its members with impactful engagement that enriches their lives through knowledge, care, and action.
        </p>
        <p>
          We bring our members various events and workshops with the best collaborators, so that every Kee Club family can get more value and lasting memories.
        </p>
      </div>
    ),
    highlightColor: '#FF4F12',
    buttonText: 'View Past Events',
    onButtonClick: () => alert('View Past Events clicked'),
    reverse: true,
  },

  {
    imageUrl: 'https://images.pexels.com/photos/6070046/pexels-photo-6070046.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Infotainment and Interactive Blogs',
    subtitle: '',
    description: (
      <div className="space-y-4">
        <p>
          Kee Club understands the power of learning and the role it plays in our lives. We bring you infotainment and interactive blogs that align with our core values of knowledge, action, care, and impact.
        </p>
        <p>
          Our blogs will allow you to learn new things every day in bite-sized reads. You can read our latest pieces and comment on them to start a discussion with your entire community.
        </p>
      </div>
    ),
    highlightColor: '#FF4F12',
    buttonText: 'Read Now',
    onButtonClick: () => alert('Read Now clicked'),
    reverse: false,
  },
];



const MainCard = () => {
  return (
    <div className="w-full min-h-screen bg-[#F5F8FC] flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-16 py-10 space-y-16">

      {/* Introductory Text Section */}
      <div className="max-w-7xl w-full text-center space-y-6 px-2 sm:px-4">
        <h1 className="text-base sm:text-lg md:text-xl font-semibold text-[#FF4F12]">
          Kee Club is an exclusive loyalty and referral program for the entire Piramal family. Every member is a brand ambassador in our vision of adding more value to homeownership and unlocking the Kee Club lifestyle.
        </h1>
        <p className="text-[#7B88A8] text-sm sm:text-base md:text-lg">
          Buying a new home requires trust, assurance, quality, and care – all of which are an integral part of the Piramal brand. We know that our brand is only as strong as what our customers think of us. When you recommend us to people that you care about; you encourage us to do better.
        </p>
        <p className="text-[#7B88A8] text-sm sm:text-base md:text-lg">
          Our loyalty benefits are designed to help serve you better and cherish each and every member of the Piramal family through this program. It is our firm belief that the success of our brand rests on your happiness and Kee Club is created to pursue this idea with vigor.
        </p>
      </div>

      {/* Section Heading */}
      <h2 className="text-xl sm:text-2xl font-semibold text-red-500 text-center mb-8 sm:mb-12">
        Kee Club Unlocks:
      </h2>

      {/* Cards */}
      <div className="flex flex-col items-center space-y-12 w-full">
        {cardsData.map((item, index) => (
          <Card key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default MainCard;

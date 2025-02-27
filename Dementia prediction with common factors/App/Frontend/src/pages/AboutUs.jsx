import React from 'react';
import { motion } from 'framer-motion';

const teamMembers = [
  { name: 'Member 1', role: 'Role 1', image: '/images/member1.jpg' },
  { name: 'Member 2', role: 'Role 2', image: '/images/member2.jpg' },
  { name: 'Member 3', role: 'Role 3', image: '/images/member3.jpg' },
  { name: 'Member 4', role: 'Role 4', image: '/images/member4.jpg' },
];

const AboutUs = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 py-12 px-6"
    >
      <div className="max-w-5xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center text-blue-600">About Us</h1>
        <p className="mt-4 text-lg text-gray-700 text-center">
          Our platform provides AI-powered tools to assess cognitive health, depression risk,
          and dementia prediction. We are dedicated to delivering accurate, data-driven insights
          to improve mental well-being.
        </p>
      </div>
      
      <div className="max-w-5xl mx-auto mt-12">
        <h2 className="text-3xl font-semibold text-center text-gray-800">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {teamMembers.map((member, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 shadow-md rounded-lg text-center"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full object-cover"
              />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AboutUs;

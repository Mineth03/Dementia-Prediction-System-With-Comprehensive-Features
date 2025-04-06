import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobe, FaBrain, FaChartLine } from 'react-icons/fa';
import LahiruneeImg from '../assets/Lahirunee.jpg';
import MinethImg from '../assets/Mineth.jpg';
import ManugaImg from '../assets/Manuga.jpg';
import YasanthiImg from '../assets/Yasanthi.jpg';

const teamMembers = [
  { name: 'Mineth Sandew', role: 'Fullstack Developer', image: MinethImg },
  { name: 'Lahirunee Weerthunga', role: 'ML Engineer', image: LahiruneeImg },
  { name: 'Yasanthi Clair', role: 'ML Engineer', image: YasanthiImg },
  { name: 'Manuga Perera', role: 'AI Engineer', image: ManugaImg },
];

const dementiaStats = [
  { title: '55 Million', description: 'People living with dementia worldwide', icon: <FaGlobe className="text-[#48CFCB] text-5xl" /> },
  { title: '10 Million', description: 'New cases diagnosed every year', icon: <FaBrain className="text-[#229799] text-5xl" /> },
  { title: '$1.3 Trillion', description: 'Annual cost of dementia globally', icon: <FaChartLine className="text-[#424242] text-5xl" /> },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const AboutUs = () => {
  return (
    <div className="bg-[#F5F5F5]">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.8 }}
        className="relative min-h-[85vh] bg-cover bg-center"
        style={{ backgroundImage: "url('https://media.bizj.us/view/img/11926560/istock-1141333760.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative max-w-5xl mx-auto text-center text-white px-6 py-32">
          <h1 className="text-6xl font-extrabold leading-tight mb-6">Who We Are</h1>
          <p className="text-2xl leading-relaxed">
            We are a passionate team of AI and ML innovators committed to reshaping the landscape of cognitive healthcare with empathy, technology, and purpose.
          </p>
        </div>
      </motion.section>

      {/* Our Mission Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto py-16 px-6"
      >
        <h2 className="text-3xl font-bold text-[#424242] text-center mb-8">Our Mission</h2>
        <p className="text-lg text-[#424242] text-center">
          Our platform combines AI and ML technologies to assess cognitive health, screen for depression,
          and predict dementia risk. We provide actionable insights to improve mental well-being.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          {[
            {
              title: 'Cognitive Test',
              description: 'Evaluate cognitive functions with our MoCA test.',
              color: '#48CFCB'
            },
            {
              title: 'Depression Screening',
              description: 'Facial emotion analysis to assess depression risk.',
              color: '#229799'
            },
            {
              title: 'Risk Prediction',
              description: 'Predict dementia risk based on health and lifestyle factors.',
              color: '#424242'
            },
            {
              title: 'Cognitive Health Tracker',
              description: 'Track daily cognitive patterns, mood, and sleep to identify early signs of decline.',
              color: '#48CFCB'
            },
            {
              title: 'Supportive Chatbot',
              description: 'Conversational AI for emotional support and suicide risk detection.',
              color: '#229799'
            },
            {
              title: 'Early Detection',
              description: 'Identify potential cognitive decline and emotional distress at the earliest signs.',
              color: '#424242'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold" style={{ color: item.color }}>
                {item.title}
              </h3>
              <p className="text-[#424242] mt-2">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Global Dementia Statistics */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-br from-[#F5F5F5] to-white py-16 px-6 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/images/globe.png')] bg-no-repeat bg-center opacity-10"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#424242] mb-8">Dementia Global Statistics 🌐</h2>
          <p className="text-lg text-[#424242] mb-12">
            Understanding the global impact of dementia helps us innovate better solutions for prevention and care.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dementiaStats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">{stat.icon}</div>
                <h3 className="text-3xl font-bold text-[#424242]">{stat.title}</h3>
                <p className="text-[#424242] mt-2">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.8 }}
        className="bg-[#f5f5f5] py-16 px-6"
      >
        <h2 className="text-3xl font-bold text-[#424242] text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 h-96 shadow-xl rounded-2xl text-center flex flex-col items-center justify-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-40 h-40 rounded-full object-cover shadow-lg mb-6"
              />
              <h3 className="text-2xl font-bold text-[#229799] mb-2">{member.name}</h3>
              <p className="text-lg text-[#424242]">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-[#48CFCB] text-white py-16 text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Join Us in Transforming Healthcare</h2>
        <p className="text-lg mb-6">
          Want to learn more? Contact us today and let's create a healthier future.
        </p>
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=safeminddsgp@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-[#229799] font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition"
        >
          Contact Us
        </a>
      </motion.section>
    </div>
  );
};

export default AboutUs;

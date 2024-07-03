import React from 'react'
import { NavLink } from 'react-router-dom'

const Start = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
      <header className="flex px-4 py-8 justify-between">
        <h1 className="text-3xl font-bold text-white">LOGO</h1>
        <nav className="space-x-4">
          <NavLink
            to="/Signup"
            className="relative inline-flex items-center px-4 py-2 rounded-full hover:bg-indigo-700 hover:text-white transition duration-300 ease-in-out"
          >
            Signup
            <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-purple-700 to-indigo-500 opacity-0 group-hover:opacity-75 transition duration-300 ease-in-out"></span>
          </NavLink>
          <NavLink
            to="/Login"
            className="relative inline-flex items-center px-4 py-2 rounded-full bg-white hover:bg-opacity-75 hover:text-indigo-700 transition duration-300 ease-in-out"
          >
            Login
          </NavLink>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-16 flex flex-col items-center space-y-8">
        <h2 className="text-4xl font-bold text-white">Unleash Your Inner Athlete - Book Your Perfect Turf Today!</h2>
        <p className="text-xl text-gray-200 text-center max-w-md">
          Welcome to the premier online platform for booking your next turf adventure! We're passionate about connecting you with a diverse range of high-quality sports facilities, catering to a variety of athletic pursuits. Whether you're a seasoned athlete seeking to refine your skills or a fitness enthusiast looking to break a sweat with friends, we have the perfect turf for you.
        </p>
        <h3 className="text-3xl font-semibold text-white">Ignite Your Passion - Explore Our Diverse Categories:</h3>
        <ul className="list-disc text-gray-200 space-y-2 pl-4">
          <li className="font-bold">Football:** Gather your squad and dominate the pitch. Hone your passing skills, perfect your shooting technique, and orchestrate unforgettable matches on pristine football fields. </li>
          <li className="font-bold">Badminton:** Unleash the agility and finesse required for this fast-paced sport. Challenge your friends to a thrilling rally or improve your solo game on our well-maintained badminton courts.</li>
          <li className="font-bold">Swimming:** Dive into a refreshing workout or perfect your competitive strokes. Our swimming facilities provide a clean and inviting environment for all skill levels.</li>
          <li className="font-bold">Cricket:** Step onto the crease and experience the thrill of this iconic sport. Practice your bowling or batting technique, or gather your team for a friendly match on our regulation-sized cricket pitches.</li>
          <li className="font-bold">Basketball:** Shoot hoops, practice dribbling drills, or scrimmage with your crew. Our basketball courts offer the perfect space to elevate your game and experience the camaraderie of teamwork.</li>
        </ul>
        <h3 className="text-2xl font-semibold text-white">Beyond the Game - The Benefits of Playing Sports:</h3>
        <ul className="list-disc text-gray-200 space-y-2 pl-4">
          <li>**Improved Fitness & Health:** Regular physical activity strengthens your cardiovascular system, builds muscle tone, and boosts overall well-being.</li>
          <li>**Enhanced Teamwork & Sportsmanship:** Sports foster collaboration, communication, and respect for your opponents, valuable skills that translate beyond the playing field.</li>
          <li>**Stress Relief & Mental Wellbeing:** Exercise is a natural stress reliever, promoting relaxation and improving mood. Engaging in sports allows you to clear your head and find joy in physical activity.</li>
          <li>**Fun & Social Interaction:** Sports provide a platform for connecting with friends, colleagues, or even new people who share your passion. It's a fantastic way to</li>
        </ul>
      </main>
    </div>
  )
}

export default Start

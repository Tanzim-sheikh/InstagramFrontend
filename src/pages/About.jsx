import React from 'react';

const About = () => {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">About This Project</h1>
        <p className="mt-3 text-gray-600 max-w-2xl">
          This is a modern, minimal Instagram-style application focused on speed, simplicity, and a clean user experience.
          Built with a MERN stack, it supports authentication, email verification, and image uploads to Cloudinary.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border bg-white">
          <h2 className="text-xl font-semibold">Technology</h2>
          <ul className="mt-3 text-gray-600 list-disc list-inside space-y-1">
            <li>React + Vite frontend</li>
            <li>Express + MongoDB backend</li>
            <li>JWT Authentication with email verification</li>
            <li>Cloudinary image storage</li>
          </ul>
        </div>
        <div className="p-6 rounded-xl border bg-white">
          <h2 className="text-xl font-semibold">Vision</h2>
          <p className="mt-3 text-gray-600">
            Empower users to share moments effortlessly with a beautiful and responsive interface.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;

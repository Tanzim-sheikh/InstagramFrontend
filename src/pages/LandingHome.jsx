import React from 'react';
import { Link } from 'react-router-dom';

const LandingHome = () => {
  return (
    <div className="space-y-16">
      <section className="text-center mt-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Share Moments. Inspire People.</h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          A simple, modern Instagram-like experience to capture and share your best moments.
          Join the community and discover stories from around the world.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link to="/signup" className="px-5 py-2.5 rounded-md bg-black text-white">Get started</Link>
          <Link to="/about" className="px-5 py-2.5 rounded-md border">Learn more</Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border bg-white">
          <div className="text-xl font-semibold">Create</div>
          <p className="mt-2 text-gray-600">Post photos with beautiful previews. Your feed, your style.</p>
        </div>
        <div className="p-6 rounded-xl border bg-white">
          <div className="text-xl font-semibold">Connect</div>
          <p className="mt-2 text-gray-600">Follow friends and creators. Stay close with the people you care about.</p>
        </div>
        <div className="p-6 rounded-xl border bg-white">
          <div className="text-xl font-semibold">Discover</div>
          <p className="mt-2 text-gray-600">Explore curated content tailored to your interests.</p>
        </div>
      </section>

      <section className="rounded-2xl border bg-gradient-to-br from-gray-50 to-white p-8 md:p-12">
        <div className="md:flex items-center gap-10">
          <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop" alt="preview" className="w-full md:w-1/2 rounded-xl object-cover"/>
          <div className="mt-6 md:mt-0">
            <h2 className="text-2xl font-bold">Built for speed and simplicity</h2>
            <p className="mt-3 text-gray-600">Fast, responsive, and delightful. Focus on sharing, not figuring things out.</p>
            <Link to="/signup" className="inline-block mt-5 px-5 py-2.5 rounded-md bg-black text-white">Create your account</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingHome;

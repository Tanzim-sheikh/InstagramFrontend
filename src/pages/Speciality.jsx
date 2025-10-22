import React from 'react';

const Speciality = () => {
  const items = [
    {
      title: 'Performance-first',
      desc: 'Fast loads, smooth interactions. Built with modern tooling and best practices.'
    },
    {
      title: 'Clean UX',
      desc: 'Minimal, focused design so users can post and browse without distractions.'
    },
    {
      title: 'Secure Auth',
      desc: 'Email verification, JWT, and best practices for security and privacy.'
    },
    {
      title: 'Cloud Media',
      desc: 'Cloudinary-backed uploads for reliable and scalable image delivery.'
    },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Our Speciality</h1>
        <p className="mt-3 text-gray-600 max-w-2xl">Why this app stands out from simple demos and boilerplates.</p>
      </header>
      <section className="grid md:grid-cols-2 gap-6">
        {items.map((it) => (
          <div key={it.title} className="p-6 rounded-xl border bg-white">
            <h3 className="text-lg font-semibold">{it.title}</h3>
            <p className="mt-2 text-gray-600">{it.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Speciality;

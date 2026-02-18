import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section
      className="relative -mx-6 -mt-20 flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
    >
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-gray-900 dark:to-[#0f0f0f]" />
      </div>

      {/* Decorative accents */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-[400px] w-[400px] rounded-full bg-amber-400/5 blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Badge */}
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/90">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
          Premium Marketplace
        </span>

        {/* Heading */}
        <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          Drive Your{' '}
          <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Dream
          </span>
        </h1>

        {/* Subtext */}
        <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-white/50 sm:text-lg md:text-xl">
          Premium cars from verified dealers
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/inventory"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-10 py-4 text-sm font-bold uppercase tracking-wider text-black shadow-lg shadow-amber-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30"
          >
            <span className="relative z-10">Explore Inventory</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
          <Link
            to="/dealers"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-10 py-4 text-sm font-bold uppercase tracking-wider text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:text-white"
          >
            Our Dealers
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap justify-center gap-10 sm:gap-16">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-white sm:text-4xl">100+</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/30">Cars Listed</p>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-3xl font-extrabold text-white sm:text-4xl">50+</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/30">Trusted Dealers</p>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-3xl font-extrabold text-white sm:text-4xl">24/7</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/30">Support</p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 animate-bounce text-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

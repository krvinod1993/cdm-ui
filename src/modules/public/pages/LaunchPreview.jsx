import { Link } from "react-router-dom";

const featuredVehicles = [
  {
    id: 1,
    name: "2024 Mercedes-Benz E-Class",
    price: "$68,900",
    mileage: "9,200 km",
    fuel: "Petrol",
    transmission: "Automatic",
    badge: "Featured",
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "2023 BMW X5 xDrive",
    price: "$74,500",
    mileage: "14,500 km",
    fuel: "Diesel",
    transmission: "Automatic",
    badge: "Top Pick",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "2024 Audi Q7 Premium",
    price: "$71,200",
    mileage: "7,800 km",
    fuel: "Petrol",
    transmission: "Automatic",
    badge: "New Arrival",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    name: "2022 Volvo XC90 Recharge",
    price: "$59,800",
    mileage: "18,300 km",
    fuel: "Hybrid",
    transmission: "Automatic",
    badge: "Value Deal",
    image:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    name: "2024 Lexus RX 500h F Sport",
    price: "$76,000",
    mileage: "5,500 km",
    fuel: "Hybrid",
    transmission: "Automatic",
    badge: "Premium",
    image:
      "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    name: "2023 Porsche Macan S",
    price: "$83,900",
    mileage: "11,600 km",
    fuel: "Petrol",
    transmission: "Automatic",
    badge: "Hot Deal",
    image:
      "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?auto=format&fit=crop&w=1200&q=80",
  },
];

const whyChooseUsCards = [
  {
    icon: "🛡️",
    title: "Verified Listings",
    description:
      "Every listing goes through quality checks for authenticity, pricing transparency, and complete paperwork.",
  },
  {
    icon: "⚡",
    title: "Fast Discovery",
    description:
      "Advanced search and premium filters help buyers discover the right vehicle in minutes, not days.",
  },
  {
    icon: "🤝",
    title: "Trusted Dealers",
    description:
      "Work with highly rated dealers known for professional support, fair deals, and smooth delivery.",
  },
  {
    icon: "💎",
    title: "Premium Experience",
    description:
      "From first click to final handover, enjoy a polished marketplace designed for confidence.",
  },
];

const howItWorksSteps = [
  {
    step: "01",
    title: "Search & Compare",
    description:
      "Use smart filters to discover cars by make, budget, fuel type, and location.",
  },
  {
    step: "02",
    title: "Connect with Dealer",
    description:
      "Instantly reach out to verified dealers, schedule calls, and request details.",
  },
  {
    step: "03",
    title: "Close with Confidence",
    description:
      "Review inspection, pricing, and documentation to complete the deal securely.",
  },
];

const topDealers = [
  {
    id: 1,
    name: "Prime Wheels Auto",
    city: "Noida",
    rating: "4.9",
    inventory: "148 Cars",
  },
  {
    id: 2,
    name: "Urban Drive Gallery",
    city: "Gurugram",
    rating: "4.8",
    inventory: "112 Cars",
  },
  {
    id: 3,
    name: "Elite Auto Hub",
    city: "Delhi",
    rating: "4.9",
    inventory: "167 Cars",
  },
  {
    id: 4,
    name: "Velocity Motors",
    city: "Faridabad",
    rating: "4.7",
    inventory: "94 Cars",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Aarav Mehta",
    role: "Buyer",
    quote:
      "The marketplace felt premium from start to finish. I found my SUV in one evening and dealer follow-up was excellent.",
  },
  {
    id: 2,
    name: "Ritika Sharma",
    role: "Dealer Partner",
    quote:
      "High-intent leads and better visibility. Our listings now convert faster thanks to the professional presentation.",
  },
  {
    id: 3,
    name: "Karan Verma",
    role: "Buyer",
    quote:
      "Clean UI, transparent details, and trusted dealers. This is the smoothest car-buying experience I have had online.",
  },
];

const footerLinks = [
  "About",
  "Inventory",
  "Dealers",
  "Pricing",
  "Contact",
  "Support",
];

function LaunchPreview() {
  return (
    <div className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* Section 1: Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-blue-50 to-cyan-100 dark:from-violet-950/70 dark:via-blue-950/40 dark:to-cyan-950/70" />
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-300/30 blur-3xl dark:bg-violet-500/20" />
        <div className="absolute -bottom-20 right-10 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-500/20" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex rounded-full border border-white/40 bg-white/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-violet-300">
            Launch Design Preview
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Discover Premium Cars from Trusted Dealers
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-gray-700 sm:text-lg dark:text-gray-300">
            A refined vehicle marketplace experience crafted for fast discovery,
            confidence, and conversion.
          </p>

          <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-2xl border border-white/60 bg-white/80 p-3 shadow-xl backdrop-blur dark:border-white/10 dark:bg-gray-900/70 sm:flex-row">
            <input
              type="text"
              placeholder="Search by brand, model, budget..."
              className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-violet-400 dark:border-white/10 dark:bg-gray-950 dark:text-gray-100"
              readOnly
            />
            <button
              type="button"
              className="h-12 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:opacity-95"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Featured Vehicles */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-300">
                Curated Picks
              </p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                Featured Vehicles
              </h2>
            </div>
            <Link
              to="/marketplace"
              className="hidden text-sm font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-300 dark:hover:text-violet-200 sm:inline-flex"
            >
              Browse all inventory
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredVehicles.map((vehicle) => (
              <article
                key={vehicle.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-gray-900"
              >
                <div className="relative">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="h-52 w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur dark:bg-white/20">
                    {vehicle.badge}
                  </span>
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold leading-snug">
                      {vehicle.name}
                    </h3>
                    <span className="rounded-lg bg-violet-50 px-2 py-1 text-sm font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                      {vehicle.price}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <div className="rounded-lg bg-gray-50 px-2 py-2 text-center dark:bg-white/5">
                      {vehicle.mileage}
                    </div>
                    <div className="rounded-lg bg-gray-50 px-2 py-2 text-center dark:bg-white/5">
                      {vehicle.fuel}
                    </div>
                    <div className="rounded-lg bg-gray-50 px-2 py-2 text-center dark:bg-white/5">
                      {vehicle.transmission}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full rounded-xl border border-gray-300 py-2.5 text-sm font-semibold transition hover:border-violet-400 hover:text-violet-700 dark:border-white/20 dark:hover:border-violet-300 dark:hover:text-violet-300"
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Why Choose Us */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-300">
              Why Choose Us
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Built for Buyers and Dealers
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUsCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-white/10 dark:bg-gray-900"
              >
                <div className="mb-4 text-3xl">{card.icon}</div>
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-300">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Simple 3-Step Process
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {howItWorksSteps.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900"
              >
                <span className="text-xs font-bold tracking-[0.2em] text-violet-600 dark:text-violet-300">
                  STEP {item.step}
                </span>
                <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Top Dealers */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-300">
              Trusted Network
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Top Dealers</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topDealers.map((dealer) => (
              <div
                key={dealer.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-white/10 dark:bg-gray-900"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-lg font-bold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                  {dealer.name
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <h3 className="text-lg font-semibold">{dealer.name}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {dealer.city}
                </p>
                <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                    {dealer.rating} ★
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {dealer.inventory}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-300">
              Testimonials
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              What Our Users Say
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <blockquote
                key={testimonial.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900"
              >
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  "{testimonial.quote}"
                </p>
                <footer className="mt-5">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: CTA Banner */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-12 text-center text-white shadow-xl sm:px-10 sm:py-14">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              List Your Car Today
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-violet-100 sm:text-base">
              Join our premium dealer network and reach buyers actively searching
              for their next vehicle.
            </p>
            <Link
              to="/dealer/register"
              className="mt-7 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-violet-700 shadow-lg transition hover:bg-violet-50"
            >
              Become a Dealer
            </Link>
          </div>
        </div>
      </section>

      {/* Section 8: Premium Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-20 dark:border-white/10 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-bold">CDM Marketplace</h3>
              <p className="mt-3 max-w-sm text-sm text-gray-600 dark:text-gray-300">
                A premium platform to buy and sell verified vehicles with
                confidence.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                Quick Links
              </h4>
              <div className="mt-4 flex flex-wrap gap-3">
                {footerLinks.map((link) => (
                  <span
                    key={link}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-200"
                  >
                    {link}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                Follow Us
              </h4>
              <div className="mt-4 flex gap-3 text-sm">
                {["X", "IG", "IN", "YT"].map((social) => (
                  <span
                    key={social}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 font-semibold text-gray-600 dark:border-white/20 dark:text-gray-300"
                  >
                    {social}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-500 dark:border-white/10 dark:text-gray-400">
            © 2026 CDM Marketplace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LaunchPreview;

import Title from './Title'
import { BookUserIcon } from 'lucide-react'

const Testimonial = () => {

  const testimonials = [
    {
      text: "This AI Resume Builder helped me create a professional resume in minutes. The AI suggestions were really useful.",
      name: "Cristofer Levin",
      role: "Software Engineer",
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
    },
    {
      text: "I was struggling to make my resume look professional. This tool made the entire process simple and fast.",
      name: "Rohan Mehta",
      role: "Startup Founder",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
    },
    {
      text: "The AI suggestions helped me improve my resume content and present my skills much better.",
      name: "Jason Kim",
      role: "Product Designer",
      image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60"
    },
    {
      text: "Creating and updating my resume has never been this easy. The interface is clean and very easy to use.",
      name: "Alex Turner",
      role: "Full Stack Developer",
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60"
    },
    {
      text: "I loved how quickly I could create a polished resume. It saved me a lot of time during my job search.",
      name: "Sofia Martinez",
      role: "UX Designer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop"
    },
    {
      text: "The resume builder is simple, fast and the AI features make it much easier to improve your resume.",
      name: "Daniel Wong",
      role: "UI Designer",
      image: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/userImage/userImage1.png"
    }
  ]

  const rows = [
    { start: 0, end: 3, className: "animate-scroll" },
    { start: 3, end: 6, className: "animate-scroll-reverse" }
  ]

  const renderCard = (testimonial, index) => (
    <div
      key={index}
      className="bg-white border border-slate-200 hover:border-green-400 hover:shadow-lg hover:shadow-green-100 hover:-translate-y-1 transition-all duration-300 rounded-xl p-4 shrink-0 w-[350px] cursor-pointer"
    >

      {/* Stars */}
      <div className="flex mb-4">
        {Array(5).fill(0).map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-green-500"
          >
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
          </svg>
        ))}
      </div>

      {/* Testimonial text */}
      <p className="text-neutral-700 text-sm mb-6">
        {testimonial.text}
      </p>

      {/* User */}
      <div className="flex items-center gap-3">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-11 h-11 rounded-full object-cover"
        />

        <div>
          <p className="font-medium text-neutral-800 text-sm">
            {testimonial.name}
          </p>

          <p className="text-neutral-600 text-sm">
            {testimonial.role}
          </p>
        </div>
      </div>

    </div>
  )

  return (
    <>
      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          @keyframes scrollReverse {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0);
            }
          }

          .animate-scroll {
            animation: scroll 15s linear infinite;
          }

          .animate-scroll-reverse {
            animation: scrollReverse 15s linear infinite;
          }

          .marquee-container:hover .animate-scroll,
          .marquee-container:hover .animate-scroll-reverse {
            animation-play-state: paused;
          }
        `}
      </style>

      <div
        id="testimonials"
        className="flex flex-col items-center my-10 scroll-mt-12"
      >

        {/* Heading */}
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-400/10 rounded-full px-6 py-1.5">
          <BookUserIcon className="size-4.5 stroke-green-600" />
          <span>Testimonials</span>
        </div>

        <Title
          title="Don't just take our words"
          description="Hear what our users say about us. We're always looking for ways to improve. If you have a positive experience with us, leave a review."
        />

        {/* Marquee */}
        <div className="w-full max-w-6xl mt-10 space-y-6 marquee-container">

          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="relative overflow-hidden"
            >

              {/* Left fade */}
              <div className="absolute left-0 top-0 bottom-0 w-28 bg-linear-to-r from-white to-transparent z-10 pointer-events-none"></div>

              {/* Right fade */}
              <div className="absolute right-0 top-0 bottom-0 w-28 bg-linear-to-l from-white to-transparent z-10 pointer-events-none"></div>

              {/* Moving cards */}
              <div className={`flex gap-6 ${row.className}`}>

                {[
                  ...testimonials.slice(row.start, row.end),
                  ...testimonials.slice(row.start, row.end)
                ].map((testimonial, index) =>
                  renderCard(testimonial, index)
                )}

              </div>

            </div>
          ))}

        </div>

      </div>
    </>
  )
}

export default Testimonial

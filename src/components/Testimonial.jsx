import { useState, useEffect } from "react";
import { MoveLeft, MoveRight, Quote } from "lucide-react";
import star from "/images/star.png";

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/data/testimonial.json");
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    fetchTestimonials();
  }, []);

  if (!testimonials.length) {
    return (
      <section className="bg-gradient-to-br from-[#1A0F0A] via-[#2C1810] to-[#1A0F0A] py-20">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8E6447] mx-auto mb-4"></div>
            <p className="text-[#D4A574] text-lg">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  const current = testimonials[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="relative bg-gradient-to-br from-[#1A0F0A] via-[#2C1810] to-[#1A0F0A] w-full py-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#8E6447]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4A574]/5 rounded-full blur-3xl"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#D4A574] text-sm font-semibold uppercase tracking-wider mb-3">
            What Our Customers Say
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Customer <span className="text-[#8E6447]">Testimonials</span>
          </h2>
          <div className="h-1.5 w-32 bg-gradient-to-r from-transparent via-[#8E6447] to-transparent rounded-full mx-auto"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#8E6447] via-[#D4A574] to-[#8E6447] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-full max-w-md h-[350px] md:h-[450px] object-cover rounded-2xl shadow-2xl border-4 border-[#8E6447]/20 transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute top-4 right-4 bg-[#8E6447] text-white px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center gap-1">
                    <img src={star} alt="star" className="w-4 h-4" />
                    <span className="font-bold text-sm">{current.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-6">
            <div className="relative">
              <Quote className="absolute -top-4 -left-4 w-16 h-16 text-[#8E6447]/20" />
              <div className="relative bg-gradient-to-br from-[#2C1810] to-[#1A0F0A] rounded-2xl p-8 border border-[#8E6447]/20 shadow-2xl backdrop-blur-sm">
                <div className="mb-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 border-l-4 border-[#8E6447] pl-4">
                    {current.name}
                  </h3>
                  <p className="text-[#D4A574] text-lg font-medium pl-4">
                    {current.role}
                  </p>
                </div>

                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6 italic">
                  "{current.text}"
                </p>

                <div className="flex items-center gap-1 mb-8">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <img
                      key={idx}
                      src={star}
                      alt="star"
                      className="w-6 h-6 drop-shadow-lg"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <button
                      onClick={handlePrev}
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-[#8E6447] to-[#6B5744] text-white hover:from-[#6B5744] hover:to-[#8E6447] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
                      aria-label="Previous testimonial"
                    >
                      <MoveLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-[#D4A574] to-[#8E6447] text-white hover:from-[#8E6447] hover:to-[#D4A574] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
                      aria-label="Next testimonial"
                    >
                      <MoveRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {testimonials.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`transition-all duration-300 rounded-full ${
                          idx === currentIndex
                            ? "bg-[#8E6447] w-8 h-3 shadow-lg shadow-[#8E6447]/50"
                            : "bg-[#D4A574]/30 w-3 h-3 hover:bg-[#D4A574]/50"
                        }`}
                        aria-label={`Go to testimonial ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="bg-[#8E6447]/10 backdrop-blur-sm border border-[#8E6447]/20 rounded-full px-6 py-2">
                <span className="text-[#D4A574] font-semibold text-sm">
                  {currentIndex + 1} / {testimonials.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
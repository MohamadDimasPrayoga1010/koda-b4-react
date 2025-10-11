import { useState, useEffect } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
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
      <p className="text-center text-white py-20">Loading testimonials...</p>
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
    <section className="bg-gradient-to-b from-[#777C82] to-[#0B0909] w-full py-12 flex justify-center items-center">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mx-4 md:mx-16">
        <div className="flex justify-center md:justify-start">
          <img src={current.image} alt={current.name} className="w-full" />
        </div>

        <div className="flex flex-col gap-4 md:w-2/3 text-center md:text-left">
          <h1 className="text-lg font-normal text-white">Testimonial</h1>
          <h3 className="text-2xl md:text-5xl border-l font-medium border-[#FF8906] pl-4 text-white">
            {current.name}
          </h3>
          <p className="text-base font-normal text-[#FF8906]">{current.role}</p>
          <p className="text-base font-normal text-white max-w-md">
            {current.text}
          </p>

          <div className="flex items-center gap-1 justify-center md:justify-start">
            {Array.from({ length: 5 }).map((_, idx) => (
              <img key={idx} src={star} alt="star" className="w-5 h-5" />
            ))}
            <span className="text-white ml-2">{current.rating}</span>
          </div>

          <div className="flex gap-2 mt-4 justify-center md:justify-start">
            <button
              onClick={handlePrev}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FF8906] text-white hover:bg-[#e67a00] transition"
            >
              <MoveLeft />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FF8906] text-white hover:bg-[#e67a00] transition"
            >
              <MoveRight />
            </button>
          </div>

          <div className="flex gap-2 mt-4 justify-center md:justify-start">
            {testimonials.map((_, idx) => (
              <span
                key={idx}
                className={`w-3 h-3 rounded-full transition ${
                  idx === currentIndex ? "bg-[#FF8906]" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;

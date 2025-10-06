import React from 'react'
import { Link } from 'react-router-dom';

const CardPromo = ({ image, title, description, ticket }) => {
  return (
    <section className="bg-[#88B788] rounded-lg">
      <div className="flex gap-3 ">
        <img src={image} alt={title} />
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold">{title}</h1>
          <p className="text-sm font-normal">{description}</p>
          <div className="mt-3">
            <Link>{ticket}</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardPromo

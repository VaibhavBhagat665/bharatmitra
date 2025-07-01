import React from 'react';
import { Scheme } from '../types';

interface SchemeCardProps {
  scheme: Scheme;
}

const SchemeCard: React.FC<SchemeCardProps> = ({ scheme }) => {
  return (
    <div className="rounded-xl shadow-md bg-white p-6 border-l-4 border-red-500 flex flex-col justify-between hover:shadow-xl transition duration-300">
      <div>
        <h3 className="text-lg font-bold text-red-700 mb-1">{scheme.title}</h3>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Department:</span> {scheme.department}
        </p>
        <p className="text-gray-700 text-sm mb-3">{scheme.description}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
            {scheme.category}
          </span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
            {scheme.type}
          </span>
          {scheme.tags?.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <a
        href={scheme.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded-full text-center transition"
      >
        View Details
      </a>
    </div>
  );
};

export default SchemeCard;

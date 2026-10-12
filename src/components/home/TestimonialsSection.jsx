import React from 'react';
import { testimonials } from '@/data/reviews';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-700">
            Client Voices
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 mt-2">
            Praised for Impeccable Craft
          </h2>
          <p className="text-stone-500 text-sm mt-3 font-light">
            Read testimonials from architects, stylists, and conscious collectors worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-soft-sm hover:shadow-soft transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-5">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-stone-200 mb-3" />

                <p className="text-stone-700 text-sm leading-relaxed italic font-serif">
                  "{item.content}"
                </p>
              </div>

              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-stone-100">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-11 h-11 rounded-full object-cover border border-stone-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 font-serif">{item.author}</h4>
                  <p className="text-[11px] text-stone-500">{item.role}</p>
                  <p className="text-[10px] text-stone-400">{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

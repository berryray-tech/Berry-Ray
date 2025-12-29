import React from "react";

const Testimonies = ({ testimonies }) => {
  if (!testimonies || testimonies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">No testimonials available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonies.map((testimony) => (
        <div 
          key={testimony.id} 
          className="bg-white/5 p-6 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
        >
          <p className="italic text-slate-300 mb-4">"{testimony.testimony || testimony.content || testimony.message}"</p>
          <div className="flex items-center justify-between">
            <span className="font-semibold">
              {testimony.student_name || testimony.name || testimony.author || "Anonymous"}
            </span>
            {testimony.is_approved && (
              <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                ✓ Verified
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Testimonies;
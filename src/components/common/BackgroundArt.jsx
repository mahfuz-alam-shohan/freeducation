export const BackgroundArt = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Floating shapes */}
    <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-2xl float-slow"></div>
    <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-indigo-200/30 to-pink-200/30 rounded-full blur-xl float-slower"></div>
    <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl pulse-soft"></div>
    <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-xl float-slow"></div>
    
    {/* Decorative lines */}
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
  </div>
);

export const BookReader = ({ children, className = '' }) => (
  <div className={'w-full ' + className}>
    <div className="font-serif text-slate-900 text-sm leading-snug text-justify space-y-2">
      {children}
    </div>
  </div>
);

export const ArtPanelGrid = ({ children, className = '' }) => (
  <div className={cardPanelClass}>
    <div className={'relative grid justify-items-center ' + cardGridGapClass + ' ' + className}>
      {children}
    </div>
  </div>
);

// CSS classes that would be defined globally
const cardPanelClass = 'bg-white rounded-xl shadow-sm border border-slate-200 p-4';
const cardGridGapClass = 'gap-4';

export const StudentShell = ({ title, subtitle, activeTab, onNavigate, children }) => {
  return (
    <div className="flex flex-col lg:flex-row flex-1 bg-[#f3f6ff]">
      <StudentSidebar activeTab={activeTab} onNavigate={onNavigate} />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
            {subtitle && (
              <p className="text-slate-600 mt-2">{subtitle}</p>
            )}
          </div>
          
          {/* Content */}
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
      
      {/* Mobile Navigation */}
      <StudentMobileNav activeTab={activeTab} onNavigate={onNavigate} />
    </div>
  );
};

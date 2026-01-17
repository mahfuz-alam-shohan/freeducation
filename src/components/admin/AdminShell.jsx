export const AdminShell = ({ activeTab, onNavigate, children }) => {
  return (
    <div className="relative flex flex-col lg:flex-row flex-1 bg-[#fdfbf7] overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <BackgroundArt />
      </div>
      
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onNavigate={onNavigate} />
      
      {/* Main Content */}
      <main className="relative flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
      
      {/* Mobile Navigation */}
      <AdminMobileNav activeTab={activeTab} onNavigate={onNavigate} />
    </div>
  );
};

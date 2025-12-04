import Sidebar from "./sidebar";
import MainContent from "./main_content";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <MainContent />
      </div>
    </div>
  );
};

export default DashboardLayout;

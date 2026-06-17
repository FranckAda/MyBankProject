import Header from "../Layout/Header";
import TopBar from "../Layout/TopBar";
const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Header />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Profile" subtitle="Managing your informations" />
      </div>
    </div>
  );
};

export default Profile;

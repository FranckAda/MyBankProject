import Header from "../Layout/Header";
import TopBar from "../Layout/TopBar";

const Upcoming = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Header />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="New Features" subtitle="Coming soon" />
        <main className="flex-1 flex items-center justify-center pb-20 lg:pb-0">
          <p className="text-2xl font-semibold text-gray-700">
            New Features Coming Soon!
          </p>
        </main>
      </div>
    </div>
  );
};

export default Upcoming;

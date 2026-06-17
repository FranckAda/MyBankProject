import Header from "../Layout/Header";
import TopBar from "../Layout/TopBar";
import ExpenseList from "../ExpenseList";
const Notif = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Header />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Notifications" subtitle="Manage your notifications" />

        <ExpenseList expenses={[]} />
      </div>
    </div>
  );
};

export default Notif;

import ExpenseForm from "../ExpenseForm";
import Header from "../Layout/Header";
import TopBar from "../Layout/TopBar";

const Wallet = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Header />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Wallet" subtitle="Manage your finances" />
        <div className="p-6">
          <ExpenseForm />
        </div>
      </div>
    </div>
  );
};

export default Wallet;

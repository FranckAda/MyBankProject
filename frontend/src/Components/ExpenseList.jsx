import PropTypes from "prop-types";

const ExpenseList = ({ expenses }) => {
  return (
    <>
      {expenses ? (
        expenses.map((expense) => <h1 key={expense.id}>{expense.label}</h1>)
      ) : (
        <h1>no expenses</h1>
      )}
    </>
  );
};

ExpenseList.propTypes = {
  expenses: PropTypes.array,
};

export default ExpenseList;

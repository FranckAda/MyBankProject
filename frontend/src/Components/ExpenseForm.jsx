const ExpenseForm = () => {
  return (
    <form>
      <label htmlFor="amount">Amount:</label>
      <input type="number" id="amount" name="amount" />
      <button type="submit" name="Add">Add</button>
    </form>
  );
};

export default ExpenseForm;

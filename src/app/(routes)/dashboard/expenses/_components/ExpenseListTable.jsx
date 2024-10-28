import { db } from "../../../../../../utils/dbConfig";
import { Expenses } from "../../../../../../utils/schema";
import { eq } from "drizzle-orm";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash, Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import moment from 'moment';
import { ArrowUp, ArrowDown } from "lucide-react";

function ExpenseListTable({ expensesList, refreshData, showAddExpensePrompt, onAddExpenseClick }) {
  const [filteredExpenses, setFilteredExpenses] = useState(expensesList);
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    setFilteredExpenses(expensesList);
  }, [expensesList]);

  const deleteExpense = async (expense) => {
    const result = await db
      .delete(Expenses)
      .where(eq(Expenses.id, expense.id))
      .returning();

    if (result) {
      toast("Expense Deleted!");
      refreshData();
    }
  };

  const handleFilter = () => {
    const filtered = expensesList.filter((expense) => {
      const nameMatch = expense.name.toLowerCase().includes(nameFilter.toLowerCase());
      const dateMatch = dateFilter ? moment(expense.createdAt, 'DD/MM/YYYY').isSame(moment(dateFilter, 'DD/MM/YYYY'), 'day') : true;
      return nameMatch && dateMatch;
    });
    setFilteredExpenses(filtered);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
      if (key === 'amount') {
        const aValue = parseFloat(a[key].replace(/[^0-9.-]+/g, ""));
        const bValue = parseFloat(b[key].replace(/[^0-9.-]+/g, ""));
        return direction === 'ascending' ? aValue - bValue : bValue - aValue;
      } else {
        if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
        return 0;
      }
    });
    setFilteredExpenses(sortedExpenses);
  };

  if (filteredExpenses.length === 0 && !nameFilter && !dateFilter) {
    return (
      <div className="mt-3">
        <h2 className="font-bold text-lg">Latest Expenses</h2>
        <div className="grid grid-cols-4 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3">
          <h2 className="font-bold">Name</h2>
          <h2 className="font-bold">Amount</h2>
          <h2 className="font-bold">Date</h2>
          <h2 className="font-bold">Action</h2>
        </div>
        <div className="bg-slate-50 rounded-b-xl p-4 text-center">
          <p className="text-gray-500">No expenses recorded yet. Start adding your expenses!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Latest Expenses</h2>
      <div className="flex gap-4 mt-2 mb-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Filter by name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Filter by date (DD/MM/YYYY)"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <Button onClick={handleFilter} className="bg-primary text-white px-4 py-2 rounded-md flex items-center">
          <Search className="mr-2" size={18} />
          Filter
        </Button>
      </div>
      <div className="grid grid-cols-12 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2">
        <h2 className="col-span-3 font-bold flex items-center cursor-pointer" onClick={() => handleSort('name')}>
          Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? <ArrowUp size={16} className="ml-1" /> : <ArrowDown size={16} className="ml-1" />) : <ArrowUpDown size={16} className="ml-1" />}
        </h2>
        <h2 className="col-span-2 font-bold flex items-center cursor-pointer" onClick={() => handleSort('amount')}>
          Amount {sortConfig.key === 'amount' ? (sortConfig.direction === 'ascending' ? <ArrowUp size={16} className="ml-1" /> : <ArrowDown size={16} className="ml-1" />) : <ArrowUpDown size={16} className="ml-1" />}
        </h2>
        <h2 className="col-span-2 font-bold flex items-center cursor-pointer" onClick={() => handleSort('createdAt')}>
          Date {sortConfig.key === 'createdAt' ? (sortConfig.direction === 'ascending' ? <ArrowUp size={16} className="ml-1" /> : <ArrowDown size={16} className="ml-1" />) : <ArrowUpDown size={16} className="ml-1" />}
        </h2>
        <h2 className="col-span-3 font-bold flex items-center cursor-pointer" onClick={() => handleSort('budgetName')}>
          Budget {sortConfig.key === 'budgetName' ? (sortConfig.direction === 'ascending' ? <ArrowUp size={16} className="ml-1" /> : <ArrowDown size={16} className="ml-1" />) : <ArrowUpDown size={16} className="ml-1" />}
        </h2>
        <h2 className="col-span-2 font-bold">Action</h2>
      </div>
      {filteredExpenses.map((expense, index) => (
        <div key={index} className="grid grid-cols-12 border-b p-2">
          <h2 className="col-span-3">{expense.name}</h2>
          <h2 className="col-span-2">₱{expense.amount}</h2>
          <h2 className="col-span-2">{expense.createdAt}</h2>
          <h2 className="col-span-3">{expense.budgetName || 'N/A'}</h2>
          <h2 className="col-span-2">
            <Button onClick={() => deleteExpense(expense)} className="bg-transparent text-red-500 hover:bg-gray-100 rounded-full ml-1 px-3 py-3 flex justify-center items-center">
              <Trash size={18} />  
            </Button>
          </h2>
        </div>
      ))}
      {/* Temporary */}
      {showAddExpensePrompt && (
        <div className="grid grid-cols-12 border-b p-2 cursor-pointer" onClick={onAddExpenseClick}>
          <h2 className="col-span-12 text-center text-blue-500 underline">Add New Expense</h2>
        </div>
      )}
    </div>
  );
}

export default ExpenseListTable;

"use client";
import { db } from "../../../../../utils/dbConfig";
import { Budgets, Expenses } from "../../../../../utils/schema";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import ExpenseListTable from "./_components/ExpenseListTable";
import AddExpensesDashboard from "./_components/AddExpensesDashboard";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

function ExpensesScreen() {
  const [expensesList, setExpensesList] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [budgetList, setBudgetList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getAllExpenses();
      getBudgetList();
    }
  }, [user]);

  const getAllExpenses = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
        budgetName: Budgets.name,
      })
      .from(Expenses)
      .leftJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
      .where(eq(Expenses.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  };

  const getBudgetList = async () => {
    const result = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Budgets.id));
    setBudgetList(result);
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-3xl">My Expenses 💸</h2>
        <Button onClick={() => setShowAddExpense(!showAddExpense)}>
          {showAddExpense ? "Hide Add Expense" : "Add New Expense"}
        </Button>
      </div>

      {showAddExpense && (
        <div className="mb-6">
          <AddExpensesDashboard
            budgetId={null}
            user={user}
            refreshData={() => getAllExpenses()}
            budgetList={budgetList}
            onHide={() => setShowAddExpense(false)}
          />
        </div>
      )}

      <ExpenseListTable
        refreshData={() => getAllExpenses()}
        expensesList={expensesList}
        showAddExpensePrompt={!showAddExpense}
        onAddExpenseClick={() => setShowAddExpense(true)}
      />
    </div> 
  );
}

export default ExpensesScreen;
'use client'
import React, {useState, useEffect} from 'react';
import { useUser } from '@clerk/nextjs';
import CardInfo from './_components/CardInfo';
import { db } from '../../../../utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses, Income } from '../../../../utils/schema';
import BarChartDashboard from './_components/BarChartDashboard';
import ExpenseListTable from './expenses/_components/ExpenseListTable';
import BudgetItem from './budgets/_components/BudgetItem';
import CreateBudget from './budgets/_components/CreateBudget';
import AddExpensesDashboard from './expenses/_components/AddExpensesDashboard';

export default function Dashboard (){
  const { user } = useUser();
  const isPremium = user?.publicMetadata?.subscriptionStatus === "premium";
  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false); 

  useEffect(() => {
    user && getBudgetList();
  }, [user])

  const getBudgetList = async () => {
    try {
      const result = await db.select({
        ...getTableColumns(Budgets),
        totalSpent: sql`COALESCE(sum(CAST(${Expenses.amount} AS NUMERIC)), 0)`.mapWith(Number),
        totalItem: sql`COALESCE(count(${Expenses.id}), 0)`.mapWith(Number)
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));
  
      setBudgetList(result);
      getAllExpenses();
      getIncomeList();
    } catch (error) {
      console.error('Error fetching budget list:', error);
    }
  };

  const getIncomeList = async() => {
    try {
      const result = await db.select({
        ...getTableColumns(Income),
        totalAmount: sql`sum(CAST(${Income.amount} AS NUMERIC))`.mapWith(Number),
      }).from(Income).groupBy(Income.id)
      setIncomeList(result);
    } catch (error) {
      console.log('Error fetching income list:', error)
    }
  }

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

    setExpenseList(result);
  };

  return (
    <div className='p-8'>
      <h2 className='font-bold text-4xl'>Hi, {user?.fullName} 👋</h2>
      <p className='text-gray-500'>Here's what's happening with your money. Let's manage your budgets.</p>
      <CardInfo budgetList={budgetList} incomeList={incomeList} />
      <div className='grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5'>
        <div className='lg:col-span-2'>
          {isPremium && <BarChartDashboard budgetList={budgetList}/>}
          <ExpenseListTable 
            expensesList={expenseList} 
            refreshData={() => getBudgetList()} 
            showAddExpensePrompt={!showAddExpense} 
            onAddExpenseClick={() => setShowAddExpense(true)} 
          />
          {showAddExpense && (
            <div className="mt-6">
              <h2 className='font-bold text-lg'>Add New Expense</h2>
              <AddExpensesDashboard
                budgetId={null} 
                user={user} 
                refreshData={() => getBudgetList()} 
                budgetList={budgetList}
                onHide={() => setShowAddExpense(false)} 
              />
            </div>
          )}
        </div>
        <div className='grid gap-5'>
          <h2 className='font-bold text-lg'>Latest Budgets</h2>
          <CreateBudget refreshData={() => getBudgetList()}/>
          {budgetList?.length > 0 
            ? budgetList.map((budget, index) => (
              <BudgetItem budget={budget} key={index}/>
             ))
            : [1,2,3,4].map((items,index) => (
            <div className='h-[180px] w-full bg-slate-200 rounded-lg animate-pulse' key={index}></div>
          ))}
        </div>
      </div>
    </div>
  )
}

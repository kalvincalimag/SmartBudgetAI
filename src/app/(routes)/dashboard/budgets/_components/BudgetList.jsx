"use client"
import React, { useEffect, useState } from 'react';
import CreateBudget from './CreateBudget'
import { db } from '../../../../../../utils/dbConfig'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { Budgets, Expenses } from '../../../../../../utils/schema'
import { useUser } from '@clerk/nextjs'
import BudgetItem from './BudgetItem'

function BudgetList() {
  const [budgetList,setBudgetList] = useState([]);
  const {user} = useUser();
  
  useEffect(()=>{
    user && getBudgetList();
  },[user])

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

  return (
    <div className='mt-7'>
      <div className='grid grid-cols-1
      md:grid-cols-2 lg:grid-cols-3 gap-5'>
      <CreateBudget refreshData={()=>getBudgetList()}/>
      {budgetList?.length > 0 
        ? budgetList.map((budget, index) => (
          <BudgetItem budget={budget} key={index}/>
          ))
        : [1,2,3,4].map((items,index) => (
        <div className='h-[180px] w-full bg-slate-200 rounded-lg animate-pulse' key={index}></div>
      ))}
      </div>       
    </div>
  )
}

export default BudgetList
"use client";
import React, { useEffect, useState } from "react";
import CreateIncomes from "./CreateIncomes";
import { db } from "../../../../../../utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Income, Expenses } from "../../../../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import IncomeItem from "./IncomeItem";

function IncomeList() {
  const [incomelist, setIncomelist] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    user && getIncomelist();
  }, [user]);

  const getIncomelist = async () => {
    const result = await db
      .select({
        ...getTableColumns(Income),
        totalSpend: sql`sum(CAST(${Expenses.amount} AS NUMERIC))`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Income)
      .leftJoin(Expenses, eq(Income.id, Expenses.budgetId))
      .where(eq(Income.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Income.id)
      .orderBy(desc(Income.id));
    setIncomelist(result);
  };

  return (
    <div className="mt-7">
      <div
        className="grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <CreateIncomes refreshData={getIncomelist} />
        {incomelist?.length > 0
          ? incomelist.map((budget, index) => (
              <IncomeItem budget={budget} key={index} refreshData={getIncomelist} />
            ))
          : [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse"></div>
            ))}
      </div>
    </div>
  );
}

export default IncomeList;
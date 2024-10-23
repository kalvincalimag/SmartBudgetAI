import React, {useEffect, useState} from 'react';
import { useUser } from '@clerk/nextjs';
import { PiggyBank, ReceiptText, Wallet, Sparkles, CircleDollarSign, ArrowRight } from 'lucide-react';
import formatNumber from '../../../../../utils';
import getFinancialAdvice from '../../../../../utils/getFinancialAdvice';
import Link from "next/link"; 

function CardInfo({budgetList, incomeList}) {
  const {user} = useUser();
  const isPremium = user?.publicMetadata?.subscriptionStatus === 'premium';
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [financialAdvice, setFinancialAdvice] = useState("");

  useEffect(() => {
    if(budgetList.length > 0 || incomeList.length > 0){
      CalculateCardInfo();
    }
  }, [budgetList, incomeList]);

  useEffect(() => {
    if(totalBudget > 0 || totalIncome > 0 || totalSpent > 0){
      const fetchFinancialAdvice = async () => {
        // Prepare income list data
        const incomeListData = incomeList.map(income => ({
          name: income.name,
          amount: income.amount,
          // totalAmount: income.totalAmount,
        }));

        // Prepare budget list data
        const budgetListData = budgetList.map(budget => ({
          name: budget.name,
          amount: budget.amount,
          totalSpent: budget.totalSpent
        }));

        const advice = await getFinancialAdvice(
          totalBudget, 
          totalIncome, 
          totalSpent, 
          incomeListData, 
          budgetListData
        );
        setFinancialAdvice(advice);
      };
      fetchFinancialAdvice();
    }
  }, [totalBudget, totalIncome, totalSpent, incomeList, budgetList]);

  const CalculateCardInfo = () => {
    let totalBudget_ = 0;
    let totalSpent_ = 0;
    let totalIncome_ = 0;

    budgetList.forEach((element) => {
      totalBudget_ = totalBudget_ + Number(element.amount);
      totalSpent_ = totalSpent_ + element.totalSpent;
    });

    incomeList.forEach((element) => {
      totalIncome_ = totalIncome_ + element.totalAmount;
    });

    setTotalBudget(totalBudget_);
    setTotalSpent(totalSpent_);
    setTotalIncome(totalIncome_);    
  }

  return (
    <div>
        {budgetList.length > 0 ? (
          <div>
            {isPremium && (
            <div className='p-8 border-2 border-indigo-500 mt-4 rounded-2xl flex items-center justify-between bg-white shadow-xl transform transition hover:scale-105 hover:shadow-md duration-300'>
              <div>
                <div className='flex mb-2 flex-row space-x-2 items-center'>
                  <h2 className='text-lg font-semibold text-indigo-700'>SmartBudget AI </h2>
                  <Sparkles className='rounded-full text-indigo-500 w-10 h-10 p-2 bg-gray-100'/>
                </div>
                <h2 className='font-light text-gray-600 text-md'>
                  {financialAdvice || 'Loading AI Advice...'}
                </h2>
              </div>
            </div> 
            )}
            
            <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
              
              {/* TOTAL BUDGET */}
              <Link href="/dashboard/budgets" className="hover:shadow-md rounded-2xl ease-in-out duration-300 group" prefetch={false}>
                <div className='p-7 border rounded-2xl flex items-center justify-between'>
                  <div>
                    <h2 className='text-sm'>Total Budget </h2>
                    <h2 className='font-bold text-2xl'>₱{formatNumber(totalBudget)} </h2>
                  </div>
                  <div className='relative w-12 h-12'>
                    <PiggyBank className='absolute inset-0 bg-primary p-3 h-12 w-12 rounded-full text-white transition-opacity duration-300 group-hover:opacity-30' />
                    <ArrowRight className='absolute inset-0 bg-primary p-3 h-12 w-12 rounded-full text-white transition-opacity duration-300 opacity-0 group-hover:opacity-70' />
                  </div>
                </div>
              </Link>

              {/* TOTAL SPENT */}
              <Link href="/dashboard/expenses" className="hover:shadow-md rounded-2xl ease-in-out duration-300 group" prefetch={false}>
                <div className='p-7 border rounded-2xl flex items-center justify-between'>
                  <div>
                    <h2 className='text-sm'>Total Spent</h2>
                    <h2 className='font-bold text-2xl'>₱{formatNumber(totalSpent)} </h2>
                  </div>
                  <div className='relative w-12 h-12'>
                    <ReceiptText className='absolute inset-0 bg-primary p-3 h-12 w-12 rounded-full text-white transition-opacity duration-300 group-hover:opacity-30'/>
                    <ArrowRight className='absolute inset-0 bg-primary p-3 h-12 w-12 rounded-full text-white transition-opacity duration-300 opacity-0 group-hover:opacity-70'/>
                  </div>                  
                </div>
              </Link>


              {/* NO OF BUDGETS */}
              <Link href="/dashboard/budgets" className="hover:shadow-md rounded-2xl ease-in-out duration-300 group" prefetch={false}>
                <div className='p-7 border rounded-2xl flex items-center justify-between'>
                  <div>
                    <h2 className='text-sm'>No. of Budgets</h2>
                    <h2 className='font-bold text-2xl'>{budgetList?.length} </h2>
                  </div>
                  <div className='relative w-12 h-12'>
                    <Wallet className='absolute inset-0 bg-primary p-3 h-12 w-12 rounded-full text-white transition-opacity duration-300 group-hover:opacity-30'/>
                    <ArrowRight className='absolute inset-0 bg-primary p-3 h-12 w-12 rounded-full text-white transition-opacity duration-300 opacity-0 group-hover:opacity-70'/>
                  </div>                  
                </div>
              </Link>

              {/* SUM OF INCOME STREAMS */}
              <Link href="/dashboard/incomes" className="hover:shadow-md rounded-2xl ease-in-out duration-300 group" prefetch={false}>
                <div className='p-7 border rounded-2xl flex items-center justify-between'>
                  <div>
                    <h2 className='text-sm'>Sum of Income Streams </h2>
                    <h2 className='font-bold text-2xl'>₱{formatNumber(totalIncome)} </h2>
                  </div>
                  <div className='relative w-12 h-12'>
                    <CircleDollarSign className='absolute inset-0 bg-primary p-3 h-12 w-12 rounded-full text-white transition-opacity duration-300 group-hover:opacity-30'/>
                    <ArrowRight className='absolute inset-0 bg-primary p-3 h-12 w-12 rounded-full text-white transition-opacity duration-300 opacity-0 group-hover:opacity-70'/>
                  </div>                  
                </div>
              </Link>

            </div>
          </div>
        ) : (
          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((item, index) => (
              <div
                className="h-[110px] w-full bg-slate-200 animate-pulse rounded-lg"
                key={index}
              ></div>
            ))}
          </div>
        )}
    </div>
  )
}

export default CardInfo;

"use client";

import Image from "next/image";
import { Tabs } from "@/components/ui/tabs";

export function TabsSection() {
  const tabs = [
    {
      title: "AI Advice",
      value: "ai advice",
      content: (
        <div
          className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-neutral-300 to-primary">
          <p>Personalized Advice</p>
          <p className="text-sm"><small>Receive user-specific tailor-made AI-powered budgeting advice.</small></p>
          <DummyContent src="https://res.cloudinary.com/dotera808/image/upload/v1726595676/Advisrr/Dashboard_-_Copy_pzibxk.png"/>
        </div>
      ),
    },
    {
      title: "Central Dashboard",
      value: "central dashboard",
      content: (
        <div
          className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-neutral-300 to-primary">
          <p>Central Dashboard</p>
          <p className="text-sm"><small>Track your expenses and budgets through intuitive visualizations.</small></p>
          <DummyContent src='https://res.cloudinary.com/dotera808/image/upload/v1726595676/Advisrr/DashboardBottom_i9oted.png' />
        </div>
      ),
    },
    {
      title: "Budgeting",
      value: "budgeting",
      content: (
        <div
          className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-neutral-300 to-primary">
          <p>Budget Categorization</p>
          <p className="text-sm"><small>Allocate budgets to custom categories of your choice with ease.</small></p>
          <DummyContent src='https://res.cloudinary.com/dotera808/image/upload/v1726594006/Advisrr/BudgetCreation_tybvid.png' />
        </div>
      ),
    },
    {
      title: "Logging",
      value: "logging",
      content: (
        <div
          className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-neutral-300 to-primary">
          <p>Income/Expenses Logging</p>
          <p className="text-sm"><small>Log your income sources and daily expenses without friction.</small></p>
          <DummyContent src='https://res.cloudinary.com/dotera808/image/upload/v1726595932/Advisrr/Logging_zhfacy.png'/>
        </div>
      ),
    },
  ];

  return (
    (<div
      className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start mt-40 mb-60">
      <Tabs tabs={tabs} />
    </div>)
  );
}

const DummyContent = ({src}) => {
  return (
    (<Image
      src={src}
      alt="dummy image"
      width="2000"
      height="2000"
      className="object-cover object-left-top absolute mt-6 inset-x-0 w-[90%] rounded-xl mx-auto" />)
  );
};

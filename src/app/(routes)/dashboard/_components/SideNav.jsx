import React, { useEffect } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link"; 
import {
  LayoutGrid,
  PiggyBank,
  Receipt,
  ShieldCheck,
  CircleDollarSign,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

function SideNav() {
  const { user } = useUser();
  const isPremium = user?.publicMetadata?.subscriptionStatus === "premium";
  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Incomes",
      icon: CircleDollarSign,
      path: "/dashboard/incomes",
    },
    {
      id: 3,
      name: "Budgets",
      icon: PiggyBank,
      path: "/dashboard/budgets",
    },
    {
      id: 4,
      name: "Expenses",
      icon: Receipt,
      path: "/dashboard/expenses",
    },
  ];

  if (!isPremium) {
    menuList.push({
      id: 5,
      name: "Upgrade",
      icon: ShieldCheck,
      path: "/dashboard/upgrade",
    });
  }

  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="h-screen p-5 border shadow-sm">
      <Link href={'/'} className="flex flex-row items-center">
        <Image src="/advisrr.svg" alt="logo" width={40} height={25} />
        <span className="text-primary font-bold text-xl">SmartBudget AI</span>
      </Link>
      <div className="mt-5">
        {menuList.map((menu, index) => (
          <Link href={menu.path} key={index}>
            <h2
              className={`flex gap-2 items-center to-gray-500 font-medium mb-2 p-4 cursor-pointer rounded-full hover:text-primary hover:bg-blue-100 ${path == menu.path && "text-primary bg-blue-100"}`}>
              <menu.icon />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      <div className="fixed bottom-10 p-5 flex gap-2 items-center font-bold text-gray-900">
        <UserButton /> &nbsp; My Profile
      </div>
    </div>
  );
}

export default SideNav;
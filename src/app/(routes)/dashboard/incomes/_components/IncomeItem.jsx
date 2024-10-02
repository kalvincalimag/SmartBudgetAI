import React from "react";
import { Trash } from "lucide-react";
import { db } from "../../../../../../utils/dbConfig";
import { Income } from "../../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

function IncomeItem({ budget }) {
  if (!budget) return null;

  const deleteIncome = async () => {
    try {
      await db.delete(Income).where(eq(Income.id, budget.id));
      toast("Income source deleted successfully!");
    } catch (error) {
      console.error("Error deleting income:", error);
      toast("Failed to delete income source.");
    }
  };

  return (
    <div className="p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[170px] relative">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full">
            {budget.icon}
          </h2>
          <div>
            <h2 className="font-bold">{budget.name}</h2>
          </div>
        </div>
        <h2 className="font-bold text-primary text-lg">₱{budget.amount}</h2>
      </div>
      <button
        onClick={deleteIncome}
        className="absolute bottom-6 right-6 text-red-500 hover:text-red-700 hover:bg-slate-200 rounded-full p-2"
      >
        <Trash size={22} />
      </button>
    </div>
  );
}

export default IncomeItem;
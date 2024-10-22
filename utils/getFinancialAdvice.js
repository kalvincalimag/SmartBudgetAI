import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend, incomeListData, budgetListData) => {

    console.log("incomeListData:" + incomeListData)
    try {
        const userPrompt = `
           Given the financial data below:
            - Total Budget: ${totalBudget} PHP
            - Total Expenses: ${totalSpend} PHP
            - Total Income: ${totalIncome} PHP
            - Income Sources: ${incomeListData.map(income => `${income.name}: ${income.amount} PHP)`).join(', ')}
            - Budget Categories: ${budgetListData.map(budget => `${budget.name}: ${budget.amount} PHP (Spent: ${budget.totalSpent} PHP)`).join(', ')}

            Analyze the user's financial situation and provide actionable advice in two to three sentences as if you are talking to the user. Consider the following:
            1. Compare total expenses to total income to assess whether the user is living within their means.
            2. Identify budget categories with the highest spending and suggest potential areas for savings.
            3. Recommend ways to optimize income sources or reduce unnecessary expenses.
            4. Provide specific, actionable tips based on the user's income and spending patterns.
        `;

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-4",
            messages:[{ role: 'user',  content: userPrompt }],
        });

        const advice = chatCompletion.choices[0].message.content
        return advice;

    } catch (error) {
        console.error("Error fetching AI advice:", error);
        return "SmartBudgetAI is temporarily refuelling.";
    }
}

export default getFinancialAdvice;

import React from 'react'
import {Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'

function BarChartDashboard({budgetList}) {
  return (
    <div className='border rounded-2xl p-5 bg-gray-100 hover:shadow-md'>
      <h2 className='font-bold text-lg mb-4'>Budget Activity</h2>
      <ResponsiveContainer width={'80%'} height={300}>
          <BarChart data={budgetList} margin={{top:7}}>
              <XAxis dataKey='name'/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Bar dataKey='totalSpent' stackId='a' fill='#4845d2'/>
              <Bar dataKey='amount' stackId='a' fill='#C3C2FF'/>
          </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChartDashboard;
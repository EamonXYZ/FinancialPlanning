import React, { useState } from 'react'
import FinancialCalculator from './components/FinancialCalculator'
import './index.css'

function App() {
  return (
    <div className="container">
      <h1>🏠 家庭财务规划系统</h1>
      <FinancialCalculator />
    </div>
  )
}

export default App

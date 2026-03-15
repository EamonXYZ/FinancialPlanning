import React, { useState } from 'react'
import FinancialChart from './FinancialChart'
import InvestmentAdvice from './InvestmentAdvice'

function FinancialCalculator() {
  // 基础信息
  const [currentAge, setCurrentAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(60)

  // 资产和收入
  const [currentAssets, setCurrentAssets] = useState(1000000)
  const [monthlyIncome, setMonthlyIncome] = useState(20000)
  const [incomeGrowthRate, setIncomeGrowthRate] = useState(5)

  // 房贷信息
  const [mortgageTotal, setMortgageTotal] = useState(2000000)
  const [mortgageYears, setMortgageYears] = useState(30)
  const [monthlyMortgage, setMonthlyMortgage] = useState(10000)

  // 支出明细
  const [expenseItems, setExpenseItems] = useState([
    { id: 1, name: '食品餐饮', amount: 5000 },
    { id: 2, name: '交通出行', amount: 2000 },
    { id: 3, name: '教育支出', amount: 3000 },
    { id: 4, name: '医疗保健', amount: 1000 },
    { id: 5, name: '娱乐购物', amount: 2000 },
  ])

  // 经济参数
  const [inflationRate, setInflationRate] = useState(3)
  const [investmentReturnRate, setInvestmentReturnRate] = useState(8)

  // 风险模拟
  const [unemploymentYear, setUnemploymentYear] = useState('')
  const [unemploymentDuration, setUnemploymentDuration] = useState(6)

  // 计算结果
  const [prediction, setPrediction] = useState(null)

  const addExpenseItem = () => {
    setExpenseItems([
      ...expenseItems,
      { id: Date.now(), name: '', amount: 0 }
    ])
  }

  const removeExpenseItem = (id) => {
    setExpenseItems(expenseItems.filter(item => item.id !== id))
  }

  const updateExpenseItem = (id, field, value) => {
    setExpenseItems(
      expenseItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const calculatePrediction = () => {
    const years = retirementAge - currentAge
    const predictions = []

    let assets = currentAssets
    let remainingMortgage = mortgageTotal

    // 计算月度支出总额
    const totalMonthlyExpenses = expenseItems.reduce(
      (sum, item) => sum + item.amount,
      0
    )

    // 月度净收入
    const monthlyNetIncome = monthlyIncome - monthlyMortgage - totalMonthlyExpenses

    for (let year = 0; year <= years; year++) {
      const age = currentAge + year

      // 工资收入（考虑增长）
      const annualSalaryIncome = monthlyIncome * 12 * Math.pow(1 + incomeGrowthRate / 100, year)

      // 支出通胀
      const annualExpenses = totalMonthlyExpenses * 12 * Math.pow(1 + inflationRate / 100, year)

      // 房贷计算
      let annualMortgage = 0
      if (remainingMortgage > 0) {
        annualMortgage = monthlyMortgage * 12
        remainingMortgage = Math.max(0, remainingMortgage - (annualMortgage - remainingMortgage / mortgageYears))
      }

      // 投资收益（基于当前资产）
      const investmentReturn = assets * investmentReturnRate / 100

      // 失业风险处理：失业时工资收入为0
      let actualSalaryIncome = annualSalaryIncome
      if (unemploymentYear && year === parseInt(unemploymentYear) - currentAge) {
        actualSalaryIncome = 0
      }

      // 总收入 = 工资收入 + 投资收入
      const totalIncome = actualSalaryIncome + investmentReturn

      // 每年可投资金额 = 工资收入 - 房贷 - 支出
      const annualInvestable = actualSalaryIncome - annualMortgage - annualExpenses

      // 年度资产变化
      const assetChange = annualInvestable + investmentReturn
      assets += assetChange

      predictions.push({
        year: year,
        age: age,
        salaryIncome: Math.round(actualSalaryIncome),
        investmentIncome: Math.round(investmentReturn),
        totalIncome: Math.round(totalIncome),
        expenses: Math.round(annualExpenses),
        mortgage: Math.round(annualMortgage),
        investmentReturn: Math.round(investmentReturn),
        investable: Math.round(annualInvestable),
        assets: Math.round(assets),
        assetChange: Math.round(assetChange),
        isUnemployed: unemploymentYear && year === parseInt(unemploymentYear) - currentAge
      })
    }

    setPrediction({
      predictions,
      totalExpenses: totalMonthlyExpenses * 12,
      monthlyNetIncome
    })
  }

  return (
    <div>
      {/* 基础信息卡片 */}
      <div className="card">
        <h2 className="card-title">📋 基础信息</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>当前年龄</label>
            <input
              type="number"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>预期退休年龄</label>
            <input
              type="number"
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>当前资产总额（元）</label>
            <input
              type="number"
              value={currentAssets}
              onChange={(e) => setCurrentAssets(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>当前月收入（元）</label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>收入年增长率（%）</label>
            <input
              type="number"
              value={incomeGrowthRate}
              onChange={(e) => setIncomeGrowthRate(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>预期投资收益率（%）</label>
            <input
              type="number"
              value={investmentReturnRate}
              onChange={(e) => setInvestmentReturnRate(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* 房贷信息卡片 */}
      <div className="card">
        <h2 className="card-title">🏦 房贷信息</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>房贷总额（元）</label>
            <input
              type="number"
              value={mortgageTotal}
              onChange={(e) => setMortgageTotal(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>房贷年限（年）</label>
            <input
              type="number"
              value={mortgageYears}
              onChange={(e) => setMortgageYears(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>每月月供（元）</label>
            <input
              type="number"
              value={monthlyMortgage}
              onChange={(e) => setMonthlyMortgage(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* 支出明细卡片 */}
      <div className="card">
        <h2 className="card-title">💰 家庭支出明细</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>通胀率（%）</label>
            <input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>月支出总额: ¥{expenseItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</label>
          </div>
        </div>

        <div className="expense-list">
          {expenseItems.map(item => (
            <div key={item.id} className="expense-item">
              <input
                type="text"
                placeholder="支出项目"
                value={item.name}
                onChange={(e) => updateExpenseItem(item.id, 'name', e.target.value)}
              />
              <input
                type="number"
                placeholder="月金额"
                value={item.amount}
                onChange={(e) => updateExpenseItem(item.id, 'amount', Number(e.target.value))}
              />
              <button
                className="expense-remove"
                onClick={() => removeExpenseItem(item.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button className="btn btn-secondary" onClick={addExpenseItem}>
          + 添加支出项目
        </button>
      </div>

      {/* 风险模拟卡片 */}
      <div className="card">
        <h2 className="card-title">⚠️ 风险模拟</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>失业年份（留空则不考虑）</label>
            <input
              type="number"
              placeholder="例如：35"
              value={unemploymentYear}
              onChange={(e) => setUnemploymentYear(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>失业持续月数</label>
            <input
              type="number"
              value={unemploymentDuration}
              onChange={(e) => setUnemploymentDuration(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* 计算按钮 */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <button className="btn" onClick={calculatePrediction}>
          📊 开始计算预测
        </button>
      </div>

      {/* 计算结果 */}
      {prediction && (
        <>
          <InvestmentAdvice prediction={prediction} />
          <FinancialChart prediction={prediction} />
        </>
      )}
    </div>
  )
}

export default FinancialCalculator

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
  const [mortgageRate, setMortgageRate] = useState(4.5) // 年利率
  const [mortgageType, setMortgageType] = useState('equal_payment') // equal_payment: 等额本息, equal_principal: 等额本金

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

  // 风险模拟
  const [unemploymentYear, setUnemploymentYear] = useState('')
  const [unemploymentDuration, setUnemploymentDuration] = useState(6)
  const [unemploymentType, setUnemploymentType] = useState('temporary') // temporary: 临时失业, permanent: 永久失业

  // 年度收支调整
  const [yearlyAdjustments, setYearlyAdjustments] = useState([])

  // 投资配置
  const [investmentAllocations, setInvestmentAllocations] = useState([
    { id: 1, name: '现金', percentage: 5, expectedReturn: 1, color: '#28a745', description: '流动性高，应急备用' },
    { id: 2, name: '黄金', percentage: 10, expectedReturn: 3, color: '#ffc107', description: '抗通胀，分散风险' },
    { id: 3, name: '高分红的股票', percentage: 50, expectedReturn: 6, color: '#dc3545', description: '高分红，稳定现金流' },
    { id: 4, name: '中证红利', percentage: 30, expectedReturn: 5, color: '#17a2b8', description: '指数基金，分散投资' },
    { id: 5, name: '货币基金', percentage: 5, expectedReturn: 1.5, color: '#6f42c1', description: '低风险，稳健收益' }
  ])

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

  const addYearlyAdjustment = () => {
    setYearlyAdjustments([
      ...yearlyAdjustments,
      { id: Date.now(), year: 0, salary: '', extraExpense: '' }
    ])
  }

  const removeYearlyAdjustment = (id) => {
    setYearlyAdjustments(yearlyAdjustments.filter(adj => adj.id !== id))
  }

  const updateYearlyAdjustment = (id, field, value) => {
    setYearlyAdjustments(
      yearlyAdjustments.map(adj =>
        adj.id === id ? { ...adj, [field]: value } : adj
      )
    )
  }

  // 投资配置管理函数
  const addInvestmentAllocation = () => {
    setInvestmentAllocations([
      ...investmentAllocations,
      { id: Date.now(), name: '', percentage: 0, expectedReturn: 0, color: '#6c757d', description: '' }
    ])
  }

  const removeInvestmentAllocation = (id) => {
    setInvestmentAllocations(investmentAllocations.filter(item => item.id !== id))
  }

  const updateInvestmentAllocation = (id, field, value) => {
    setInvestmentAllocations(
      investmentAllocations.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  // 计算每月房贷
  const calculateMonthlyMortgage = (total, rate, years, type) => {
    const monthlyRate = rate / 100 / 12
    const months = years * 12

    if (type === 'equal_payment') {
      // 等额本息
      if (rate === 0) {
        return total / months
      }
      return total * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1)
    } else {
      // 等额本金 - 首月还款额
      if (rate === 0) {
        return total / months
      }
      return total / months + total * monthlyRate
    }
  }

  // 计算年度房贷
  const calculateAnnualMortgage = (total, rate, years, type, year, remainingBalance) => {
    const monthlyRate = rate / 100 / 12
    const months = years * 12
    const startMonth = year * 12
    let annualMortgage = 0
    let currentBalance = remainingBalance

    for (let month = 0; month < 12; month++) {
      const currentMonth = startMonth + month
      if (currentMonth >= months) break // 超出房贷期限
      if (currentBalance <= 0) break // 已还清

      let payment, interest, principal
      if (type === 'equal_payment') {
        // 等额本息 - 每月还款相同
        const monthlyPayment = calculateMonthlyMortgage(total, rate, years, type)
        interest = currentBalance * monthlyRate
        principal = monthlyPayment - interest
        // 确保不超过剩余本金
        if (principal > currentBalance) {
          principal = currentBalance
          interest = 0
        }
        payment = principal + interest
      } else {
        // 等额本金 - 每月本金相同，利息递减
        const monthlyPrincipal = total / months
        interest = currentBalance * monthlyRate
        principal = monthlyPrincipal
        if (principal > currentBalance) {
          principal = currentBalance
          interest = 0
        }
        payment = principal + interest
      }

      payment = Math.min(payment, currentBalance)
      annualMortgage += payment
      currentBalance -= principal
    }

    return { annualMortgage, remainingBalance: currentBalance }
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

    // 计算房贷
    const monthlyMortgage = calculateMonthlyMortgage(mortgageTotal, mortgageRate, mortgageYears, mortgageType)
    const monthlyNetIncome = monthlyIncome - monthlyMortgage - totalMonthlyExpenses

    // 计算加权平均投资收益率（基于投资配置）
    const totalPercentage = investmentAllocations.reduce((sum, item) => sum + item.percentage, 0)
    const weightedAverageReturn = totalPercentage > 0 
      ? investmentAllocations.reduce((sum, item) => sum + (item.percentage * item.expectedReturn), 0) / totalPercentage
      : 0 // 如果没有配置，则收益率为0

    for (let year = 0; year <= years; year++) {
      const age = currentAge + year

      // 查找该年份的收入调整
      const yearAdjustment = yearlyAdjustments.find(adj => adj.year === year)

      // 工资收入（考虑增长）
      const annualSalaryIncome = monthlyIncome * 12 * Math.pow(1 + incomeGrowthRate / 100, year)

      // 支出通胀
      let annualExpenses = totalMonthlyExpenses * 12 * Math.pow(1 + inflationRate / 100, year)

      // 应用额外支出调整
      if (yearAdjustment && yearAdjustment.extraExpense !== '') {
        annualExpenses += yearAdjustment.extraExpense
      }

      // 房贷计算
      let annualMortgage = 0
      if (remainingMortgage > 0) {
        const { annualMortgage: mortgagePayment, remainingBalance: newRemainingBalance } = calculateAnnualMortgage(mortgageTotal, mortgageRate, mortgageYears, mortgageType, year, remainingMortgage)
        annualMortgage = mortgagePayment
        if (newRemainingBalance === 0 && remainingMortgage > 0) {
          console.log(`房贷在第${year}年（年龄${currentAge + year}岁）还清`)
        }
        remainingMortgage = newRemainingBalance
      }

      // 工资收入调整（支持自定义调整）
      let actualSalaryIncome = annualSalaryIncome
      if (yearAdjustment && yearAdjustment.salary !== '') {
        actualSalaryIncome = yearAdjustment.salary === 0 ? 0 : yearAdjustment.salary
      }

      // 失业风险处理
      if (unemploymentYear && year >= parseInt(unemploymentYear) - currentAge) {
        if (unemploymentType === 'permanent') {
          // 永久失业：工资收入为0，投资收入也大幅减少
          actualSalaryIncome = 0
        } else if (year === parseInt(unemploymentYear) - currentAge) {
          // 临时失业：失业年工资收入为0
          actualSalaryIncome = 0
        }
      }

      // 每年可投资金额 = 工资收入 - 房贷 - 支出
      const annualInvestable = actualSalaryIncome - annualMortgage - annualExpenses

      // 投资收益计算：基于可投资金额调整后的资产
      // 如果可投资金额为负（从资产中取钱），则投资收益基于取钱后的剩余资产计算
      const assetsForInvestment = assets + annualInvestable
      const investmentReturn = assetsForInvestment > 0 ? assetsForInvestment * weightedAverageReturn / 100 : 0

      // 计算每个资产类别的投资收益细分
      const investmentBreakdown = []
      if (assetsForInvestment > 0 && totalPercentage > 0) {
        investmentAllocations.forEach(item => {
          const allocationPercentage = item.percentage / totalPercentage
          const investmentAmount = assetsForInvestment * allocationPercentage
          const itemReturn = investmentAmount * item.expectedReturn / 100
          investmentBreakdown.push({
            name: item.name,
            percentage: item.percentage,
            expectedReturn: item.expectedReturn,
            investmentAmount: Math.round(investmentAmount),
            return: Math.round(itemReturn),
            color: item.color
          })
        })
      }

      // 总收入 = 工资收入 + 投资收入
      const totalIncome = actualSalaryIncome + investmentReturn

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
        assetsForInvestment: Math.round(assetsForInvestment),
        investmentBreakdown: investmentBreakdown,
        assets: Math.round(assets),
        assetChange: Math.round(assetChange),
        isUnemployed: unemploymentYear && year >= parseInt(unemploymentYear) - currentAge,
        isPermanentlyUnemployed: unemploymentType === 'permanent' && year >= parseInt(unemploymentYear) - currentAge,
        hasCustomAdjustment: !!yearAdjustment,
        isNegativeAssets: assets < 0
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

        </div>
      </div>

      {/* 投资配置卡片 */}
      <div className="card">
        <h2 className="card-title">📊 投资配置</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>配置比例总和: {investmentAllocations.reduce((sum, item) => sum + item.percentage, 0).toFixed(1)}%</label>
          </div>
          <div className="form-group">
            <label>加权平均收益率: {
              investmentAllocations.length > 0 ? 
                (investmentAllocations.reduce((sum, item) => sum + (item.percentage * item.expectedReturn), 0) / 
                 investmentAllocations.reduce((sum, item) => sum + item.percentage, 0)).toFixed(2) : 0
            }%</label>
          </div>
        </div>

        <div className="expense-list">
          {investmentAllocations.map(item => (
            <div key={item.id} className="expense-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: item.color, borderRadius: '2px' }}></div>
                <input
                  type="text"
                  placeholder="资产名称"
                  value={item.name}
                  onChange={(e) => updateInvestmentAllocation(item.id, 'name', e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
              <input
                type="number"
                placeholder="比例%"
                value={item.percentage}
                onChange={(e) => updateInvestmentAllocation(item.id, 'percentage', parseFloat(e.target.value) || 0)}
                style={{ width: '80px' }}
                min="0"
                step="0.1"
              />
              <input
                type="number"
                placeholder="预期收益%"
                value={item.expectedReturn}
                onChange={(e) => updateInvestmentAllocation(item.id, 'expectedReturn', parseFloat(e.target.value) || 0)}
                style={{ width: '80px' }}
                min="0"
                step="0.1"
              />
              <input
                type="text"
                placeholder="描述"
                value={item.description}
                onChange={(e) => updateInvestmentAllocation(item.id, 'description', e.target.value)}
                style={{ flex: 2 }}
              />
              <button
                className="expense-remove"
                onClick={() => removeInvestmentAllocation(item.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button className="btn btn-secondary" onClick={addInvestmentAllocation}>
          + 添加投资资产
        </button>
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
            <label>房贷利率（%）</label>
            <input
              type="number"
              value={mortgageRate}
              onChange={(e) => setMortgageRate(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>还款方式</label>
            <select
              value={mortgageType}
              onChange={(e) => setMortgageType(e.target.value)}
            >
              <option value="equal_payment">等额本息（每月还款相同）</option>
              <option value="equal_principal">等额本金（本金相同，利息递减）</option>
            </select>
          </div>
          <div className="form-group">
            <label>首月月供：¥{calculateMonthlyMortgage(mortgageTotal, mortgageRate, mortgageYears, mortgageType).toLocaleString()}</label>
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
            <label>失业类型</label>
            <select
              value={unemploymentType}
              onChange={(e) => setUnemploymentType(e.target.value)}
            >
              <option value="temporary">临时失业（仅当年）</option>
              <option value="permanent">永久失业（之后年份无工资）</option>
            </select>
          </div>
          {unemploymentType === 'temporary' && (
            <div className="form-group">
              <label>失业持续月数</label>
              <input
                type="number"
                value={unemploymentDuration}
                onChange={(e) => setUnemploymentDuration(Number(e.target.value))}
              />
            </div>
          )}
        </div>
      </div>

      {/* 年度收支调整卡片 */}
      <div className="card">
        <h2 className="card-title">📝 年度收支调整</h2>
        <p style={{ color: '#666', marginBottom: '16px', fontSize: '0.95rem' }}>
          可以为特定年份设置不同的工资收入和支出，留空则使用默认计算值
        </p>

        <div className="expense-list">
          {yearlyAdjustments.map((adjustment, index) => (
            <div key={adjustment.id} className="expense-item">
              <input
                type="number"
                placeholder="第几年"
                value={adjustment.year}
                onChange={(e) => updateYearlyAdjustment(adjustment.id, 'year', Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <input
                type="number"
                placeholder="工资收入(留空=默认)"
                value={adjustment.salary === '' ? '' : adjustment.salary}
                onChange={(e) => updateYearlyAdjustment(adjustment.id, 'salary', e.target.value === '' ? '' : Number(e.target.value))}
                style={{ flex: 2 }}
              />
              <input
                type="number"
                placeholder="额外支出(留空=默认)"
                value={adjustment.extraExpense === '' ? '' : adjustment.extraExpense}
                onChange={(e) => updateYearlyAdjustment(adjustment.id, 'extraExpense', e.target.value === '' ? '' : Number(e.target.value))}
                style={{ flex: 2 }}
              />
              <button
                className="expense-remove"
                onClick={() => removeYearlyAdjustment(adjustment.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button className="btn btn-secondary" onClick={addYearlyAdjustment}>
          + 添加年度调整
        </button>
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
          <InvestmentAdvice prediction={prediction} investmentAllocations={investmentAllocations} />
          <FinancialChart prediction={prediction} />
        </>
      )}
    </div>
  )
}

export default FinancialCalculator

import React from 'react'

function InvestmentAdvice({ prediction }) {
  if (!prediction) return null

  const { predictions, totalExpenses, monthlyNetIncome } = prediction

  // 计算关键指标
  const finalAssets = predictions[predictions.length - 1].assets
  const averageInvestable = predictions.reduce((sum, p) => sum + Math.max(0, p.investable), 0) / predictions.length
  const totalInvestmentReturn = predictions.reduce((sum, p) => sum + p.investmentReturn, 0)
  const totalSalaryIncome = predictions.reduce((sum, p) => sum + p.salaryIncome, 0)

  // 计算风险承受能力
  const riskTolerance = calculateRiskTolerance(predictions)

  // 生成投资建议
  const investmentAllocation = generateInvestmentAllocation(averageInvestable, riskTolerance)

  return (
    <div className="card">
      <h2 className="card-title">💡 投资配置建议</h2>

      {/* 关键指标 */}
      <div className="summary">
        <div className="summary-item positive">
          <div className="summary-item-label">退休时预计资产</div>
          <div className="summary-item-value">¥{finalAssets.toLocaleString()}</div>
        </div>
        <div className="summary-item positive">
          <div className="summary-item-label">平均年度可投资额</div>
          <div className="summary-item-value">¥{Math.round(averageInvestable).toLocaleString()}</div>
        </div>
        <div className="summary-item positive">
          <div className="summary-item-label">累计工资收入</div>
          <div className="summary-item-value">¥{Math.round(totalSalaryIncome).toLocaleString()}</div>
        </div>
        <div className="summary-item positive">
          <div className="summary-item-label">累计投资收益</div>
          <div className="summary-item-value">¥{Math.round(totalInvestmentReturn).toLocaleString()}</div>
        </div>
      </div>

      {/* 风险评估 */}
      <div className="section">
        <h3 className="section-title">📈 风险承受能力评估</h3>
        <p style={{ color: '#666', marginBottom: '12px' }}>
          根据您的财务状况，您的风险承受能力为：
          <strong style={{ color: riskTolerance.level === '高' ? '#28a745' : riskTolerance.level === '中' ? '#ffc107' : '#dc3545', marginLeft: '8px' }}>
            {riskTolerance.level}
          </strong>
        </p>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>
          {riskTolerance.description}
        </p>
      </div>

      {/* 投资配置建议 */}
      <div className="investment-suggestion">
        <h3>🎯 建议投资配置</h3>
        <div className="investment-grid">
          {investmentAllocation.map((item, index) => (
            <div key={index} className="investment-item" style={{ borderLeftColor: item.color }}>
              <h4>{item.name}</h4>
              <div className="percentage" style={{ color: item.color }}>
                {item.percentage}%
              </div>
              <div className="amount">¥{Math.round(averageInvestable * item.percentage / 100).toLocaleString()} / 年</div>
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 财务健康建议 */}
      <div className="section">
        <h3 className="section-title">📋 财务健康建议</h3>
        <ul style={{ color: '#666', lineHeight: '1.8' }}>
          {generateFinancialAdvice(predictions, monthlyNetIncome).map((advice, index) => (
            <li key={index}>{advice}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function calculateRiskTolerance(predictions) {
  const finalAssets = predictions[predictions.length - 1].assets
  const initialAssets = predictions[0].assets
  const growthRate = ((finalAssets - initialAssets) / initialAssets) * 100

  const negativeYears = predictions.filter(p => p.investable < 0).length

  if (growthRate > 100 && negativeYears === 0) {
    return {
      level: '高',
      description: '您的财务状况良好，可以承受较高风险以获得更高回报。建议适当增加股票、指数基金等权益类资产配置。'
    }
  } else if (growthRate > 30) {
    return {
      level: '中',
      description: '您的财务状况稳定，建议采用平衡型投资策略，在权益类和固定收益类资产间保持合理比例。'
    }
  } else {
    return {
      level: '低',
      description: '您的财务状况较为紧张，建议以稳健为主，优先配置固定收益类资产，确保资金安全。'
    }
  }
}

function generateInvestmentAllocation(averageInvestable, riskTolerance) {
  const allocations = {
    高: [
      { name: '股票/指数基金', percentage: 50, color: '#dc3545', description: '高风险高收益，适合长期投资' },
      { name: '债券/固定收益', percentage: 25, color: '#28a745', description: '稳定收益，降低波动' },
      { name: '货币基金', percentage: 15, color: '#17a2b8', description: '流动性好，随时可用' },
      { name: '黄金/其他', percentage: 10, color: '#ffc107', description: '对冲通胀，分散风险' }
    ],
    中: [
      { name: '股票/指数基金', percentage: 35, color: '#dc3545', description: '适度配置，获取增长' },
      { name: '债券/固定收益', percentage: 40, color: '#28a745', description: '主要配置，稳健收益' },
      { name: '货币基金', percentage: 15, color: '#17a2b8', description: '应急储备' },
      { name: '黄金/其他', percentage: 10, color: '#ffc107', description: '分散风险' }
    ],
    低: [
      { name: '股票/指数基金', percentage: 20, color: '#dc3545', description: '少量配置，谨慎投资' },
      { name: '债券/固定收益', percentage: 50, color: '#28a745', description: '主要配置，确保安全' },
      { name: '货币基金', percentage: 25, color: '#17a2b8', description: '主要流动性来源' },
      { name: '黄金/其他', percentage: 5, color: '#ffc107', description: '小幅配置' }
    ]
  }

  return allocations[riskTolerance.level]
}

function generateFinancialAdvice(predictions, monthlyNetIncome) {
  const adviceList = []

  if (monthlyNetIncome > 0) {
    adviceList.push('✅ 当前收支状况良好，建议将每月结余的30%-50%用于投资')
  } else {
    adviceList.push('⚠️ 当前收支为负，建议先优化支出结构，减少非必要开支')
  }

  const hasUnemployment = predictions.some(p => p.isUnemployed)
  if (hasUnemployment) {
    adviceList.push('⚠️ 考虑到失业风险，建议预留6-12个月的生活费作为紧急备用金')
  }

  const negativeInvestableYears = predictions.filter(p => p.investable < 0).length
  if (negativeInvestableYears > 0) {
    adviceList.push(`⚠️ 预测期中有${negativeInvestableYears}年收支为负，建议提前规划应对方案`)
  }

  adviceList.push('💡 建议定期（每半年）重新评估财务状况，调整投资策略')
  adviceList.push('💡 保持多元化的投资组合，分散单一资产风险')
  adviceList.push('💡 关注通胀对购买力的影响，适当配置抗通胀资产')

  return adviceList
}

export default InvestmentAdvice

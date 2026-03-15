import React, { useState } from 'react'

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

  // 理财配置
  const defaultFourThreeTwoOneAllocation = [
    { id: 1, name: '现金', percentage: 5, expectedReturn: 2, color: '#28a745', description: '流动性高，应急备用' },
    { id: 2, name: '黄金', percentage: 10, expectedReturn: 3, color: '#ffc107', description: '抗通胀，分散风险' },
    { id: 3, name: '高分红的股票', percentage: 50, expectedReturn: 8, color: '#dc3545', description: '高分红，稳定现金流' },
    { id: 4, name: '中证红利', percentage: 30, expectedReturn: 7, color: '#17a2b8', description: '指数基金，分散投资' },
    { id: 5, name: '货币基金', percentage: 5, expectedReturn: 3.5, color: '#6f42c1', description: '低风险，稳健收益' }
  ]

  const [fourThreeTwoOneAllocation, setFourThreeTwoOneAllocation] = useState(defaultFourThreeTwoOneAllocation)
  const [selectedYear, setSelectedYear] = useState(0);

  // 更新配置项
  const updateAllocationItem = (id, field, value) => {
    setFourThreeTwoOneAllocation(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  // 计算基于选中资产的配置金额和预期收益
  const selectedAssets = selectedYear === 0 ? finalAssets : predictions[selectedYear - 1].assets
  const hasPositiveAssets = selectedAssets > 0
  const allocationDetails = fourThreeTwoOneAllocation.map(item => {
    const amount = selectedAssets * item.percentage / 100
    const expectedAnnualReturn = amount * item.expectedReturn / 100
    return {
      ...item,
      amount,
      expectedAnnualReturn
    }
  })
  const totalExpectedAnnualReturn = allocationDetails.reduce((sum, item) => sum + item.expectedAnnualReturn, 0)

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

      {/* 理财配置 */}
      <div className="section">
        <h3 className="section-title">💰 理财配置</h3>
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontWeight: '500', color: '#666' }}>查看年份：</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{ padding: '6px 12px', border: '1px solid #ced4da', borderRadius: '4px', backgroundColor: 'white' }}
          >
            <option value={0}>总资产（退休时）</option>
            {predictions.map((p, index) => (
              <option key={index} value={index + 1}>第{index + 1}年</option>
            ))}
          </select>
          <span style={{ fontSize: '0.95rem', color: '#666' }}>
            {selectedYear === 0 ? `基于退休时总资产 ¥${Math.round(finalAssets).toLocaleString()}` : `基于第${selectedYear}年资产 ¥${Math.round(predictions[selectedYear - 1].assets).toLocaleString()}`}
          </span>
        </div>
        <p style={{ color: '#666', marginBottom: '16px', fontSize: '0.95rem' }}>
          根据您的总资产，按照5%现金、10%黄金、50%高分红的股票、30%中证红利、5%货币基金的比例进行配置。您可以调整比例和期望收益率。
        </p>
        
        {hasPositiveAssets ? (
          <>
            <div className="allocation-table">
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>资产类别</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>配置比例 (%)</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>期望收益率 (%)</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>配置金额 (¥)</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>预期年收益 (¥)</th>
                  </tr>
                </thead>
                <tbody>
                  {allocationDetails.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                      <td style={{ padding: '12px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ width: '12px', height: '12px', backgroundColor: item.color, marginRight: '8px', borderRadius: '2px' }}></div>
                          <span style={{ fontWeight: '500' }}>{item.name}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>{item.description}</div>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <input
                          type="number"
                          value={item.percentage}
                          onChange={(e) => updateAllocationItem(item.id, 'percentage', parseFloat(e.target.value) || 0)}
                          style={{ width: '80px', textAlign: 'right', padding: '4px 8px', border: '1px solid #ced4da', borderRadius: '4px' }}
                          min="0"
                          step="0.1"
                        />
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <input
                          type="number"
                          value={item.expectedReturn}
                          onChange={(e) => updateAllocationItem(item.id, 'expectedReturn', parseFloat(e.target.value) || 0)}
                          style={{ width: '80px', textAlign: 'right', padding: '4px 8px', border: '1px solid #ced4da', borderRadius: '4px' }}
                          min="0"
                          step="0.1"
                        />
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>
                        ¥{Math.round(item.amount).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500', color: item.expectedAnnualReturn >= 0 ? '#28a745' : '#dc3545' }}>
                        ¥{Math.round(item.expectedAnnualReturn).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ backgroundColor: '#f8f9fa', borderTop: '2px solid #dee2e6' }}>
                    <td style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>总计</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>
                      {allocationDetails.reduce((sum, item) => sum + item.percentage, 0).toFixed(1)}%
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>
                      {allocationDetails.length > 0 ? 
                        (allocationDetails.reduce((sum, item) => sum + (item.percentage * item.expectedReturn), 0) / 
                         allocationDetails.reduce((sum, item) => sum + item.percentage, 0)).toFixed(2) : 0}%
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>
                      ¥{Math.round(selectedAssets).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: totalExpectedAnnualReturn >= 0 ? '#28a745' : '#dc3545' }}>
                      ¥{Math.round(totalExpectedAnnualReturn).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div style={{ backgroundColor: '#e7f3ff', padding: '16px', borderRadius: '8px', marginTop: '20px' }}>
              <h4 style={{ marginTop: '0', marginBottom: '8px', color: '#004085' }}>📊 配置说明</h4>
              <ul style={{ margin: '0', color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                <li>配置比例总和应为100%，当前为 <strong>{allocationDetails.reduce((sum, item) => sum + item.percentage, 0).toFixed(1)}%</strong></li>
                <li>加权平均期望收益率：<strong>
                  {allocationDetails.length > 0 ? 
                    (allocationDetails.reduce((sum, item) => sum + (item.percentage * item.expectedReturn), 0) / 
                     allocationDetails.reduce((sum, item) => sum + item.percentage, 0)).toFixed(2) : 0}%
                  </strong></li>
                <li>基于选中资产 <strong>¥{Math.round(selectedAssets).toLocaleString()}</strong> 进行配置</li>
                <li>预期年收益总计 <strong>¥{Math.round(totalExpectedAnnualReturn).toLocaleString()}</strong></li>
              </ul>
            </div>
          </>
        ) : (
          <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h4 style={{ marginTop: '0', marginBottom: '12px', color: '#856404' }}>⚠️ 斩杀线警告：总资产为负（负债）</h4>
            <p style={{ color: '#856404', marginBottom: '12px' }}>
              您的选中资产为 <strong style={{ color: '#dc3545' }}>¥{Math.round(selectedAssets).toLocaleString()}</strong>（负债状态）。此时不应进行投资配置，建议优先解决负债问题。
            </p>
            <p style={{ color: '#856404', fontSize: '0.95rem' }}>
              当选中资产转为正数后，理财配置将自动显示。
            </p>
          </div>
        )}
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
  const negativeAssetYears = predictions.filter(p => p.isNegativeAssets).length

  // 如果有任何年份资产为负，风险承受能力为低
  if (negativeAssetYears > 0) {
    return {
      level: '低',
      description: `您的财务状况存在风险，预测期中有${negativeAssetYears}年总资产为负（负债）。建议优先解决负债问题，确保资金安全。`
    }
  }

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

  const hasPermanentUnemployment = predictions.some(p => p.isPermanentlyUnemployed)
  const hasTemporaryUnemployment = predictions.some(p => p.isUnemployed && !p.isPermanentlyUnemployed)
  const hasNegativeAssets = predictions.some(p => p.isNegativeAssets)
  const negativeAssetYears = predictions.filter(p => p.isNegativeAssets).length

  // 斩杀线警告（最高优先级）
  if (hasNegativeAssets) {
    adviceList.push(`⚡ 斩杀线警告：预测期中有${negativeAssetYears}年总资产为负（负债），财务风险极高！`)
    adviceList.push('⚡ 建议立即采取行动：1) 削减非必要支出 2) 增加收入来源 3) 暂停高风险投资')
  }

  if (hasPermanentUnemployment) {
    adviceList.push('🚫 存在永久失业风险，建议建立充足的紧急备用金，并考虑降低生活标准')
    adviceList.push('🚫 永久失业后主要依靠投资收益，建议优先配置稳健型资产')
  } else if (hasTemporaryUnemployment) {
    adviceList.push('⚠️ 考虑到失业风险，建议预留6-12个月的生活费作为紧急备用金')
  }

  if (monthlyNetIncome > 0) {
    adviceList.push('✅ 当前收支状况良好，建议将每月结余的30%-50%用于投资')
  } else {
    adviceList.push('⚠️ 当前收支为负，建议先优化支出结构，减少非必要开支')
  }

  const negativeInvestableYears = predictions.filter(p => p.investable < 0).length
  if (negativeInvestableYears > 0) {
    adviceList.push(`⚠️ 预测期中有${negativeInvestableYears}年收支为负，建议提前规划应对方案`)
  }

  const hasCustomAdjustments = predictions.some(p => p.hasCustomAdjustment)
  if (hasCustomAdjustments) {
    adviceList.push('📝 已设置年度收支调整，请根据实际情况定期更新')
  }

  // 投资收入计算说明
  adviceList.push('📊 投资收入计算规则：总资产为正时按投资收益率计算，总资产为负时无投资收益（斩杀线）')

  adviceList.push('💡 建议定期（每半年）重新评估财务状况，调整投资策略')
  adviceList.push('💡 保持多元化的投资组合，分散单一资产风险')
  adviceList.push('💡 关注通胀对购买力的影响，适当配置抗通胀资产')

  return adviceList
}

export default InvestmentAdvice

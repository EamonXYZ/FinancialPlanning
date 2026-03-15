import React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

function FinancialChart({ prediction }) {
  if (!prediction) return null

  const { predictions } = prediction

  // 格式化货币
  const formatCurrency = (value) => {
    if (value >= 100000000) {
      return `¥${(value / 100000000).toFixed(2)}亿`
    } else if (value >= 10000) {
      return `¥${(value / 10000).toFixed(2)}万`
    }
    return `¥${value.toFixed(0)}`
  }

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: '400px'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '1.1rem' }}>第{data.year}年（{data.age}岁）</p>
          
          <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
            <p style={{ marginBottom: '4px' }}><strong>工资收入:</strong> {formatCurrency(data.salaryIncome)}</p>
            <p style={{ marginBottom: '4px' }}><strong>投资收入:</strong> <span className="positive">{formatCurrency(data.investmentIncome)}</span></p>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '2px' }}>
              计算公式: {data.assets > 0 ? `资产(${formatCurrency(data.assets)}) × 投资收益率` : '资产为负，无投资收益'}
            </p>
          </div>
          
          <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
            <p style={{ marginBottom: '4px' }}><strong>年度支出:</strong> {formatCurrency(data.expenses)}</p>
            <p style={{ marginBottom: '4px' }}><strong>年度房贷:</strong> {formatCurrency(data.mortgage)}</p>
            <p style={{ marginBottom: '4px' }}><strong>可投资金额:</strong> <span className={data.investable >= 0 ? 'positive' : 'negative'}>{formatCurrency(data.investable)}</span></p>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '2px' }}>
              计算公式: 工资收入 - 房贷 - 支出
            </p>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <p style={{ marginBottom: '4px' }}><strong>总收入:</strong> <span className="positive" style={{ fontWeight: 'bold' }}>{formatCurrency(data.totalIncome)}</span></p>
            <p style={{ marginBottom: '4px' }}><strong>投资收益:</strong> <span className="positive">{formatCurrency(data.investmentReturn)}</span></p>
            <p style={{ marginBottom: '4px' }}><strong>资产变化:</strong> <span className={data.assetChange >= 0 ? 'positive' : 'negative'}>{formatCurrency(data.assetChange)}</span></p>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '2px' }}>
              计算公式: 可投资金额 + 投资收益
            </p>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <p style={{ marginBottom: '4px' }}><strong>总资产:</strong> <span className={data.assets >= 0 ? 'positive' : 'negative'} style={{ fontWeight: 'bold' }}>{formatCurrency(data.assets)}</span></p>
            {data.isNegativeAssets && (
              <p style={{ color: '#dc3545', fontWeight: 'bold', marginTop: '4px', padding: '4px 8px', background: '#f8d7da', borderRadius: '4px' }}>
                ⚠️ 斩杀线警告：总资产为负（负债）！
              </p>
            )}
          </div>
          
          {data.isUnemployed && (
            <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #eee' }}>
              <p style={{ color: '#dc3545', fontWeight: 'bold' }}>
                {data.isPermanentlyUnemployed ? '🚫 永久失业（无工资收入）' : '⚠️ 失业年（工资收入为0）'}
              </p>
            </div>
          )}
          
          {data.hasCustomAdjustment && !data.isUnemployed && (
            <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #eee' }}>
              <p style={{ color: '#ffc107', fontWeight: 'bold' }}>📝 自定义调整年</p>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div>
      {/* 资产增长趋势图 */}
      <div className="card">
        <h2 className="card-title">📈 资产增长趋势</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={predictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              label={{ value: '年份', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              label={{ value: '金额', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="assets"
              stroke="#667eea"
              strokeWidth={3}
              name="总资产"
              dot={{ fill: '#667eea', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="investmentReturn"
              stroke="#28a745"
              strokeWidth={2}
              name="投资收益"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 收入支出对比图 */}
      <div className="card">
        <h2 className="card-title">💰 收入支出对比</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={predictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="age"
              label={{ value: '年龄', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              label={{ value: '金额', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="salaryIncome" fill="#667eea" name="工资收入" />
            <Bar dataKey="investmentIncome" fill="#17a2b8" name="投资收入" />
            <Bar dataKey="expenses" fill="#dc3545" name="年度支出" />
            <Bar dataKey="mortgage" fill="#ffc107" name="年度房贷" />
            <Bar dataKey="investable" fill="#28a745" name="年度可投资" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 年度财务详情表 */}
      <div className="card">
        <h2 className="card-title">📊 年度财务详情</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>年份</th>
                <th>年龄</th>
                <th>工资收入</th>
                <th>投资收入</th>
                <th>总收入</th>
                <th>年度支出</th>
                <th>年度房贷</th>
                <th>可投资</th>
                <th>投资收益</th>
                <th>资产变化</th>
                <th>总资产</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((item, index) => (
                <tr key={index}>
                  <td>{item.year}</td>
                  <td>{item.age}岁</td>
                  <td>{formatCurrency(item.salaryIncome)}</td>
                  <td className="positive" title={`投资收入 = ${item.assets > 0 ? `总资产(${formatCurrency(item.assets)}) × 投资收益率` : '资产为负，无投资收益'}`}>
                    {formatCurrency(item.investmentIncome)}
                  </td>
                  <td className="positive" style={{ fontWeight: 'bold' }}>{formatCurrency(item.totalIncome)}</td>
                  <td>{formatCurrency(item.expenses)}</td>
                  <td>{formatCurrency(item.mortgage)}</td>
                  <td className={item.investable >= 0 ? 'positive' : 'negative'} title="可投资金额 = 工资收入 - 房贷 - 支出">
                    {formatCurrency(item.investable)}
                  </td>
                  <td className="positive" title="投资收益 = 投资收入（与投资收入列相同）">
                    {formatCurrency(item.investmentReturn)}
                  </td>
                  <td className={item.assetChange >= 0 ? 'positive' : 'negative'} title="资产变化 = 可投资金额 + 投资收益">
                    {formatCurrency(item.assetChange)}
                  </td>
                  <td className={item.assets >= 0 ? 'positive' : 'negative'} style={{ fontWeight: 'bold' }} title={`总资产 = 上年总资产 + 资产变化${item.isNegativeAssets ? ' (斩杀线：资产为负)' : ''}`}>
                    {formatCurrency(item.assets)}
                  </td>
                  <td>
                    {item.isNegativeAssets ? (
                      <span style={{ color: '#dc3545', fontWeight: 'bold', background: '#f8d7da', padding: '2px 6px', borderRadius: '4px' }}>⚡ 斩杀线</span>
                    ) : item.isPermanentlyUnemployed ? (
                      <span style={{ color: '#dc3545', fontWeight: 'bold' }}>🚫 永久失业</span>
                    ) : item.isUnemployed ? (
                      <span style={{ color: '#dc3545', fontWeight: 'bold' }}>⚠️ 失业</span>
                    ) : item.hasCustomAdjustment ? (
                      <span style={{ color: '#ffc107' }}>📝 调整</span>
                    ) : item.investable < 0 ? (
                      <span style={{ color: '#dc3545' }}>❌ 收支为负</span>
                    ) : (
                      <span style={{ color: '#28a745' }}>✅ 正常</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 关键财务指标总结 */}
      <div className="card">
        <h2 className="card-title">🎯 财务指标总结</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>预测总年数</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#667eea' }}>
              {predictions.length}年
            </div>
          </div>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>最终年龄</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#667eea' }}>
              {predictions[predictions.length - 1].age}岁
            </div>
          </div>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>累计工资收入</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#28a745' }}>
              {formatCurrency(predictions.reduce((sum, p) => sum + p.salaryIncome, 0))}
            </div>
          </div>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>累计支出</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#dc3545' }}>
              {formatCurrency(predictions.reduce((sum, p) => sum + p.expenses, 0))}
            </div>
          </div>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>累计房贷</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ffc107' }}>
              {formatCurrency(predictions.reduce((sum, p) => sum + p.mortgage, 0))}
            </div>
          </div>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>资产总增长</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: predictions[predictions.length - 1].assets >= predictions[0].assets ? '#28a745' : '#dc3545' }}>
              {formatCurrency(predictions[predictions.length - 1].assets - predictions[0].assets)}
            </div>
          </div>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>累计投资收益</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#17a2b8' }}>
              {formatCurrency(predictions.reduce((sum, p) => sum + p.investmentReturn, 0))}
            </div>
          </div>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>平均年增长率</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#667eea' }}>
              {(((predictions[predictions.length - 1].assets / predictions[0].assets) ** (1 / predictions.length) - 1) * 100).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancialChart

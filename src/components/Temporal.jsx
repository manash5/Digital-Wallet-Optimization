import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const Temporal = ({ data, colors }) => {
  // Calculate time period icons and colors
  const timePeriodConfig = {
    'Night': { icon: '🌙', color: '#6366F1' },
    'Morning': { icon: '🌅', color: '#F59E0B' },
    'Afternoon': { icon: '☀️', color: '#EF4444' },
    'Evening': { icon: '🌆', color: '#8B5CF6' }
  };

  // Prepare hourly data for bar chart
  const hourlyChartData = useMemo(() => {
    if (!data || !data.hourlyPattern) return [];
    return data.hourlyPattern.map(h => ({
      hour: h.hour,
      transactions: h.transactions
    }));
  }, [data]);

  // Prepare day of week data
  const dayOfWeekData = useMemo(() => {
    if (!data || !data.dayOfWeekPattern) return [];
    return data.dayOfWeekPattern;
  }, [data]);

  // Prepare monthly trend data (showing 2022, 2023, 2024)
  const monthlyTrendData = useMemo(() => {
    if (!data || !data.monthlyTrend) return [];

    // Group by month name across years
    const monthlyByName = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    monthNames.forEach(month => {
      monthlyByName[month] = { month };
    });

    data.monthlyTrend.forEach(item => {
      const [monthPart, year] = item.month.split(' ');
      const monthIndex = Number.isNaN(parseInt(monthPart, 10))
        ? monthNames.indexOf(monthPart)
        : parseInt(monthPart, 10) - 1;
      const monthName = monthNames[monthIndex];

      if (monthName) {
        monthlyByName[monthName][`y${year}`] = item.transactions;
      }
    });

    return monthNames.map(month => monthlyByName[month]).filter(m => m.y2022 || m.y2023 || m.y2024);
  }, [data]);

  // Time period data for donut chart
  const timePeriodData = useMemo(() => {
    if (!data || !data.timePeriodBreakdown) return [];
    return data.timePeriodBreakdown.map(tp => ({
      name: `${tp.period} (${tp.timeRange})`,
      value: tp.transactions,
      percentage: tp.percentage
    }));
  }, [data]);

  const pieColors = ['#6366F1', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Festival insights from real data
  const festivalInsights = useMemo(() => {
    if (!data || !data.festivalImpact) return {
      volumeIncrease: 0,
      festivalPercentage: 0,
      avgIncrease: 0
    };
    
    return {
      volumeIncrease: data.festivalImpact.volumeIncrease || 0,
      festivalPercentage: data.festivalImpact.festivalPercentage || 0,
      avgFestivalTransaction: data.festivalImpact.avgFestivalTransaction || 0,
      avgNonFestivalTransaction: data.festivalImpact.avgNonFestivalTransaction || 0
    };
  }, [data]);

  // Peak hour from real data
  const peakHourInfo = useMemo(() => {
    if (!data || !data.hourlyPattern) return { hour: '14:00-16:00', percentage: 0 };
    
    const peakHour = data.hourlyPattern.reduce((max, curr) => 
      curr.transactions > max.transactions ? curr : max, data.hourlyPattern[0]);
    
    return {
      hour: `${peakHour.hour}:00`,
      percentage: peakHour.percentage
    };
  }, [data]);

  // Yearly growth from real data
  const yearlyGrowth = useMemo(() => {
    if (!data || !data.yearlyComparison || data.yearlyComparison.length < 2) return {
      growth: 0,
      successRateImprovement: 0
    };
    
    const sorted = [...data.yearlyComparison].sort((a, b) => a.year - b.year);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    
    return {
      growth: parseFloat((((last.transactions - first.transactions) / first.transactions) * 100).toFixed(2)),
      successRateImprovement: parseFloat((last.successRate - first.successRate).toFixed(2)),
      firstYear: first.year,
      lastYear: last.year,
      firstSuccessRate: first.successRate,
      lastSuccessRate: last.successRate
    };
  }, [data]);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
      <motion.h3 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '24px',
          fontFamily: '"Poppins", sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
        <span style={{
          background: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>Temporal Analysis</span>
      </motion.h3>
      <p style={{ fontSize: '16px', color: 'rgba(241,245,249,0.7)', marginBottom: '32px' }}>
        Time-based transaction patterns from {data?.summary?.totalTransactions?.toLocaleString() || '500,000'} real transactions
      </p>

      {/* Grid for Hourly and Day of Week */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '48px' }}>
        
        {/* Hourly Transaction Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(37,99,235,0.12) 100%)',
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(59,130,246,0.25)'
          }}>
          <h4 style={{
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '24px',
            color: '#F1F5F9'
          }}>HOURLY TRANSACTION DISTRIBUTION</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(241,245,249,0.1)" />
              <XAxis 
                dataKey="hour" 
                tick={{ fontSize: 10, fill: '#F1F5F9' }} 
                stroke="rgba(241,245,249,0.3)"
                interval={1}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#F1F5F9' }} 
                stroke="rgba(241,245,249,0.3)" 
              />
              <Bar 
                dataKey="transactions" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Day of Week Pattern */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.12) 100%)',
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(16,185,129,0.25)'
          }}>
          <h4 style={{
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '24px',
            color: '#F1F5F9'
          }}>DAY OF WEEK PATTERN</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dayOfWeekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(241,245,249,0.1)" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 11, fill: '#F1F5F9' }} 
                stroke="rgba(241,245,249,0.3)"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#F1F5F9' }} 
                stroke="rgba(241,245,249,0.3)" 
              />
              <Bar 
                dataKey="transactions" 
                radius={[4, 4, 0, 0]}
              >
                {dayOfWeekData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isWeekend ? '#EF4444' : '#3B82F6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Grid for Monthly Trend and Time Period Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '48px' }}>
        
        {/* Monthly Trend Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(147,51,234,0.12) 100%)',
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
            border: '1px solid rgba(168,85,247,0.3)',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(168,85,247,0.25)'
          }}>
          <h4 style={{
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '24px',
            color: '#F1F5F9'
          }}>MONTHLY TREND ANALYSIS</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(241,245,249,0.1)" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11, fill: '#F1F5F9' }} 
                stroke="rgba(241,245,249,0.3)"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#F1F5F9' }} 
                stroke="rgba(241,245,249,0.3)" 
              />
              <Legend wrapperStyle={{ color: '#F1F5F9' }} />
              <Line 
                type="monotone" 
                dataKey="y2022" 
                stroke="#3B82F6" 
                strokeWidth={2} 
                name="2022"
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="y2023" 
                stroke="#10B981" 
                strokeWidth={2} 
                name="2023"
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="y2024" 
                stroke="#EF4444" 
                strokeWidth={2} 
                name="2024"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Time Period Breakdown */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(217,119,6,0.12) 100%)',
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(245,158,11,0.25)'
          }}>
          <h4 style={{
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '24px',
            color: '#F1F5F9'
          }}>TIME PERIOD BREAKDOWN</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={timePeriodData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={(entry) => `${entry.percentage}%`}
                labelLine={false}
                stroke="none"
              >
                {timePeriodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Legend 
                wrapperStyle={{ color: '#F1F5F9' }}
                formatter={(value, entry) => {
                  const period = value.split(' ')[0];
                  return `${timePeriodConfig[period]?.icon || ''} ${value}`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Time Period Breakdown Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '48px'
      }}>
        {data?.timePeriodBreakdown?.map((period, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            whileHover={{ y: -8, scale: 1.05 }}
            style={{
              background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(16,185,129,0.12) 100%)',
              backdropFilter: 'blur(20px) saturate(150%)',
              WebkitBackdropFilter: 'blur(20px) saturate(150%)',
              border: '1px solid rgba(6,182,212,0.3)',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(6,182,212,0.2)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
            <div style={{ fontSize: '48px', marginBottom: '12px', lineHeight: '1' }}>
              <span style={{ fontSize: '40px' }}>
                {timePeriodConfig[period.period]?.icon || '⏰'}
              </span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#F1F5F9' }}>
              {period.period}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(241,245,249,0.7)', marginBottom: '12px' }}>
              {period.timeRange}
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#06B6D4', marginBottom: '4px' }}>
              {period.percentage}%
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(241,245,249,0.6)' }}>
              {period.transactions.toLocaleString()} txns
            </div>
          </motion.div>
        ))}
      </div>

      {/* Festival Impact Analysis */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        style={{
          background: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.12) 100%)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(249,115,22,0.3)',
          padding: '36px',
          borderRadius: '24px',
          marginBottom: '48px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(249,115,22,0.25)',
          color: '#F1F5F9'
        }}>
        <h4 style={{
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '16px',
          color: '#F1F5F9'
        }}>Festival Impact Analysis</h4>
        <p style={{ fontSize: '14px', color: 'rgba(241,245,249,0.8)', marginBottom: '24px', lineHeight: '1.6' }}>
          Dashain and Tihar festivals show significant behavioral changes - {festivalInsights.festivalPercentage}% of all transactions occur during festival periods.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            background: 'rgba(249,115,22,0.15)',
            padding: '20px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(249,115,22,0.3)'
          }}>
            <div style={{ fontSize: '14px', color: 'rgba(241,245,249,0.9)', marginBottom: '8px' }}>Festival Periods</div>
            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#EA580C' }}>
              {festivalInsights.festivalPercentage}%
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(241,245,249,0.8)' }}>
              of total transactions
            </div>
          </div>
          
          <div style={{
            background: 'rgba(236,72,153,0.15)',
            padding: '20px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(236,72,153,0.3)'
          }}>
            <div style={{ fontSize: '14px', color: 'rgba(241,245,249,0.9)', marginBottom: '8px' }}>Transaction Value Increase</div>
            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#EC4899' }}>
              +{festivalInsights.volumeIncrease}%
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(241,245,249,0.8)' }}>
              Higher spending during festivals
            </div>
          </div>
          
          <div style={{
            background: 'rgba(168,85,247,0.15)',
            padding: '20px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(168,85,247,0.3)'
          }}>
            <div style={{ fontSize: '14px', color: 'rgba(241,245,249,0.9)', marginBottom: '8px' }}>Avg Festival Transaction</div>
            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#A855F7' }}>
              NPR {(festivalInsights.avgFestivalTransaction / 1000).toFixed(1)}K
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(241,245,249,0.8)' }}>
              vs NPR {(festivalInsights.avgNonFestivalTransaction / 1000).toFixed(1)}K normal
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Temporal Insights */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(16,185,129,0.12) 100%)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(6,182,212,0.3)',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(6,182,212,0.25)'
        }}>
        <h4 style={{
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '24px',
          color: '#F1F5F9'
        }}>Key Temporal Insights from Real Data</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          <div style={{
            padding: '24px',
            background: 'rgba(16,185,129,0.1)',
            borderRadius: '12px',
            border: '1.5px solid rgba(16,185,129,0.3)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px', lineHeight: '1' }}><span style={{ fontSize: '28px' }}>📊</span></div>
            <h5 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#F1F5F9' }}>
              Peak Activity Hour: {peakHourInfo.hour}
            </h5>
            <p style={{ fontSize: '14px', color: 'rgba(241,245,249,0.8)', marginBottom: '12px', lineHeight: '1.6' }}>
              {peakHourInfo.percentage}% of daily transactions occur at peak hour.
            </p>
            <div style={{
              padding: '10px 12px',
              background: 'rgba(16,185,129,0.2)',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#10B981',
              fontWeight: '600'
            }}>
              💡 Solution: Auto-scale infrastructure during peak hours
            </div>
          </div>

          <div style={{
            padding: '24px',
            background: 'rgba(6,182,212,0.1)',
            borderRadius: '12px',
            border: '1.5px solid rgba(6,182,212,0.3)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px', lineHeight: '1' }}><span style={{ fontSize: '28px' }}>🎊</span></div>
            <h5 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#F1F5F9' }}>
              Festival Optimization Opportunity
            </h5>
            <p style={{ fontSize: '14px', color: 'rgba(241,245,249,0.8)', marginBottom: '12px', lineHeight: '1.6' }}>
              {festivalInsights.volumeIncrease > 0 ? `+${festivalInsights.volumeIncrease}%` : festivalInsights.volumeIncrease}% higher transaction value during festivals.
            </p>
            <div style={{
              padding: '10px 12px',
              background: 'rgba(6,182,212,0.2)',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#06B6D4',
              fontWeight: '600'
            }}>
              💡 Solution: Personalized cashback during festival periods
            </div>
          </div>

          <div style={{
            padding: '24px',
            background: 'rgba(245,158,11,0.1)',
            borderRadius: '12px',
            border: '1.5px solid rgba(245,158,11,0.3)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px', lineHeight: '1' }}><span style={{ fontSize: '28px' }}>📈</span></div>
            <h5 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#F1F5F9' }}>
              Yearly Growth: {yearlyGrowth.firstYear}-{yearlyGrowth.lastYear}
            </h5>
            <p style={{ fontSize: '14px', color: 'rgba(241,245,249,0.8)', marginBottom: '12px', lineHeight: '1.6' }}>
              Success rate improved from {yearlyGrowth.firstSuccessRate}% to {yearlyGrowth.lastSuccessRate}% (+{yearlyGrowth.successRateImprovement}%).
            </p>
            <div style={{
              padding: '10px 12px',
              background: 'rgba(245,158,11,0.2)',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#F59E0B',
              fontWeight: '600'
            }}>
              💡 Solution: Predictive models for 2025 planning
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Temporal;

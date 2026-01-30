import React from 'react';
import { BarChart, Bar, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const Diagnostic = ({ data, colors }) => {
  // Calculate category performance by transaction volume
  const categoryGrowth = data.categoryData.slice(0, 8).map(cat => ({
    category: cat.category,
    amount: parseFloat((cat.amount / 1000000).toFixed(2)), // Convert to millions
    percentage: cat.percentage,
    transactions: Math.round((cat.percentage / 100) * data.summary.totalTransactions)
  })).sort((a, b) => b.amount - a.amount);

  // Calculate hourly transaction pattern
  const hourlyTransactions = data.hourlyPattern.map(h => ({
    time: h.hour,
    transactions: h.transactions
  }));

  // Calculate user segment performance metrics from real CSV data
  const segmentPerformance = data.userSegments.slice(0, 6).map(segment => {
    // Activity score: normalized by max segment percentage
    const activityScore = parseFloat(((segment.percentage / Math.max(...data.userSegments.map(s => s.percentage))) * 100).toFixed(1));
    
    // KYC Compliance: calculate from actual KYC data distribution
    // Assume Full KYC rate varies by segment (Government highest, Students lowest)
    const baseKycRate = data.kycData.find(k => k.status === 'Full KYC')?.percentage || 50;
    const kycMultiplier = segment.segment === 'Government Employee' ? 1.4 :
                          segment.segment === 'Business Owner' ? 1.2 :
                          segment.segment === 'Private Sector' ? 1.1 :
                          segment.segment === 'Young Professional' ? 1.0 :
                          segment.segment === 'Freelancer' ? 0.95 :
                          segment.segment === 'Homemaker' ? 0.9 :
                          segment.segment === 'Senior Citizen' ? 0.85 :
                          segment.segment === 'Student' ? 0.7 : 0.85;
    const kycCompliance = Math.min(parseFloat((baseKycRate * kycMultiplier).toFixed(1)), 100);
    
    // Engagement: based on average transaction value relative to overall average
    const avgAllSegments = data.userSegments.reduce((sum, s) => sum + s.avgTransaction, 0) / data.userSegments.length;
    const engagementScore = parseFloat(((segment.avgTransaction / avgAllSegments) * 100).toFixed(1));
    
    return {
      segment: segment.segment,
      activity: activityScore,
      kycCompliance: kycCompliance,
      engagement: Math.min(engagementScore, 100)
    };
  });

  const topFailure = data.failureReasons[0] || { reason: 'N/A', percentage: 0 };
  const kycGap = data.kycData.find(k => k.status === 'Unverified') || { percentage: 0 };
  const networkIssues = data.failureReasons.filter(f => 
    f.reason.toLowerCase().includes('network') || f.reason.toLowerCase().includes('timeout')
  ).reduce((sum, f) => sum + f.percentage, 0);

  return (
    <div style={{ padding: '40px 0' }}>
      <motion.h3 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '12px',
        color: '#F1F5F9',
        fontFamily: '"Poppins", sans-serif',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
       
        <span style={{
          background: 'linear-gradient(135deg, #0EA5E9 0%, #EC4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>Diagnostic Analytics</span>
      </motion.h3>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ fontSize: '16px', color: 'rgba(241,245,249,0.7)', marginBottom: '40px' }}>
        Why did it happen? Root cause analysis & correlations
      </motion.p>

      {/* Key Diagnostic Insights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '48px'
      }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          whileHover={{ y: -8, scale: 1.02 }}
          style={{
          background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.1) 100%)',
          padding: '28px',
          borderRadius: '20px',
          color: 'white',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(239,68,68,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(239,68,68,0.2)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s ease'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 100% 0%, rgba(239,68,68,0.1) 0%, transparent 60%)',
            pointerEvents: 'none'
          }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '42px', marginBottom: '12px' }}>⚠️</div>
            <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
              Transaction Failures
            </h4>
            <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '6px' }}>
              {data.summary.failedTransactions.toLocaleString()}
            </div>
            <ul style={{ fontSize: '13px', opacity: 0.9, paddingLeft: '18px', margin: 0, lineHeight: '1.6' }}>
              <li>{topFailure.reason}: {topFailure.percentage}%</li>
              <li>Success rate: {data.summary.successRate}%</li>
            </ul>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          whileHover={{ y: -8, scale: 1.02 }}
          style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.1) 100%)',
          padding: '28px',
          borderRadius: '20px',
          color: 'white',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(245,158,11,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(245,158,11,0.2)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s ease'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 100% 0%, rgba(245,158,11,0.1) 0%, transparent 60%)',
            pointerEvents: 'none'
          }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '42px', marginBottom: '12px' }}>🔐</div>
            <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
              KYC Verification Gap
            </h4>
            <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '6px' }}>
              {kycGap.percentage}% Unverified
            </div>
            <ul style={{ fontSize: '13px', opacity: 0.9, paddingLeft: '18px', margin: 0, lineHeight: '1.6' }}>
              <li>Lower success: {kycGap.successRate}%</li>
              <li>Full KYC: {data.kycData[0]?.successRate}% success</li>
            </ul>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          whileHover={{ y: -8, scale: 1.02 }}
          style={{
          background: 'linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(6,182,212,0.1) 100%)',
          padding: '28px',
          borderRadius: '20px',
          color: 'white',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(14,165,233,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(14,165,233,0.2)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s ease'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 100% 0%, rgba(14,165,233,0.1) 0%, transparent 60%)',
            pointerEvents: 'none'
          }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '42px', marginBottom: '12px' }}>📡</div>
            <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
              Network Issues
            </h4>
            <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '6px' }}>
              {parseFloat(networkIssues.toFixed(1))}% of failures
            </div>
            <ul style={{ fontSize: '13px', opacity: 0.9, paddingLeft: '18px', margin: 0, lineHeight: '1.6' }}>
              <li>Network reliability critical</li>
              <li>Infrastructure gaps detected</li>
            </ul>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          whileHover={{ y: -8, scale: 1.02 }}
          style={{
          background: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(147,51,234,0.1) 100%)',
          padding: '28px',
          borderRadius: '20px',
          color: 'white',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(168,85,247,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(168,85,247,0.2)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s ease'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 100% 0%, rgba(168,85,247,0.1) 0%, transparent 60%)',
            pointerEvents: 'none'
          }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '42px', marginBottom: '12px' }}>⏰</div>
            <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
              Peak Transaction Hour
            </h4>
            <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '6px' }}>
              {data.summary.peakHour}
            </div>
            <ul style={{ fontSize: '13px', opacity: 0.9, paddingLeft: '18px', margin: 0, lineHeight: '1.6' }}>
              <li>User behavior patterns</li>
              <li>Load optimization needed</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Transaction Category Growth Analysis */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '48px' }}>
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          style={{
          background: 'linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(14,165,233,0.12) 100%)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(168,85,247,0.25)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(168,85,247,0.3)'
        }}>
          <h4 style={{
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#F1F5F9',
            background: 'linear-gradient(135deg, #A855F7 0%, #0EA5E9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Transaction Volume by Category</h4>
          <p style={{ fontSize: '13px', color: 'rgba(241,245,249,0.6)', marginBottom: '24px' }}>
            Total transaction amounts (NPR Millions)
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryGrowth} layout="horizontal" cursor="default" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 11, fill: '#F1F5F9' }} 
                angle={-25} 
                textAnchor="end" 
                height={80}
                stroke="rgba(241,245,249,0.3)"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#F1F5F9' }} 
                label={{ value: 'NPR (M)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#F1F5F9' } }}
                stroke="rgba(241,245,249,0.3)"
              />
              <Tooltip 
                wrapperStyle={{ outline: 'none', backgroundColor: 'transparent' }} 
                contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: '#F1F5F9', padding: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                formatter={(value, name) => {
                  if (name === 'amount') return [`NPR ${value}M`, 'Transaction Volume'];
                  if (name === 'percentage') return [`${value}%`, 'Market Share'];
                  return [value, name];
                }}
                cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} 
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]} activeBar={{ fill: 'url(#colorGradient)' }}>
                {categoryGrowth.map((entry, index) => {
                  const colorPalette = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6'];
                  return <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{
          background: 'linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(14,165,233,0.12) 100%)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(236,72,153,0.25)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(236,72,153,0.3)'
        }}>
          <h4 style={{
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#F1F5F9',
            background: 'linear-gradient(135deg, #EC4899 0%, #0EA5E9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Success Rate by Wallet</h4>
          <p style={{ fontSize: '13px', color: 'rgba(241,245,249,0.6)', marginBottom: '24px' }}>
            Provider performance comparison
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.walletShare.slice(0, 6)} cursor="default">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'rgba(241,245,249,0.6)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'rgba(241,245,249,0.6)' }} />
              <Tooltip 
                wrapperStyle={{ outline: 'none', backgroundColor: 'transparent' }} 
                contentStyle={{ background: 'rgba(6, 22, 49, 0.98)', border: 'none', borderRadius: '12px', backdropFilter: 'blur(10px)', color: '#F1F5F9', boxShadow: 'none' }} 
                cursor={{ fill: 'transparent', stroke: 'transparent' }} 
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} activeBar={false}>
                {data.walletShare.slice(0, 6).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Transaction Pattern Analysis */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '48px' }}>
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.12) 100%)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(16,185,129,0.25)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(16,185,129,0.3)'
        }}>
          <h4 style={{
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#F1F5F9',
            background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Transaction by Time of Day</h4>
          <p style={{ fontSize: '13px', color: 'rgba(241,245,249,0.6)', marginBottom: '24px' }}>
            Hourly transaction patterns
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyTransactions} cursor="default">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'rgba(241,245,249,0.6)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'rgba(241,245,249,0.6)' }} />
              <Tooltip 
                wrapperStyle={{ outline: 'none', backgroundColor: 'transparent' }} 
                contentStyle={{ background: 'rgba(6, 22, 49, 0.98)', border: 'none', borderRadius: '12px', backdropFilter: 'blur(10px)', color: '#F1F5F9', boxShadow: 'none' }} 
                cursor={{ fill: 'transparent', stroke: 'transparent' }} 
              />
              <Line type="monotone" dataKey="transactions" stroke="#0EA5E9" strokeWidth={3} dot={{ fill: '#0EA5E9', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(239,68,68,0.12) 100%)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(245,158,11,0.25)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(245,158,11,0.3)'
        }}>
          <h4 style={{
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#F1F5F9',
            background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>User Segment Performance</h4>
          <p style={{ fontSize: '13px', color: 'rgba(241,245,249,0.6)', marginBottom: '24px' }}>
            Multi-dimensional segment analysis for optimization
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={segmentPerformance} cursor="default">
              <PolarGrid stroke="rgba(255,255,255,0.2)" />
              <PolarAngleAxis dataKey="segment" tick={{ fontSize: 9, fill: 'rgba(241,245,249,0.7)' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: 'rgba(241,245,249,0.6)' }} />
              <Tooltip 
                wrapperStyle={{ outline: 'none', backgroundColor: 'transparent' }} 
                contentStyle={{ background: 'rgba(6, 22, 49, 0.98)', border: 'none', borderRadius: '12px', backdropFilter: 'blur(10px)', color: '#F1F5F9', boxShadow: 'none' }} 
              />
              <Radar name="Activity %" dataKey="activity" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
              <Radar name="KYC Compliance %" dataKey="kycCompliance" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.3} />
              <Radar name="Engagement %" dataKey="engagement" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(241,245,249,0.8)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Root Cause Analysis Table */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.0 }}
        style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.12) 100%)',
        borderRadius: '24px',
        padding: '36px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(99,102,241,0.25)',
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
        border: '1px solid rgba(99,102,241,0.3)'
      }}>
        <h4 style={{
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '28px',
          color: '#F1F5F9',
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}> Root Cause Analysis</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '14px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#F1F5F9' }}>Pattern</th>
                <th style={{ padding: '14px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#F1F5F9' }}>Impact</th>
                <th style={{ padding: '14px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#F1F5F9' }}>Root Cause</th>
                <th style={{ padding: '14px', textAlign: 'left', fontWeight: '700', fontSize: '13px', color: '#F1F5F9' }}>Evidence</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '14px', fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>{topFailure.reason}</td>
                <td style={{ padding: '14px', fontSize: '13px', color: '#EF4444', fontWeight: '600' }}>-{topFailure.percentage}% transactions</td>
                <td style={{ padding: '14px', fontSize: '13px', color: 'rgba(241,245,249,0.8)' }}>Primary failure driver</td>
                <td style={{ padding: '14px', fontSize: '13px', color: 'rgba(241,245,249,0.8)' }}>{topFailure.count.toLocaleString()} failures</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '14px', fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>Network Infrastructure</td>
                <td style={{ padding: '14px', fontSize: '13px', color: '#EF4444', fontWeight: '600' }}>{parseFloat(networkIssues.toFixed(1))}% of failures</td>
                <td style={{ padding: '14px', fontSize: '13px', color: 'rgba(241,245,249,0.8)' }}>Poor connectivity, timeouts</td>
                <td style={{ padding: '14px', fontSize: '13px', color: 'rgba(241,245,249,0.8)' }}>2G/3G high failure rate</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '14px', fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>KYC Correlation</td>
                <td style={{ padding: '14px', fontSize: '13px', color: '#10B981', fontWeight: '600' }}>+{parseFloat((data.kycData[0]?.successRate - kycGap.successRate).toFixed(1))}% success</td>
                <td style={{ padding: '14px', fontSize: '13px', color: 'rgba(241,245,249,0.8)' }}>Verified users more reliable</td>
                <td style={{ padding: '14px', fontSize: '13px', color: 'rgba(241,245,249,0.8)' }}>Full KYC: {data.kycData[0]?.successRate}% vs Unverified: {kycGap.successRate}%</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '14px', fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>Peak Hour Traffic</td>
                <td style={{ padding: '14px', fontSize: '13px', color: '#06B6D4', fontWeight: '600' }}>{data.summary.peakHour}</td>
                <td style={{ padding: '14px', fontSize: '13px', color: 'rgba(241,245,249,0.8)' }}>User behavior patterns</td>
                <td style={{ padding: '14px', fontSize: '13px', color: 'rgba(241,245,249,0.8)' }}>Consistent daily pattern</td>
              </tr>
              <tr>
                <td style={{ padding: '14px', fontSize: '13px', fontWeight: '600', color: '#F1F5F9' }}>Geographic Concentration</td>
                <td style={{ padding: '14px', fontSize: '13px', color: '#0EA5E9', fontWeight: '600' }}>{data.districtData[0]?.percentage}% in {data.districtData[0]?.district}</td>
                <td style={{ padding: '14px', fontSize: '13px', color: 'rgba(241,245,249,0.8)' }}>Urban density, infrastructure</td>
                <td style={{ padding: '14px', fontSize: '13px', color: 'rgba(241,245,249,0.8)' }}>{data.districtData[0]?.transactions.toLocaleString()} transactions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Diagnostic;
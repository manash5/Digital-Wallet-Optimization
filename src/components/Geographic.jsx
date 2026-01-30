import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Geographic = ({ data, colors }) => {
  // Calculate district-level detailed metrics from real data
  const districtMetrics = useMemo(() => {
    if (!data || !data.districtData) return [];
    
    return data.districtData.map(district => {
      // Get wallet distribution for this district (simulate from overall wallet share)
      const topWallet = data.walletShare && data.walletShare.length > 0 
        ? data.walletShare[0].wallet 
        : 'eSewa';
      
      // Calculate average transaction for district from real data
      const avgTransaction = district.volume / district.transactions;
      
      return {
        ...district,
        avgTransaction: avgTransaction,
        topWallet: topWallet,
        volumeInMillions: parseFloat((district.volume / 1000000).toFixed(2))
      };
    });
  }, [data]);

  // Prepare horizontal bar chart data (like crime rate by borough)
  const transactionVolumeData = useMemo(() => {
    return districtMetrics.map(d => ({
      district: d.district,
      transactions: d.transactions,
      percentage: d.percentage
    })).sort((a, b) => b.transactions - a.transactions);
  }, [districtMetrics]);

  // Prepare grouped bar chart data (like borough crime comparison)
  const districtComparisonData = useMemo(() => {
    return districtMetrics.map(d => ({
      district: d.district,
      'Avg Transaction': parseFloat((d.avgTransaction / 1000).toFixed(1)), // in thousands
      'Success Rate': d.successRate,
      'Market Share': d.percentage
    }));
  }, [districtMetrics]);

  // Calculate insights from real data
  const insights = useMemo(() => {
    if (districtMetrics.length === 0) return {
      kathmandu: { percentage: 0, volume: 0, transactions: 0 },
      lalitpur: { percentage: 0, volume: 0, transactions: 0 },
      bhaktapur: { percentage: 0, volume: 0, transactions: 0 }
    };

    const kathmandu = districtMetrics.find(d => d.district === 'Kathmandu') || {};
    const lalitpur = districtMetrics.find(d => d.district === 'Lalitpur') || {};
    const bhaktapur = districtMetrics.find(d => d.district === 'Bhaktapur') || {};

    return {
      kathmandu: {
        percentage: kathmandu.percentage || 0,
        volume: kathmandu.volumeInMillions || 0,
        transactions: kathmandu.transactions || 0
      },
      lalitpur: {
        percentage: lalitpur.percentage || 0,
        volume: lalitpur.volumeInMillions || 0,
        transactions: lalitpur.transactions || 0
      },
      bhaktapur: {
        percentage: bhaktapur.percentage || 0,
        volume: bhaktapur.volumeInMillions || 0,
        transactions: bhaktapur.transactions || 0
      }
    };
  }, [districtMetrics]);

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
          background: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>Geographic Analysis</span>
      </motion.h3>
      <p style={{ fontSize: '16px', color: 'rgba(241,245,249,0.7)', marginBottom: '32px' }}>
        Spatial distribution across Kathmandu Valley districts - {data?.summary?.totalTransactions?.toLocaleString() || '500,000'} real transactions analyzed
      </p>

      {/* District Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        marginBottom: '48px'
      }}>
        {districtMetrics.map((district, index) => (
          <motion.div 
            key={district.district} 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            style={{
              background: index === 0 ? 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.12) 100%)' :
                         index === 1 ? 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(8,145,178,0.12) 100%)' :
                         'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.12) 100%)',
              backdropFilter: 'blur(20px) saturate(150%)',
              WebkitBackdropFilter: 'blur(20px) saturate(150%)',
              border: index === 0 ? '1px solid rgba(16,185,129,0.3)' :
                      index === 1 ? '1px solid rgba(6,182,212,0.3)' :
                      '1px solid rgba(245,158,11,0.3)',
              padding: '32px',
              borderRadius: '24px',
              color: '#F1F5F9',
              textAlign: 'center',
              boxShadow: index === 0 ? '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(16,185,129,0.25)' :
                         index === 1 ? '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(6,182,212,0.25)' :
                         '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(245,158,11,0.25)'
            }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', lineHeight: '1' }}>
              <span style={{ fontSize: '40px' }}>
                {index === 0 ? '🏛️' : index === 1 ? '🏙️' : '🏘️'}
              </span>
            </div>
            <h4 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#F1F5F9' }}>
              {district.district}
            </h4>
            <div style={{ 
              fontSize: '36px', 
              fontWeight: '700', 
              marginBottom: '8px',
              color: index === 0 ? '#10B981' : index === 1 ? '#06B6D4' : '#F59E0B'
            }}>
              {district.transactions.toLocaleString()}
            </div>
            <div style={{ fontSize: '16px', color: 'rgba(241,245,249,0.8)', marginBottom: '16px' }}>
              transactions
            </div>
            <div style={{
              padding: '8px 16px',
              background: index === 0 ? 'rgba(16,185,129,0.2)' :
                          index === 1 ? 'rgba(6,182,212,0.2)' :
                          'rgba(245,158,11,0.2)',
              borderRadius: '20px',
              display: 'inline-block',
              color: index === 0 ? '#10B981' : index === 1 ? '#06B6D4' : '#F59E0B',
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              {district.percentage}% of total
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(241,245,249,0.7)' }}>
              NPR {district.volumeInMillions.toFixed(1)}M volume
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(241,245,249,0.7)', marginTop: '4px' }}>
              {district.successRate}% success rate
            </div>
          </motion.div>
        ))}
      </div>

      {/* Transaction Volume by District (Horizontal Bar Chart) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(37,99,235,0.12) 100%)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(59,130,246,0.25)',
          marginBottom: '48px'
        }}>
        <h4 style={{
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '24px',
          color: '#F1F5F9'
        }}>TRANSACTION VOLUME BY DISTRICT</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={transactionVolumeData} 
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(241,245,249,0.1)" />
            <XAxis 
              type="number" 
              tick={{ fontSize: 12, fill: '#F1F5F9' }} 
              stroke="rgba(241,245,249,0.3)" 
            />
            <YAxis 
              type="category" 
              dataKey="district" 
              tick={{ fontSize: 14, fill: '#F1F5F9' }} 
              stroke="rgba(241,245,249,0.3)" 
              width={90}
            />
            <Bar 
              dataKey="transactions" 
              fill="#3B82F6" 
              name="Transactions" 
              radius={[0, 8, 8, 0]}
              label={{ position: 'right', fill: '#F1F5F9', fontSize: 12 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* District Comparison (Grouped Bar Chart) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        style={{
          background: 'linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(236,72,153,0.12) 100%)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(168,85,247,0.3)',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(168,85,247,0.25)',
          marginBottom: '48px'
        }}>
        <h4 style={{
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '24px',
          color: '#F1F5F9'
        }}>DISTRICT PERFORMANCE COMPARISON</h4>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={districtComparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(241,245,249,0.1)" />
            <XAxis 
              dataKey="district" 
              tick={{ fontSize: 14, fill: '#F1F5F9' }} 
              stroke="rgba(241,245,249,0.3)" 
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#F1F5F9' }} 
              stroke="rgba(241,245,249,0.3)" 
            />
            <Legend wrapperStyle={{ color: '#F1F5F9' }} />
            <Bar dataKey="Market Share" fill="#EF4444" name="Market Share %" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Success Rate" fill="#F59E0B" name="Success Rate %" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Avg Transaction" fill="#3B82F6" name="Avg Transaction (NPR K)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Localized Insights - Unfair Advantage */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(109,40,217,0.12) 100%)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(168,85,247,0.3)',
          padding: '36px',
          borderRadius: '24px',
          marginBottom: '48px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(168,85,247,0.25)',
          color: '#F1F5F9'
        }}>
        <h4 style={{
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '16px',
          color: '#F1F5F9'
        }}> Localized Insights: Our Unfair Advantage</h4>
        <p style={{ fontSize: '14px', color: 'rgba(241,245,249,0.9)', marginBottom: '24px', lineHeight: '1.6' }}>
          Our analytics engine is trained on {data?.summary?.totalTransactions?.toLocaleString() || '500,000'}+ Kathmandu Valley transactions, 
          providing hyper-relevant patterns and predictions that generic international tools cannot replicate.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            background: 'rgba(168,85,247,0.15)',
            padding: '20px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(168,85,247,0.3)'
          }}>
            <div style={{ fontSize: '14px', color: 'rgba(241,245,249,0.9)', marginBottom: '8px' }}>Kathmandu Dominance</div>
            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#A855F7' }}>
              {insights.kathmandu.percentage.toFixed(1)}%
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(241,245,249,0.8)' }}>
              {insights.kathmandu.transactions.toLocaleString()} transactions (NPR {insights.kathmandu.volume.toFixed(0)}M)
            </div>
          </div>
          
          <div style={{
            background: 'rgba(6,182,212,0.15)',
            padding: '20px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(6,182,212,0.3)'
          }}>
            <div style={{ fontSize: '14px', color: 'rgba(241,245,249,0.9)', marginBottom: '8px' }}>Lalitpur Growth</div>
            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#06B6D4' }}>
              {insights.lalitpur.percentage.toFixed(1)}%
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(241,245,249,0.8)' }}>
              {insights.lalitpur.transactions.toLocaleString()} transactions (NPR {insights.lalitpur.volume.toFixed(0)}M)
            </div>
          </div>
          
          <div style={{
            background: 'rgba(245,158,11,0.15)',
            padding: '20px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(245,158,11,0.3)'
          }}>
            <div style={{ fontSize: '14px', color: 'rgba(241,245,249,0.9)', marginBottom: '8px' }}>Bhaktapur Opportunity</div>
            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#F59E0B' }}>
              {insights.bhaktapur.percentage.toFixed(1)}%
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(241,245,249,0.8)' }}>
              {insights.bhaktapur.transactions.toLocaleString()} transactions (NPR {insights.bhaktapur.volume.toFixed(0)}M)
            </div>
          </div>
        </div>
      </motion.div>

      {/* Location-Based Strategic Insights */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.12) 100%)',
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
        }}> Location-Based Strategic Insights</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          <div style={{
            padding: '24px',
            background: 'rgba(16,185,129,0.1)',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px', lineHeight: '1' }}><span style={{ fontSize: '28px' }}>🏙️</span></div>
            <h5 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#F1F5F9' }}>
              Urban Concentration Strategy
            </h5>
            <p style={{ fontSize: '14px', color: 'rgba(241,245,249,0.8)', marginBottom: '16px', lineHeight: '1.6' }}>
              Kathmandu district dominates with {insights.kathmandu.percentage.toFixed(1)}% of all transactions 
              ({insights.kathmandu.transactions.toLocaleString()} transactions), driven by high population density, 
              commercial centers, and better digital infrastructure.
            </p>
            <div style={{
              padding: '12px',
              background: 'rgba(16,185,129,0.15)',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#10B981',
              fontWeight: '600'
            }}>
              💡 Solution: Deploy high-capacity infrastructure and premium analytics for urban hotspots
            </div>
          </div>
          
          <div style={{
            padding: '24px',
            background: 'rgba(6,182,212,0.1)',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px', lineHeight: '1' }}><span style={{ fontSize: '28px' }}>📈</span></div>
            <h5 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#F1F5F9' }}>
              Suburban Growth Opportunity
            </h5>
            <p style={{ fontSize: '14px', color: 'rgba(241,245,249,0.8)', marginBottom: '16px', lineHeight: '1.6' }}>
              Lalitpur ({insights.lalitpur.percentage.toFixed(1)}%, {insights.lalitpur.transactions.toLocaleString()} transactions) 
              and Bhaktapur ({insights.bhaktapur.percentage.toFixed(1)}%, {insights.bhaktapur.transactions.toLocaleString()} transactions) 
              show untapped potential with growing tech-savvy populations.
            </p>
            <div style={{
              padding: '12px',
              background: 'rgba(6,182,212,0.2)',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#06B6D4',
              fontWeight: '600'
            }}>
              💡 Solution: Merchant onboarding campaigns with predictive location analytics
            </div>
          </div>
          
          <div style={{
            padding: '24px',
            background: 'rgba(245,158,11,0.1)',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px', lineHeight: '1' }}><span style={{ fontSize: '28px' }}>🎯</span></div>
            <h5 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#F1F5F9' }}>
              First-Mover Advantage
            </h5>
            <p style={{ fontSize: '14px', color: 'rgba(241,245,249,0.8)', marginBottom: '16px', lineHeight: '1.6' }}>
              We are the first analytics platform specifically oriented towards Nepal's regulatory and 
              cultural fintech environment. Total volume: NPR {((insights.kathmandu.volume + insights.lalitpur.volume + insights.bhaktapur.volume) / 1000).toFixed(2)}B.
            </p>
            <div style={{
              padding: '12px',
              background: 'rgba(245,158,11,0.2)',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#F59E0B',
              fontWeight: '600'
            }}>
              💡 Solution: Leverage local market knowledge for balanced ecosystem growth
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Geographic;
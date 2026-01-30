import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import Particles from '@tsparticles/react';

import DiagnosticAnalytics from '../components/Diagnositc';
import PredictiveAnalytics from '../components/Predictive';
import PrescriptiveAnalytics from '../components/Prescriptive';
import GeographicAnalysis from '../components/Geographic';
import TemporalAnalysis from '../components/Temporal';
import ModelOverview from '../components/model';
import { loadAllData, processDashboardData } from '../utils/csvLoader';

const Mainpage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load CSV data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const rawData = await loadAllData();
        const processedData = processDashboardData(rawData);
        setData(processedData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load CSV data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  const COLORS = {
    primary: '#0EA5E9',
    secondary: '#1E3A8A',
    accent: '#EC4899',
    danger: '#FF6B6B',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#06B6D4',
    dark: '#0F0B1F',
    darkBlue: '#0D1B3A',
    darkPurple: '#1E1145',
    light: '#F8FAFC',
    textLight: '#F1F5F9',
    textMuted: 'rgba(241,245,249,0.6)',
    glassWhite: 'rgba(255,255,255,0.08)',
    glassBorder: 'rgba(255,255,255,0.12)'
  };

  // Vibrant color palette for charts
  const chartColors = ['#0EA5E9', '#EC4899', '#A855F7', '#F59E0B', '#10B981', '#06B6D4', '#FF6B6B', '#FBBF24', '#14B8A6', '#F97316'];

  const tabs = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'diagnostic', icon: '🔍', label: 'Diagnostic' },
    { id: 'predictive', icon: '🔮', label: 'Predictive' },
    { id: 'prescriptive', icon: '💡', label: 'Prescriptive' },
    { id: 'geographic', icon: '🗺️', label: 'Geographic' },
    { id: 'temporal', icon: '⏰', label: 'Temporal' },
    { id: 'model-overview', icon: '🧩', label: 'Model Overview' }
  ];

  const activeTabLabel = tabs.find(tab => tab.id === activeTab)?.label || 'Overview';

  const StatCard = ({ title, value, subtitle, change, icon, color }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.02 }}
      style={{
      background: 'linear-gradient(135deg, rgba(14,165,233,0.2) 0%, rgba(236,72,153,0.1) 100%)',
      backdropFilter: 'blur(20px) saturate(150%)',
      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
      borderRadius: '20px',
      padding: '28px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(14,165,233,0.25)',
      border: '1px solid rgba(14,165,233,0.3)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer'
    }}>
      <div style={{
        position: 'absolute',
        top: '-30px',
        right: '-30px',
        fontSize: '140px',
        opacity: '0.03',
        transform: 'rotate(-15deg)',
        filter: 'blur(2px)'
      }}>{icon}</div>
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 50% 0%, ${color || COLORS.primary}15 0%, transparent 60%)`,
        pointerEvents: 'none'
      }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: '12px',
          fontWeight: '600',
          color: COLORS.textMuted,
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '1.5px'
        }}>{title}</div>
        <div style={{
          fontSize: '36px',
          fontWeight: '700',
          color: COLORS.textLight,
          marginBottom: '8px',
          fontFamily: '"Poppins", sans-serif',
          background: `linear-gradient(135deg, ${COLORS.textLight}, ${color || COLORS.accent})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>{value}</div>
        <div style={{
          fontSize: '14px',
          color: COLORS.textMuted,
          marginBottom: '12px'
        }}>{subtitle}</div>
        {change && (
          <div style={{
            display: 'inline-block',
            padding: '6px 14px',
            borderRadius: '20px',
            background: change.startsWith('+') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: change.startsWith('+') ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            color: change.startsWith('+') ? '#34D399' : '#F87171',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            {change}
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderOverview = () => (
    <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
        background: 'linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(236,72,153,0.12) 50%, rgba(168,85,247,0.08) 100%)',
        padding: '60px 40px',
        borderRadius: '24px',
        marginBottom: '40px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(14,165,233,0.2) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(236,72,153,0.15) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '20px',
            border: '1px solid rgba(255,255,255,0.18)'
          }}>✨ Smart Analytics Engine for Digital Payments</motion.div>
          
          <h2 style={{
            fontSize: '48px',
            fontWeight: '800',
            marginBottom: '20px',
            fontFamily: '"Poppins", sans-serif',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E7FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Nepal Digital Wallet Analytics</h2>
          
          <p style={{
            fontSize: '19px',
            opacity: 0.9,
            fontWeight: '400',
            maxWidth: '850px',
            marginBottom: '12px',
            lineHeight: '1.6'
          }}>
            Predictive Analytics Platform for Transaction Success, Fraud Prevention & Engagement Optimization
          </p>
          
          <p style={{
            fontSize: '15px',
            opacity: 0.7,
            fontWeight: '400',
            maxWidth: '850px'
          }}>
            Kathmandu Valley Payment Ecosystem · 500K Transactions · NPR 4.61B Volume · 2022-2024
          </p>
          
          {/* Key Business Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '40px'
          }}>
            {[
              { label: 'Total Transactions', value: data.summary.totalTransactions.toLocaleString(), color: '#0369A1', icon: '📊', gradient: 'rgba(3,105,161,0.2)', bgGradient: 'linear-gradient(135deg, #0369A1 0%, #0284C7 100%)' },
              { label: 'Transaction Volume', value: `NPR ${(data.summary.totalVolume / 1000000000).toFixed(2)}B`, color: '#B45309', icon: '💰', gradient: 'rgba(180,83,9,0.15)', bgGradient: 'linear-gradient(135deg, #B45309 0%, #D97706 100%)' },
              { label: 'Active Users', value: data.summary.totalUsers.toLocaleString(), color: '#6D28D9', icon: '👥', gradient: 'rgba(109,40,217,0.15)', bgGradient: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)' },
              { label: 'Success Rate', value: `${data.summary.successRate}%`, color: '#047857', icon: '✓', gradient: 'rgba(4,120,87,0.15)', bgGradient: 'linear-gradient(135deg, #047857 0%, #059669 100%)' }
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.12, duration: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.05, y: -4 }}
                style={{
                padding: '24px',
                background: metric.bgGradient,
                borderRadius: '16px',
                backdropFilter: 'blur(12px)',
                border: `1.5px solid ${metric.color}60`,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at 100% 0%, ${metric.color}08 0%, transparent 60%)`,
                  pointerEvents: 'none'
                }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{metric.icon}</div>
                  <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#FFFFFF' }}>{metric.label}</div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF' }}>
                    {metric.value}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Core Business Value Propositions */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        style={{
        background: 'linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(236,72,153,0.08) 100%)',
        padding: '40px',
        borderRadius: '24px',
        marginBottom: '48px',
        color: 'white',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.08)'
      }}>
        <h3 style={{
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '32px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #0EA5E9 0%, #EC4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>⚡ Core Capability Pillars</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {[
            { icon: '🔐', title: 'Risk Prediction Engine', desc: 'Identify high-risk payments before they fail using network type, device, time, and user history patterns', target: 'Reduce failures by 15%+' },
            { icon: '🛡️', title: 'Fraud Detection System', desc: 'Build user spending baselines to detect suspicious transactions with minimal false positives', target: '90%+ detection, <5% false positives' },
            { icon: '💡', title: 'Smart Engagement Platform', desc: 'Optimize cashback and rewards based on user segmentation and spending history', target: '200%+ ROI on rewards' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.12, duration: 0.7, ease: "easeOut" }}
              whileHover={{ scale: 1.03, y: -5 }}
              style={{
              background: 'rgba(30,58,138,0.2)',
              padding: '28px',
              borderRadius: '20px',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.15)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '52px', marginBottom: '16px' }}>{item.icon}</div>
              <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '14px' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '15px', opacity: 0.9, marginBottom: '18px', lineHeight: '1.7' }}>
                {item.desc}
              </p>
              <div style={{
                padding: '10px 16px',
                background: 'rgba(30,58,138,0.2)',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid rgba(59,130,246,0.3)'
              }}>
                Target: {item.target}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <h3 style={{
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '24px',
        color: COLORS.textLight,
        fontFamily: '"Poppins", sans-serif'
      }}> Descriptive Analytics Overview </h3>
      <p style={{ fontSize: '16px', color: COLORS.textMuted, marginBottom: '32px' }}>
        What happened? Transaction patterns across Kathmandu Valley 2022-2024
      </p>

      {/* Key Performance Indicators */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '48px'
      }}>
        <StatCard
          title="Success Rate"
          value={`${data.summary.successRate}%`}
          subtitle="Current performance"
          change="+2.1% vs 2022"
          icon="✅"
          color={COLORS.success}
        />
        <StatCard
          title="Failed Transactions"
          value={data.summary.failedTransactions.toLocaleString()}
          subtitle="Revenue opportunity"
          change="11.72% of total"
          icon="⚠️"
          color={COLORS.danger}
        />
        <StatCard
          title="Avg Transaction"
          value={`NPR ${data.summary.avgTransaction.toLocaleString()}`}
          subtitle="Per transaction value"
          change="+5.3% YoY"
          icon="💰"
          color={COLORS.primary}
        />
        <StatCard
          title="Peak Hour"
          value={data.summary.peakHour}
          subtitle="Highest activity period"
          icon="⏰"
          color={COLORS.accent}
        />
      </div>

      {/* Market Overview Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '28px',
        marginBottom: '48px'
      }}>
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
          background: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(14,165,233,0.15) 100%)',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(168,85,247,0.3)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(168,85,247,0.3)'
        }}>
          <h4 style={{
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '28px',
            color: COLORS.textLight,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #A855F7 0%, #0EA5E9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Digital Wallet Market Share</span>
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.walletShare}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
                stroke="none"
              >
                {data.walletShare.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                wrapperStyle={{ outline: 'none', backgroundColor: 'transparent' }}
                contentStyle={{
                  background: 'rgba(6, 22, 49, 0.98)',
                  border: 'none',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  color: '#F1F5F9',
                  boxShadow: 'none'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
          background: 'linear-gradient(135deg, rgba(14,165,233,0.2) 0%, rgba(236,72,153,0.1) 100%)',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(14,165,233,0.25)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(14,165,233,0.3)'
        }}>
          <h4 style={{
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '28px',
            color: COLORS.textLight,
            background: 'linear-gradient(135deg, #0EA5E9 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Transaction Categories Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.categoryData.slice(0, 6)} cursor="default">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="category" tick={{ fontSize: 12, fill: COLORS.textMuted }} />
              <YAxis tick={{ fontSize: 12, fill: COLORS.textMuted }} />
              <Tooltip 
                wrapperStyle={{ outline: 'none', backgroundColor: 'transparent' }}
                contentStyle={{
                  background: 'rgba(6, 22, 49, 0.98)',
                  border: 'none',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  color: '#F1F5F9',
                  boxShadow: 'none'
                }}
                cursor={{ fill: 'transparent', stroke: 'transparent' }}
              />
              <Bar 
                dataKey="percentage" 
                radius={[8, 8, 0, 0]}
                animationBegin={0}
                animationDuration={1000}
                isAnimationActive={true}
              >
                {data.categoryData.slice(0, 6).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Transaction Trend */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(14,165,233,0.12) 100%)',
        borderRadius: '24px',
        padding: '36px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(245,158,11,0.25)',
        marginBottom: '48px',
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
        border: '1px solid rgba(245,158,11,0.3)'
      }}>
        <h4 style={{
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '28px',
          color: COLORS.textLight,
          background: 'linear-gradient(135deg, #F59E0B 0%, #0EA5E9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}> Transaction Volume Trend (2022-2024)</h4>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data.monthlyTrend}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: COLORS.textMuted }} angle={-45} textAnchor="end" height={80} />
            <YAxis tick={{ fontSize: 12, fill: COLORS.textMuted }} />
            <Tooltip 
              wrapperStyle={{ outline: 'none', backgroundColor: 'transparent' }}
              contentStyle={{
                background: 'rgba(6, 22, 49, 0.98)',
                border: 'none',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                color: '#F1F5F9',
                boxShadow: 'none'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="transactions" 
              stroke={COLORS.primary} 
              fillOpacity={1} 
              fill="url(#colorVolume)"
              animationBegin={0}
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* User Segments & Districts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '28px'
      }}>
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
          background: 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(14,165,233,0.12) 100%)',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(236,72,153,0.25)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(236,72,153,0.3)'
        }}>
          <h4 style={{
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '28px',
            color: COLORS.textLight,
            background: 'linear-gradient(135deg, #EC4899 0%, #0EA5E9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}> User Segments (Target Customers)</h4>
          {data.userSegments.slice(0, 5).map((segment, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.12, duration: 0.6, ease: "easeOut" }}
              style={{ marginBottom: '20px' }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '15px',
                fontWeight: '600',
                color: COLORS.textLight
              }}>
                <span>{segment.segment}</span>
                <span>{segment.percentage}%</span>
              </div>
              <div style={{
                height: '10px',
                background: 'rgba(30,58,138,0.3)',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${segment.percentage}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${chartColors[index % chartColors.length]}, ${chartColors[(index + 1) % chartColors.length]})`,
                  borderRadius: '6px'
                }}></motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(15,184,212,0.15) 100%)',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(16,185,129,0.25)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          border: '1px solid rgba(16,185,129,0.3)'
        }}>
          <h4 style={{
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '28px',
            color: COLORS.textLight,
            background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Geographic Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.districtData} layout="vertical" cursor="default">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" tick={{ fontSize: 12, fill: COLORS.textMuted }} />
              <YAxis dataKey="district" type="category" tick={{ fontSize: 12, fill: COLORS.textMuted }} />
              <Tooltip 
                wrapperStyle={{ outline: 'none', backgroundColor: 'transparent' }}
                contentStyle={{
                  background: 'rgba(6, 22, 49, 0.98)',
                  border: 'none',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  color: '#F1F5F9',
                  boxShadow: 'none'
                }}
                cursor={{ fill: 'transparent', stroke: 'transparent' }}
              />
              {data.districtData.map((item, index) => (
                <Bar 
                  key={`geo-bar-${index}`}
                  dataKey="transactions"
                  fill={chartColors[index % chartColors.length]}
                  radius={[0, 8, 8, 0]}
                  animationBegin={0}
                  animationDuration={1000}
                  isAnimationActive={true}
                  data={[item]}
                  activeBar={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top left, rgba(14,165,233,0.25) 0%, transparent 40%), radial-gradient(ellipse at bottom right, rgba(236,72,153,0.15) 0%, transparent 50%), radial-gradient(ellipse at center, rgba(168,85,247,0.1) 0%, transparent 60%), linear-gradient(180deg, #061631 0%, #0d1b3a 40%, #0a2540 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Inter", sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '4px solid rgba(14,165,233,0.3)',
            borderTop: '4px solid #0EA5E9',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }}></div>
          <div style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#F1F5F9',
            marginBottom: '12px'
          }}>Loading Dashboard Data...</div>
          <div style={{
            fontSize: '14px',
            color: 'rgba(241,245,249,0.6)'
          }}>Processing CSV files</div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top left, rgba(14,165,233,0.25) 0%, transparent 40%), radial-gradient(ellipse at bottom right, rgba(236,72,153,0.15) 0%, transparent 50%), radial-gradient(ellipse at center, rgba(168,85,247,0.1) 0%, transparent 60%), linear-gradient(180deg, #061631 0%, #0d1b3a 40%, #0a2540 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Inter", sans-serif',
        padding: '40px'
      }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px'
          }}>⚠️</div>
          <div style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#F1F5F9',
            marginBottom: '12px'
          }}>Failed to Load Data</div>
          <div style={{
            fontSize: '14px',
            color: 'rgba(241,245,249,0.6)',
            marginBottom: '8px'
          }}>{error}</div>
          <div style={{
            fontSize: '12px',
            color: 'rgba(241,245,249,0.5)'
          }}>Please check that the CSV files are in the correct location</div>
        </div>
      </div>
    );
  }

  // Data not loaded yet
  if (!data) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top left, rgba(14,165,233,0.25) 0%, transparent 40%), radial-gradient(ellipse at bottom right, rgba(236,72,153,0.15) 0%, transparent 50%), radial-gradient(ellipse at center, rgba(168,85,247,0.1) 0%, transparent 60%), linear-gradient(180deg, #061631 0%, #0d1b3a 40%, #0a2540 100%)',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@700;800;900&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          overflow-x: hidden;
          background: #0F0B1F;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(15, 11, 31, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.7);
        }
      `}</style>

      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: 'transparent' } },
          fpsLimit: 60,
          particles: {
            color: { value: ['#0EA5E9', '#EC4899', '#A855F7', '#F59E0B', '#06B6D4'] },
            links: {
              color: '#0EA5E9',
              distance: 150,
              enable: true,
              opacity: 0.15,
              width: 1
            },
            move: {
              enable: true,
              speed: 0.8,
              direction: 'none',
              random: true,
              straight: false,
              outModes: { default: 'bounce' }
            },
            number: { 
              value: 80, 
              density: { enable: true, area: 800 } 
            },
            opacity: { 
              value: { min: 0.1, max: 0.4 },
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1
              }
            },
            shape: { type: 'circle' },
            size: { 
              value: { min: 1, max: 4 },
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0.5
              }
            }
          },
          detectRetina: true
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Sticky Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(15, 11, 31, 0.85)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: scrollY > 50 ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              fontSize: '32px'
            }}>💰</div>
            <div>
              <h1 style={{
                fontSize: '22px',
                fontWeight: '800',
                color: COLORS.textLight,
                marginBottom: '2px',
                fontFamily: '"Poppins", sans-serif'
              }}>Smart Analytics Engine</h1>
              <p style={{
                fontSize: '13px',
                color: COLORS.textMuted,
                fontWeight: '500'
              }}>Digital Payment Optimization Platform</p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.18)',
                background: 'rgba(255,255,255,0.08)',
                color: COLORS.textLight,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              }}
              aria-label="Open navigation"
              title="Open navigation"
            >
              <div style={{ display: 'grid', gap: '6px' }}>
                <span style={{ width: '26px', height: '4px', borderRadius: '999px', background: 'rgba(241,245,249,0.75)' }} />
                <span style={{ width: '26px', height: '4px', borderRadius: '999px', background: 'rgba(241,245,249,0.75)' }} />
                <span style={{ width: '26px', height: '4px', borderRadius: '999px', background: 'rgba(241,245,249,0.75)' }} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.35)',
          opacity: isSidebarOpen ? 1 : 0,
          pointerEvents: isSidebarOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
          zIndex: 200
        }}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: '300px',
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          zIndex: 210,
          background: 'linear-gradient(135deg, rgba(15, 11, 31, 0.85) 0%, rgba(30, 17, 69, 0.75) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderLeft: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 20px 10px 20px'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: COLORS.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '1.2px'
          }}>Navigation</div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: COLORS.textLight,
              fontSize: '22px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{
          padding: '0 20px 16px 20px',
          color: COLORS.textLight,
          fontSize: '14px',
          opacity: 0.8
        }}>
          Current tab: <span style={{ fontWeight: '700', opacity: 1 }}>{activeTabLabel}</span>
        </div>

        <div style={{ padding: '0 12px 24px 12px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsSidebarOpen(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: '10px',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, rgba(14,165,233,0.4) 0%, rgba(236,72,153,0.35) 100%)'
                  : 'rgba(255,255,255,0.04)',
                color: COLORS.textLight,
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '700' : '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: activeTab === tab.id ? '0 8px 20px rgba(14,165,233,0.35)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '48px 32px',
        position: 'relative',
        zIndex: 1
      }}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'diagnostic' && <DiagnosticAnalytics data={data} colors={COLORS} />} 
        {activeTab === 'predictive' && <PredictiveAnalytics data={data} colors={COLORS} />}
        {activeTab === 'prescriptive' && <PrescriptiveAnalytics data={data} colors={COLORS} />}
        {activeTab === 'geographic' && <GeographicAnalysis data={data} colors={COLORS} />}
        {activeTab === 'temporal' && <TemporalAnalysis data={data} colors={COLORS} />}
        {activeTab === 'model-overview' && <ModelOverview data={data} colors={COLORS} />}
      </div>

      {/* Footer */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,11,31,0.8) 0%, rgba(30,17,69,0.8) 100%)',
        color: 'white',
        padding: '48px 32px',
        marginTop: '64px',
        position: 'relative',
        zIndex: 1,
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '16px'
          }}>Smart Analytics Engine for Digital Payments</h3>
          <p style={{
            fontSize: '16px',
            opacity: 0.8,
            marginBottom: '24px'
          }}>
            Predictive Failure Analytics · Behavioral Anomaly Detection · Personalized Incentive Optimization
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            flexWrap: 'wrap',
            fontSize: '14px',
            opacity: 0.7
          }}>
            <div>500K Transactions</div>
            <div>•</div>
            <div>NPR 4.61B Volume</div>
            <div>•</div>
            <div>75K Users</div>
            <div>•</div>
            <div>2022-2024 Data</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mainpage;
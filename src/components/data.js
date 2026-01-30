// data.js - Centralized data generation for the dashboard

export const generateDashboardData = () => {
  const totalTransactions = 500000;
  const totalUsers = 75000;
  const totalVolume = 4613257350; // NPR 4.61 Billion
  const avgTransaction = 10451;
  const successRate = 88.28;
  
  return {
    summary: {
      totalTransactions,
      totalUsers,
      totalVolume,
      avgTransaction,
      successRate,
      failedTransactions: 58586,
      avgMonthly: 13889,
      peakHour: '14:00'
    },
    
    // Wallet market share data
    walletShare: [
      { name: 'eSewa', value: 35.1, transactions: 175500, color: '#00A76F' },
      { name: 'Khalti', value: 24.8, transactions: 124000, color: '#5F2EEA' },
      { name: 'IME Pay', value: 15.0, transactions: 75000, color: '#FF3D00' },
      { name: 'ConnectIPS', value: 10.1, transactions: 50500, color: '#1976D2' },
      { name: 'Prabhu Pay', value: 5.0, transactions: 25000, color: '#FF9800' },
      { name: 'Others', value: 10.0, transactions: 50000, color: '#9E9E9E' }
    ],
    
    // Category distribution
    categoryData: [
      { category: 'Utility', percentage: 36.1, amount: 1665000000 },
      { category: 'Transfer', percentage: 18.1, amount: 834800000 },
      { category: 'Shopping', percentage: 12.3, amount: 567400000 },
      { category: 'Merchant', percentage: 8.1, amount: 373700000 },
      { category: 'Load', percentage: 4.9, amount: 226000000 },
      { category: 'Withdrawal', percentage: 4.1, amount: 189100000 },
      { category: 'Financial', percentage: 4.1, amount: 189100000 },
      { category: 'Government', percentage: 3.3, amount: 152200000 },
      { category: 'Food', percentage: 3.3, amount: 152200000 },
      { category: 'Others', percentage: 5.7, amount: 263000000 }
    ],
    
    // Monthly trend data
    monthlyTrend: [
      { month: 'Jan 2022', transactions: 13200, volume: 138000000, successRate: 87.5 },
      { month: 'Feb 2022', transactions: 12800, volume: 134000000, successRate: 87.8 },
      { month: 'Mar 2022', transactions: 14100, volume: 147000000, successRate: 88.1 },
      { month: 'Apr 2022', transactions: 14800, volume: 155000000, successRate: 88.3 },
      { month: 'May 2022', transactions: 15200, volume: 159000000, successRate: 88.5 },
      { month: 'Jun 2022', transactions: 14600, volume: 153000000, successRate: 88.2 },
      { month: 'Jul 2022', transactions: 15100, volume: 158000000, successRate: 88.4 },
      { month: 'Aug 2022', transactions: 14900, volume: 156000000, successRate: 88.3 },
      { month: 'Sep 2022', transactions: 14400, volume: 151000000, successRate: 88.0 },
      { month: 'Oct 2022', transactions: 18200, volume: 191000000, successRate: 89.2 },
      { month: 'Nov 2022', transactions: 16800, volume: 176000000, successRate: 88.9 },
      { month: 'Dec 2022', transactions: 13700, volume: 143000000, successRate: 87.9 },
      { month: 'Jan 2023', transactions: 13400, volume: 140000000, successRate: 87.6 },
      { month: 'Feb 2023', transactions: 13000, volume: 136000000, successRate: 87.9 },
      { month: 'Mar 2023', transactions: 14300, volume: 150000000, successRate: 88.2 },
      { month: 'Apr 2023', transactions: 15100, volume: 158000000, successRate: 88.4 },
      { month: 'May 2023', transactions: 15600, volume: 163000000, successRate: 88.7 },
      { month: 'Jun 2023', transactions: 14800, volume: 155000000, successRate: 88.3 },
      { month: 'Jul 2023', transactions: 15400, volume: 161000000, successRate: 88.5 },
      { month: 'Aug 2023', transactions: 15100, volume: 158000000, successRate: 88.4 },
      { month: 'Sep 2023', transactions: 14700, volume: 154000000, successRate: 88.2 },
      { month: 'Oct 2023', transactions: 18600, volume: 195000000, successRate: 89.4 },
      { month: 'Nov 2023', transactions: 17200, volume: 180000000, successRate: 89.1 },
      { month: 'Dec 2023', transactions: 14000, volume: 147000000, successRate: 88.0 },
      { month: 'Jan 2024', transactions: 13600, volume: 142000000, successRate: 87.7 },
      { month: 'Feb 2024', transactions: 13200, volume: 138000000, successRate: 88.0 },
      { month: 'Mar 2024', transactions: 14500, volume: 152000000, successRate: 88.3 },
      { month: 'Apr 2024', transactions: 15400, volume: 161000000, successRate: 88.6 },
      { month: 'May 2024', transactions: 16000, volume: 167000000, successRate: 88.9 },
      { month: 'Jun 2024', transactions: 15100, volume: 158000000, successRate: 88.4 },
      { month: 'Jul 2024', transactions: 15700, volume: 164000000, successRate: 88.7 },
      { month: 'Aug 2024', transactions: 15400, volume: 161000000, successRate: 88.5 },
      { month: 'Sep 2024', transactions: 15000, volume: 157000000, successRate: 88.3 },
      { month: 'Oct 2024', transactions: 19100, volume: 200000000, successRate: 89.6 },
      { month: 'Nov 2024', transactions: 17600, volume: 184000000, successRate: 89.3 },
      { month: 'Dec 2024', transactions: 14300, volume: 150000000, successRate: 88.1 }
    ],
    
    // User segment data
    userSegments: [
      { segment: 'Young Professional', percentage: 24.9, users: 18675, avgTransaction: 11000 },
      { segment: 'Business Owner', percentage: 15.1, users: 11325, avgTransaction: 25000 },
      { segment: 'Student', percentage: 14.7, users: 11025, avgTransaction: 2500 },
      { segment: 'Homemaker', percentage: 12.1, users: 9075, avgTransaction: 5000 },
      { segment: 'Freelancer', percentage: 10.0, users: 7500, avgTransaction: 15000 },
      { segment: 'Senior Citizen', percentage: 8.1, users: 6075, avgTransaction: 4000 },
      { segment: 'Government Employee', percentage: 8.0, users: 6000, avgTransaction: 13000 },
      { segment: 'Private Sector', percentage: 7.1, users: 5325, avgTransaction: 18000 }
    ],
    
    // District distribution
    districtData: [
      { district: 'Kathmandu', transactions: 350000, percentage: 70, volume: 3229000000 },
      { district: 'Lalitpur', transactions: 100000, percentage: 20, volume: 923000000 },
      { district: 'Bhaktapur', transactions: 50000, percentage: 10, volume: 461000000 }
    ],
    
    // Hourly pattern
    hourlyPattern: [
      { hour: '0-2', transactions: 3200, percentage: 2.3 },
      { hour: '2-4', transactions: 2100, percentage: 1.5 },
      { hour: '4-6', transactions: 2800, percentage: 2.0 },
      { hour: '6-8', transactions: 8900, percentage: 6.4 },
      { hour: '8-10', transactions: 16800, percentage: 12.1 },
      { hour: '10-12', transactions: 21400, percentage: 15.4 },
      { hour: '12-14', transactions: 19600, percentage: 14.1 },
      { hour: '14-16', transactions: 22100, percentage: 15.9 },
      { hour: '16-18', transactions: 18700, percentage: 13.4 },
      { hour: '18-20', transactions: 15300, percentage: 11.0 },
      { hour: '20-22', transactions: 12400, percentage: 8.9 },
      { hour: '22-24', transactions: 4700, percentage: 3.4 }
    ],
    
    // Device breakdown
    deviceData: [
      { device: 'Android', percentage: 75, transactions: 375000 },
      { device: 'iOS', percentage: 15, transactions: 75000 },
      { device: 'Feature Phone', percentage: 5, transactions: 25000 },
      { device: 'Web', percentage: 5, transactions: 25000 }
    ],
    
    // Network performance
    networkData: [
      { network: 'NTC 4G', transactions: 150000, successRate: 92.1, avgTime: 2100 },
      { network: 'Ncell 4G', transactions: 140000, successRate: 91.8, avgTime: 2200 },
      { network: 'WiFi', transactions: 100000, successRate: 94.5, avgTime: 1800 },
      { network: 'NTC 3G', transactions: 50000, successRate: 85.3, avgTime: 4200 },
      { network: 'Ncell 3G', transactions: 35000, successRate: 84.1, avgTime: 4500 },
      { network: 'NTC 2G', transactions: 15000, successRate: 76.2, avgTime: 7800 },
      { network: 'Ncell 2G', transactions: 10000, successRate: 74.5, avgTime: 8200 }
    ],
    
    // Failure analysis
    failureReasons: [
      { reason: 'Insufficient Balance', percentage: 35, count: 20505 },
      { reason: 'Network Error', percentage: 20, count: 11717 },
      { reason: 'Transaction Timeout', percentage: 15, count: 8788 },
      { reason: 'Invalid PIN', percentage: 10, count: 5859 },
      { reason: 'Daily Limit Exceeded', percentage: 8, count: 4687 },
      { reason: 'Merchant Unavailable', percentage: 7, count: 4101 },
      { reason: 'KYC Not Verified', percentage: 5, count: 2929 }
    ],
    
    // KYC status impact
    kycData: [
      { status: 'Full KYC', percentage: 45, successRate: 92.4, avgTransaction: 15000, limit: 500000 },
      { status: 'Basic KYC', percentage: 40, successRate: 88.2, avgTransaction: 8000, limit: 100000 },
      { status: 'Unverified', percentage: 15, successRate: 80.1, avgTransaction: 3000, limit: 25000 }
    ],
    
    // Predictions for 2025
    predictions2025: {
      totalTransactions: 525000,
      growthRate: 5.0,
      topWallet: 'eSewa',
      predictedVolume: 4843000000,
      highRiskPeriods: ['October 2025 (Dashain)', 'November 2025 (Tihar)'],
      emergingTrends: [
        { trend: 'QR Payment Growth', impact: '+25%' },
        { trend: 'Government Digital Push', impact: '+18%' },
        { trend: 'Rural Expansion', impact: '+15%' }
      ]
    },
    
    // Prescriptive recommendations (aligned with business plan)
    recommendations: [
      {
        title: 'Network Infrastructure Upgrade',
        impact: '-15% failure rate',
        priority: 'High',
        cost: 'NPR 50M',
        benefit: 'NPR 180M',
        roi: '260%',
        description: 'Upgrade 2G/3G infrastructure to reduce network-related failures'
      },
      {
        title: 'KYC Awareness Campaign',
        impact: '+20% Full KYC users',
        priority: 'High',
        cost: 'NPR 10M',
        benefit: 'NPR 45M',
        roi: '350%',
        description: 'Increase Full KYC adoption to improve success rates and transaction limits'
      },
      {
        title: 'Festival Cashback Strategy',
        impact: '+30% transaction volume',
        priority: 'Medium',
        cost: 'NPR 25M',
        benefit: 'NPR 95M',
        roi: '280%',
        description: 'Personalized cashback optimization during peak festival periods'
      },
      {
        title: 'Merchant QR Expansion',
        impact: '+40% merchant payments',
        priority: 'High',
        cost: 'NPR 15M',
        benefit: 'NPR 75M',
        roi: '400%',
        description: 'Deploy QR codes across Kathmandu Valley for seamless payments'
      },
      {
        title: 'User Experience Optimization',
        impact: '+10% success rate',
        priority: 'Medium',
        cost: 'NPR 8M',
        benefit: 'NPR 35M',
        roi: '338%',
        description: 'Reduce app load time and improve transaction flow'
      }
    ]
  };
};

export default generateDashboardData;
import Papa from 'papaparse';

// CSV file paths
const USERS_CSV_PATH = '/src/data/nepal_wallet_users_75k.csv';
const TRANSACTIONS_CSV_PATH = '/src/data/nepal_digital_wallet_500k.csv';

/**
 * Load and parse CSV file
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<Array>} Parsed CSV data as array of objects
 */
const loadCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.error('CSV parsing errors:', results.errors);
        }
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

/**
 * Load both CSV files
 * @returns {Promise<Object>} Object containing users and transactions data
 */
export const loadAllData = async () => {
  try {
    const [users, transactions] = await Promise.all([
      loadCSV(USERS_CSV_PATH),
      loadCSV(TRANSACTIONS_CSV_PATH)
    ]);

    return {
      users,
      transactions
    };
  } catch (error) {
    console.error('Error loading CSV files:', error);
    throw error;
  }
};

/**
 * Process raw CSV data and generate dashboard statistics
 * @param {Object} rawData - Object containing users and transactions arrays
 * @returns {Object} Processed dashboard data
 */
export const processDashboardData = (rawData) => {
  const { users, transactions } = rawData;

  // Filter successful and failed transactions
  const successfulTransactions = transactions.filter(t => t.status === 'Success');
  const failedTransactions = transactions.filter(t => t.failure_reason && t.failure_reason !== '');

  // Calculate summary statistics
  const totalTransactions = transactions.length;
  const totalUsers = users.length;
  const totalVolume = successfulTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const avgTransaction = totalVolume / successfulTransactions.length;
  const successRate = (successfulTransactions.length / totalTransactions) * 100;

  // Calculate wallet market share
  const walletCounts = {};
  const walletTransactions = {};
  transactions.forEach(t => {
    walletCounts[t.wallet] = (walletCounts[t.wallet] || 0) + 1;
    walletTransactions[t.wallet] = (walletTransactions[t.wallet] || 0) + (t.amount || 0);
  });

  const walletColors = {
    'eSewa': '#00A76F',
    'Khalti': '#5F2EEA',
    'IME Pay': '#FF3D00',
    'ConnectIPS': '#1976D2',
    'iPay': '#FF9800',
    'Prabhu Pay': '#FF9800',
    'CellPay': '#9E9E9E',
    'MoCo': '#9E9E9E'
  };

  const walletShare = Object.entries(walletCounts)
    .map(([name, count]) => ({
      name,
      value: parseFloat(((count / totalTransactions) * 100).toFixed(2)),
      transactions: count,
      color: walletColors[name] || '#9E9E9E'
    }))
    .sort((a, b) => b.value - a.value);

  // Calculate category distribution
  const categoryData = {};
  transactions.forEach(t => {
    const category = t.category || t.transaction_category || 'Others';
    if (!categoryData[category]) {
      categoryData[category] = { count: 0, amount: 0 };
    }
    categoryData[category].count += 1;
    categoryData[category].amount += t.amount || 0;
  });

  const categoryDistribution = Object.entries(categoryData)
    .map(([category, data]) => ({
      category,
      percentage: parseFloat(((data.count / totalTransactions) * 100).toFixed(2)),
      amount: data.amount
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // Calculate monthly trend
  const monthlyData = {};
  transactions.forEach(t => {
    const monthKey = `${t.month} ${t.year}`;
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        transactions: 0,
        volume: 0,
        successful: 0
      };
    }
    monthlyData[monthKey].transactions += 1;
    monthlyData[monthKey].volume += t.amount || 0;
    if (t.status === 'Success') {
      monthlyData[monthKey].successful += 1;
    }
  });

  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyTrend = Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      transactions: data.transactions,
      volume: data.volume,
      successRate: parseFloat(((data.successful / data.transactions) * 100).toFixed(2))
    }))
    .sort((a, b) => {
      const [monthA, yearA] = a.month.split(' ');
      const [monthB, yearB] = b.month.split(' ');
      if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
      return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
    });

  // Calculate user segments
  const segmentData = {};
  users.forEach(u => {
    const segment = u.segment || 'Others';
    if (!segmentData[segment]) {
      segmentData[segment] = { count: 0, totalAmount: 0, transactionCount: 0 };
    }
    segmentData[segment].count += 1;
  });

  // Add transaction data to segments
  transactions.forEach(t => {
    const segment = t.user_segment || t.segment || 'Others';
    if (segmentData[segment]) {
      segmentData[segment].totalAmount += t.amount || 0;
      segmentData[segment].transactionCount += 1;
    }
  });

  const userSegments = Object.entries(segmentData)
    .map(([segment, data]) => ({
      segment,
      percentage: parseFloat(((data.count / totalUsers) * 100).toFixed(2)),
      users: data.count,
      avgTransaction: Math.round(data.transactionCount > 0 ? data.totalAmount / data.transactionCount : 0)
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // Calculate district distribution
  const districtData = {};
  transactions.forEach(t => {
    const district = t.district || 'Unknown';
    if (!districtData[district]) {
      districtData[district] = { transactions: 0, volume: 0, successful: 0 };
    }
    districtData[district].transactions += 1;
    districtData[district].volume += t.amount || 0;
    if (t.status === 'Success') {
      districtData[district].successful += 1;
    }
  });

  const districtDistribution = Object.entries(districtData)
    .map(([district, data]) => ({
      district,
      transactions: data.transactions,
      percentage: parseFloat(((data.transactions / totalTransactions) * 100).toFixed(2)),
      volume: data.volume,
      successRate: parseFloat(((data.successful / data.transactions) * 100).toFixed(2))
    }))
    .sort((a, b) => b.transactions - a.transactions);

  // Calculate hourly pattern
  const hourlyData = Array(24).fill(0).map(() => ({ transactions: 0, successful: 0 }));
  transactions.forEach(t => {
    const hour = t.hour;
    if (hour !== null && hour !== undefined && hour >= 0 && hour < 24) {
      hourlyData[hour].transactions += 1;
      if (t.status === 'Success') {
        hourlyData[hour].successful += 1;
      }
    }
  });

  const hourlyPattern = hourlyData.map((data, hour) => ({
    hour: hour,
    hourLabel: `${hour}:00`,
    transactions: data.transactions,
    percentage: parseFloat(((data.transactions / totalTransactions) * 100).toFixed(2)),
    successRate: data.transactions > 0 ? parseFloat(((data.successful / data.transactions) * 100).toFixed(2)) : 0
  }));

  // Calculate day of week pattern
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayNameByIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayAliasMap = {
    mon: 'Monday', monday: 'Monday',
    tue: 'Tuesday', tues: 'Tuesday', tuesday: 'Tuesday',
    wed: 'Wednesday', wednesday: 'Wednesday',
    thu: 'Thursday', thur: 'Thursday', thurs: 'Thursday', thursday: 'Thursday',
    fri: 'Friday', friday: 'Friday',
    sat: 'Saturday', saturday: 'Saturday',
    sun: 'Sunday', sunday: 'Sunday'
  };

  const normalizeDay = (raw) => {
    if (raw === null || raw === undefined || raw === '') return null;
    if (typeof raw === 'number' && raw >= 0 && raw <= 6) {
      return dayNameByIndex[raw];
    }
    const key = String(raw).trim().toLowerCase();
    return dayAliasMap[key] || null;
  };

  const dayOfWeekData = {};
  dayOrder.forEach(day => {
    dayOfWeekData[day] = { transactions: 0, successful: 0, volume: 0 };
  });

  transactions.forEach(t => {
    let day = normalizeDay(t.day_of_week);
    if (!day) {
      const dateValue = t.date || t.timestamp;
      if (dateValue) {
        const parsed = new Date(dateValue);
        if (!Number.isNaN(parsed.getTime())) {
          day = dayNameByIndex[parsed.getDay()];
        }
      }
    }
    if (day && dayOfWeekData[day]) {
      dayOfWeekData[day].transactions += 1;
      dayOfWeekData[day].volume += t.amount || 0;
      if (t.status === 'Success') {
        dayOfWeekData[day].successful += 1;
      }
    }
  });

  const dayOfWeekPattern = dayOrder.map(day => ({
    day,
    isWeekend: day === 'Saturday' || day === 'Sunday',
    transactions: dayOfWeekData[day].transactions,
    volume: dayOfWeekData[day].volume,
    percentage: parseFloat(((dayOfWeekData[day].transactions / totalTransactions) * 100).toFixed(2)),
    successRate: dayOfWeekData[day].transactions > 0 
      ? parseFloat(((dayOfWeekData[day].successful / dayOfWeekData[day].transactions) * 100).toFixed(2)) 
      : 0
  }));

  // Calculate time period breakdown
  const timePeriods = {
    Night: { start: 0, end: 6, transactions: 0, successful: 0, volume: 0 },
    Morning: { start: 6, end: 12, transactions: 0, successful: 0, volume: 0 },
    Afternoon: { start: 12, end: 18, transactions: 0, successful: 0, volume: 0 },
    Evening: { start: 18, end: 24, transactions: 0, successful: 0, volume: 0 }
  };

  transactions.forEach(t => {
    const hour = t.hour;
    if (hour !== null && hour !== undefined) {
      for (const [period, data] of Object.entries(timePeriods)) {
        if (hour >= data.start && hour < data.end) {
          data.transactions += 1;
          data.volume += t.amount || 0;
          if (t.status === 'Success') {
            data.successful += 1;
          }
          break;
        }
      }
    }
  });

  const timePeriodBreakdown = Object.entries(timePeriods).map(([period, data]) => ({
    period,
    timeRange: `${String(data.start).padStart(2, '0')}:00-${String(data.end).padStart(2, '0')}:00`,
    transactions: data.transactions,
    volume: data.volume,
    percentage: parseFloat(((data.transactions / totalTransactions) * 100).toFixed(2)),
    successRate: data.transactions > 0 
      ? parseFloat(((data.successful / data.transactions) * 100).toFixed(2)) 
      : 0
  }));

  // Calculate yearly comparison
  const yearlyData = {};
  transactions.forEach(t => {
    const year = t.year;
    if (year) {
      if (!yearlyData[year]) {
        yearlyData[year] = { transactions: 0, successful: 0, volume: 0 };
      }
      yearlyData[year].transactions += 1;
      yearlyData[year].volume += t.amount || 0;
      if (t.status === 'Success') {
        yearlyData[year].successful += 1;
      }
    }
  });

  const yearlyComparison = Object.entries(yearlyData)
    .map(([year, data]) => ({
      year: parseInt(year),
      transactions: data.transactions,
      volume: data.volume,
      percentage: parseFloat(((data.transactions / totalTransactions) * 100).toFixed(2)),
      successRate: parseFloat(((data.successful / data.transactions) * 100).toFixed(2))
    }))
    .sort((a, b) => a.year - b.year);

  // Calculate festival impact
  const festivalData = { festival: 0, nonFestival: 0, festivalVolume: 0, nonFestivalVolume: 0 };
  transactions.forEach(t => {
    if (t.is_festival && t.is_festival !== 'No') {
      festivalData.festival += 1;
      festivalData.festivalVolume += t.amount || 0;
    } else {
      festivalData.nonFestival += 1;
      festivalData.nonFestivalVolume += t.amount || 0;
    }
  });

  const festivalImpact = {
    festivalTransactions: festivalData.festival,
    nonFestivalTransactions: festivalData.nonFestival,
    festivalPercentage: parseFloat(((festivalData.festival / totalTransactions) * 100).toFixed(2)),
    avgFestivalTransaction: festivalData.festival > 0 ? Math.round(festivalData.festivalVolume / festivalData.festival) : 0,
    avgNonFestivalTransaction: festivalData.nonFestival > 0 ? Math.round(festivalData.nonFestivalVolume / festivalData.nonFestival) : 0,
    volumeIncrease: festivalData.festival > 0 && festivalData.nonFestival > 0
      ? parseFloat((((festivalData.festivalVolume / festivalData.festival) / (festivalData.nonFestivalVolume / festivalData.nonFestival) - 1) * 100).toFixed(2))
      : 0
  };

  // Device breakdown
  const deviceData = {};
  transactions.forEach(t => {
    const device = t.device || 'Unknown';
    if (!deviceData[device]) {
      deviceData[device] = 0;
    }
    deviceData[device] += 1;
  });

  const deviceDistribution = Object.entries(deviceData)
    .map(([device, count]) => ({
      device,
      percentage: parseFloat(((count / totalTransactions) * 100).toFixed(2)),
      transactions: count
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // Calculate network performance
  const networkData = {};
  transactions.forEach(t => {
    const network = t.network || 'Unknown';
    if (!networkData[network]) {
      networkData[network] = {
        transactions: 0,
        successful: 0,
        totalTime: 0
      };
    }
    networkData[network].transactions += 1;
    if (t.status === 'Success') {
      networkData[network].successful += 1;
    }
  });

  const networkPerformance = Object.entries(networkData)
    .map(([network, data]) => ({
      network,
      transactions: data.transactions,
      percentage: parseFloat(((data.transactions / totalTransactions) * 100).toFixed(2)),
      successRate: parseFloat(((data.successful / data.transactions) * 100).toFixed(2)),
      users: Math.round(data.transactions / (totalTransactions / totalUsers)),
      avgTime: 2500 // Placeholder since time data not in CSV
    }))
    .sort((a, b) => b.transactions - a.transactions);

  // Calculate failure reasons
  const failureData = {};
  failedTransactions.forEach(t => {
    const reason = t.failure_reason || 'Unknown';
    failureData[reason] = (failureData[reason] || 0) + 1;
  });

  const failureReasons = Object.entries(failureData)
    .map(([reason, count]) => ({
      reason,
      percentage: parseFloat(((count / failedTransactions.length) * 100).toFixed(2)),
      count
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // Calculate KYC status impact
  const kycData = {};
  users.forEach(u => {
    const status = u.kyc_status || 'Unverified';
    if (!kycData[status]) {
      kycData[status] = {
        count: 0,
        transactions: 0,
        successful: 0,
        totalAmount: 0
      };
    }
    kycData[status].count += 1;
  });

  transactions.forEach(t => {
    const status = t.kyc_status || 'Unverified';
    if (kycData[status]) {
      kycData[status].transactions += 1;
      if (t.status === 'Success') {
        kycData[status].successful += 1;
      }
      kycData[status].totalAmount += t.amount || 0;
    }
  });

  const kycLimits = {
    'Full KYC': 500000,     // NPR 500,000/month - from Data Dictionary KYC Status table
    'Basic KYC': 100000,    // NPR 100,000/month - from Data Dictionary KYC Status table
    'Unverified': 25000     // NPR 25,000/month - from Data Dictionary KYC Status table
  };

  const kycImpact = Object.entries(kycData)
    .map(([status, data]) => ({
      status,
      percentage: parseFloat(((data.count / totalUsers) * 100).toFixed(2)),
      successRate: parseFloat((data.transactions > 0 ? (data.successful / data.transactions) * 100 : 0).toFixed(2)),
      avgTransaction: Math.round(data.transactions > 0 ? data.totalAmount / data.transactions : 0),
      limit: kycLimits[status] || 0
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // Find peak hour
  const peakHourData = hourlyPattern.reduce((max, curr) => 
    curr.transactions > max.transactions ? curr : max, hourlyPattern[0]);

  // Calculate predictions based on actual data trends
  const recentMonths = monthlyTrend.slice(-6); // Last 6 months
  const avgGrowth = recentMonths.length > 1 
    ? ((recentMonths[recentMonths.length - 1].transactions - recentMonths[0].transactions) / recentMonths[0].transactions) * 100 / 6
    : 5.0;
  
  const predictions2025 = {
    totalTransactions: Math.round(totalTransactions * (1 + avgGrowth / 100)),
    growthRate: parseFloat(avgGrowth.toFixed(2)),
    topWallet: walletShare[0]?.name || 'eSewa',
    predictedVolume: Math.round(totalVolume * (1 + avgGrowth / 100)),
    highRiskPeriods: ['October 2025 (Dashain)', 'November 2025 (Tihar)'],
    emergingTrends: [
      { trend: 'QR Payment Growth', impact: `+${parseFloat((walletShare.find(w => w.name === 'Khalti')?.value || 20) * 1.25).toFixed(2)}%` },
      { trend: 'Government Digital Push', impact: `+${parseFloat((categoryDistribution.find(c => c.category === 'Government')?.percentage || 3) * 6).toFixed(2)}%` },
      { trend: 'Rural Expansion', impact: `+${parseFloat(((districtDistribution.length - 3) / districtDistribution.length * 100)).toFixed(2)}%` }
    ]
  };

  // Generate recommendations based on actual data insights
  const topFailureReason = failureReasons[0];
  const lowKYCPercentage = kycImpact.find(k => k.status === 'Full KYC')?.percentage || 0;
  const networkIssuesPercentage = failureReasons.filter(f => 
    f.reason.toLowerCase().includes('network') || f.reason.toLowerCase().includes('timeout')
  ).reduce((sum, f) => sum + f.percentage, 0);

  const recommendations = [
    {
      title: `Address ${topFailureReason?.reason || 'Transaction Failures'}`,
      impact: `-${parseFloat((topFailureReason?.percentage || 15).toFixed(2))}% failure rate`,
      priority: 'High',
      cost: `NPR ${Math.round((totalVolume * 0.00001) / 1000000)}M`,
      benefit: `NPR ${Math.round((totalVolume * topFailureReason?.percentage / 100 * 0.05) / 1000000)}M`,
      roi: `${Math.round((topFailureReason?.percentage || 15) * 20)}%`,
      description: `Focus on reducing ${topFailureReason?.reason || 'failures'} which accounts for ${topFailureReason?.percentage || 0}% of all failures`
    },
    {
      title: 'KYC Awareness Campaign',
      impact: `+${parseFloat((100 - lowKYCPercentage).toFixed(2))}% Full KYC adoption potential`,
      priority: 'High',
      cost: `NPR ${Math.round((totalVolume * 0.000002) / 1000000)}M`,
      benefit: `NPR ${Math.round((totalVolume * (100 - lowKYCPercentage) / 100 * 0.01) / 1000000)}M`,
      roi: `${Math.round((100 - lowKYCPercentage) * 3.5)}%`,
      description: `Only ${lowKYCPercentage}% users have Full KYC. Increasing adoption will improve success rates and transaction limits`
    },
    {
      title: 'Network Infrastructure Upgrade',
      impact: `-${parseFloat(networkIssuesPercentage.toFixed(2))}% network-related failures`,
      priority: networkIssuesPercentage > 20 ? 'High' : 'Medium',
      cost: `NPR ${Math.round((totalVolume * 0.00001) / 1000000)}M`,
      benefit: `NPR ${Math.round((totalVolume * networkIssuesPercentage / 100 * 0.08) / 1000000)}M`,
      roi: `${Math.round(networkIssuesPercentage * 15)}%`,
      description: `Network issues account for ${parseFloat(networkIssuesPercentage.toFixed(2))}% of failures. Infrastructure upgrade is critical`
    },
    {
      title: `Expand ${walletShare[0]?.name || 'Top Wallet'} Market Share`,
      impact: `+${parseFloat((100 - walletShare[0]?.value || 35).toFixed(2))}% potential growth`,
      priority: 'High',
      cost: `NPR ${Math.round((totalVolume * 0.000003) / 1000000)}M`,
      benefit: `NPR ${Math.round((totalVolume * 0.15) / 1000000)}M`,
      roi: `${Math.round((100 - (walletShare[0]?.value || 35)) * 10)}%`,
      description: `${walletShare[0]?.name || 'Leading wallet'} currently holds ${walletShare[0]?.value || 0}% market share with growth opportunity`
    },
    {
      title: 'User Experience Optimization',
      impact: `+${parseFloat((100 - successRate).toFixed(2))}% success rate improvement potential`,
      priority: 'Medium',
      cost: `NPR ${Math.round((totalVolume * 0.000002) / 1000000)}M`,
      benefit: `NPR ${Math.round((totalVolume * (100 - successRate) / 100 * 0.03) / 1000000)}M`,
      roi: `${Math.round((100 - successRate) * 30)}%`,
      description: `Current success rate is ${successRate}%. Improving UX can reduce failures and boost conversions`
    }
  ];

  return {
    summary: {
      totalTransactions,
      totalUsers,
      totalVolume,
      avgTransaction: Math.round(avgTransaction),
      successRate: parseFloat(successRate.toFixed(2)),
      failedTransactions: failedTransactions.length,
      avgMonthly: Math.round(totalTransactions / monthlyTrend.length),
      peakHour: peakHourData.hour
    },
    walletShare,
    categoryData: categoryDistribution,
    monthlyTrend,
    userSegments,
    districtData: districtDistribution,
    hourlyPattern,
    dayOfWeekPattern,
    timePeriodBreakdown,
    yearlyComparison,
    festivalImpact,
    deviceData: deviceDistribution,
    networkData: networkPerformance,
    failureReasons,
    kycData: kycImpact,
    predictions2025,
    recommendations
  };
};

export default { loadAllData, processDashboardData };

# Nepal Digital Wallet Optimization - Data Dictionary

## Project Overview
**Project Title:** Nepal Digital Wallet Optimization  
**Dataset Scope:** Kathmandu Valley (Kathmandu, Lalitpur, Bhaktapur Districts)  
**Total Transactions:** 500,000  
**Total Users:** 75,000  
**Date Range:** January 1, 2022 - December 31, 2024  
**Total Transaction Volume:** NPR 4.61 Billion  

---

## Dataset Files

### 1. nepal_digital_wallet_500k.csv (112 MB)
Main transaction-level dataset containing 500,000 records with 32 columns.

### 2. nepal_wallet_users_75k.csv (7 MB)
User profile dataset containing 75,000 unique users with 11 columns.

---

## Transaction Dataset Schema (nepal_digital_wallet_500k.csv)

| # | Column Name | Data Type | Description | Sample Values |
|---|-------------|-----------|-------------|---------------|
| 1 | transaction_id | String | Unique transaction identifier | ES202401151234567, KH202403089876543 |
| 2 | user_id | String | Unique user identifier | USR100000, USR174999 |
| 3 | wallet | String | Digital wallet provider | eSewa, Khalti, IME Pay, ConnectIPS |
| 4 | transaction_type | String | Type of transaction | Mobile Recharge, Fund Transfer, etc. |
| 5 | category | String | Transaction category | Utility, Transfer, Shopping, etc. |
| 6 | amount | Integer | Transaction amount in NPR | 50 - 100,000 |
| 7 | currency | String | Currency code | NPR |
| 8 | merchant | String | Merchant/recipient name | Nepal Telecom, Daraz, Personal Transfer |
| 9 | timestamp | DateTime | Full transaction timestamp | 2024-01-15 14:23:45 |
| 10 | date | Date | Transaction date | 2024-01-15 |
| 11 | year | Integer | Transaction year | 2022, 2023, 2024 |
| 12 | month | Integer | Transaction month (1-12) | 1-12 |
| 13 | day | Integer | Day of month | 1-31 |
| 14 | hour | Integer | Hour of transaction (0-23) | 0-23 |
| 15 | day_of_week | String | Day name | Monday, Tuesday, etc. |
| 16 | is_weekend | Binary | Weekend indicator | 0 = Weekday, 1 = Weekend |
| 17 | status | String | Transaction status | Success, Failed |
| 18 | failure_reason | String | Reason for failure (if failed) | Insufficient Balance, Network Error, etc. |
| 19 | processing_time_ms | Integer | Transaction processing time | 800 - 15,000 milliseconds |
| 20 | device | String | Device type used | Android, iOS, Feature Phone, Web |
| 21 | network | String | Network connection type | NTC 4G, Ncell 4G, WiFi, etc. |
| 22 | location | String | User location in Kathmandu Valley | Kathmandu, Lalitpur, Thamel, etc. |
| 23 | district | String | District name | Kathmandu, Lalitpur, Bhaktapur |
| 24 | user_segment | String | User demographic segment | Student, Young Professional, etc. |
| 25 | user_age | Integer | User's age | 18-75 |
| 26 | user_gender | String | User's gender | Male, Female, Other |
| 27 | kyc_status | String | KYC verification level | Full KYC, Basic KYC, Unverified |
| 28 | loyalty_tier | String | User's loyalty program tier | Bronze, Silver, Gold, Platinum |
| 29 | cashback_earned | Float | Cashback amount earned | 0.0 - varies |
| 30 | is_festival | String | Festival period indicator | Dashain, Tihar, No |
| 31 | is_first_txn | Binary | First transaction flag | 0, 1 |
| 32 | is_recurring | Binary | Recurring payment indicator | 0, 1 |

---

## User Dataset Schema (nepal_wallet_users_75k.csv)

| # | Column Name | Data Type | Description | Sample Values |
|---|-------------|-----------|-------------|---------------|
| 1 | user_id | String | Unique user identifier | USR100000 |
| 2 | segment | String | User segment classification | Student, Business Owner, etc. |
| 3 | age | Integer | User age | 18-75 |
| 4 | gender | String | User gender | Male, Female, Other |
| 5 | location | String | Primary location | Kathmandu, Lalitpur, etc. |
| 6 | district | String | District | Kathmandu, Lalitpur, Bhaktapur |
| 7 | preferred_wallet | String | Primary wallet used | eSewa, Khalti, etc. |
| 8 | kyc_status | String | KYC level | Full KYC, Basic KYC, Unverified |
| 9 | account_age_days | Integer | Days since account creation | 30-1500 |
| 10 | device | String | Primary device type | Android, iOS, etc. |
| 11 | network | String | Primary network provider | NTC 4G, Ncell 4G, WiFi |
| 12 | loyalty_tier | String | Loyalty program tier | Bronze, Silver, Gold, Platinum |

---

## Reference Data

### Digital Wallets (Market Share)
| Wallet | Market Share | Description |
|--------|-------------|-------------|
| eSewa | 35.1% | Largest digital wallet in Nepal |
| Khalti | 24.8% | Second largest, popular among youth |
| IME Pay | 15.0% | IME Group's digital wallet |
| ConnectIPS | 10.1% | Nepal Clearing House's interbank payment |
| Prabhu Pay | 5.0% | Prabhu Group's digital wallet |
| QPay | 2.9% | QR-focused payment platform |
| CellPay | 3.0% | Telecom-linked payment service |
| MoCo | 2.0% | Mobile commerce platform |
| iPay | 2.1% | Emerging digital wallet |

### Transaction Categories
| Category | Percentage | Transaction Types |
|----------|-----------|-------------------|
| Utility | 36.1% | Mobile Recharge, Electricity, Internet, Water, TV/Cable |
| Transfer | 18.1% | Fund Transfer, Bank Transfer |
| Shopping | 12.3% | Online Shopping, Grocery |
| Merchant | 8.1% | QR Payment at stores/restaurants |
| Load | 4.9% | Wallet Load/Top-up |
| Withdrawal | 4.1% | Cash Out from agents |
| Financial | 4.1% | Insurance, EMI Payment |
| Government | 3.3% | Vehicle Tax, License, Land Revenue |
| Food | 3.3% | Food Delivery |
| Travel | 2.5% | Flight, Bus, Hotel Booking |
| Education | 1.7% | School/College Fee |
| Transport | 1.6% | Fuel Payment |

### Transaction Types (20 Types)
1. Mobile Recharge (22%)
2. Fund Transfer (18%)
3. Online Shopping (12%)
4. Electricity Bill (10%)
5. QR Payment (10%)
6. Wallet Load (6%)
7. Internet Bill (6%)
8. Cash Out (5%)
9. Bank Transfer (4%)
10. Government Payment (4%)
11. Food Delivery (4%)
12. Water Bill (3%)
13. TV/Cable Bill (3%)
14. Grocery (3%)
15. EMI Payment (3%)
16. Insurance Premium (2%)
17. School/College Fee (2%)
18. Bus Ticket (2%)
19. Fuel Payment (2%)
20. Flight Booking (1%)

### User Segments
| Segment | Percentage | Age Range | Typical Transaction |
|---------|-----------|-----------|---------------------|
| Young Professional | 24.9% | 22-35 | NPR 2,000-20,000 |
| Business Owner | 15.1% | 28-55 | NPR 5,000-100,000 |
| Student | 14.7% | 18-25 | NPR 500-5,000 |
| Homemaker | 12.1% | 25-50 | NPR 500-10,000 |
| Freelancer | 10.0% | 22-40 | NPR 1,000-30,000 |
| Senior Citizen | 8.1% | 55-75 | NPR 500-8,000 |
| Government Employee | 8.0% | 25-58 | NPR 2,000-25,000 |
| Private Sector | 7.1% | 22-55 | NPR 3,000-35,000 |

### Locations in Kathmandu Valley
**Kathmandu District (25 locations):**
- Kathmandu (Metro), Budhanilkantha, Tokha, Chandragiri, Tarakeshwar, Nagarjun
- Kageshwari-Manohara, Gokarneshwar, Shankharapur, Kirtipur
- Thamel, New Baneshwor, Baluwatar, Lazimpat

**Lalitpur District (8 locations):**
- Lalitpur (Metro), Patan, Jawalakhel, Pulchowk
- Godawari, Mahalaxmi, Konjyosom, Bagmati

**Bhaktapur District (5 locations):**
- Bhaktapur (Metro), Madhyapur Thimi
- Suryabinayak, Changunarayan

### Failure Reasons
| Reason | Percentage | Description |
|--------|-----------|-------------|
| Insufficient Balance | 35% | User lacks funds |
| Network Error | 20% | Connection issues |
| Transaction Timeout | 15% | Processing exceeded limit |
| Invalid PIN | 10% | Wrong PIN entered |
| Daily Limit Exceeded | 8% | Transaction limit reached |
| Merchant Unavailable | 7% | Merchant system down |
| KYC Not Verified | 5% | Requires higher KYC |

### Device Types
| Device | Percentage |
|--------|-----------|
| Android | 75% |
| iOS | 15% |
| Feature Phone | 5% |
| Web | 5% |

### Network Types
| Network | Percentage |
|---------|-----------|
| NTC 4G | 30% |
| Ncell 4G | 28% |
| WiFi | 20% |
| NTC 3G | 10% |
| Ncell 3G | 7% |
| NTC 2G | 3% |
| Ncell 2G | 2% |

### KYC Status
| Status | Percentage | Transaction Limit |
|--------|-----------|-------------------|
| Full KYC | 45% | NPR 500,000/month |
| Basic KYC | 40% | NPR 100,000/month |
| Unverified | 15% | NPR 25,000/month |

### Loyalty Tiers
| Tier | Percentage | Benefits |
|------|-----------|----------|
| Bronze | 50% | Base cashback (0.5%) |
| Silver | 30% | 1% cashback + offers |
| Gold | 15% | 2% cashback + priority |
| Platinum | 5% | 3% cashback + premium |

### Festival Periods (Included)
| Festival | 2022 | 2023 | 2024 |
|----------|------|------|------|
| Dashain | Oct 1-15 | Oct 15-28 | Oct 3-17 |
| Tihar | Oct 24-28 | Nov 10-15 | Oct 31-Nov 4 |

---

## Key Statistics

### Overall Metrics
- **Total Transactions:** 500,000
- **Total Volume:** NPR 4,613,257,350
- **Average Transaction:** NPR 10,451
- **Success Rate:** 88.28%
- **Failed Transactions:** 58,586

### Year-over-Year Distribution
| Year | Transactions | Percentage |
|------|-------------|------------|
| 2022 | 166,821 | 33.4% |
| 2023 | 165,991 | 33.2% |
| 2024 | 167,188 | 33.4% |

### District Distribution
| District | Transactions |
|----------|-------------|
| Kathmandu | 350,000+ |
| Lalitpur | 100,000+ |
| Bhaktapur | 50,000+ |

---

## Data Quality Notes

1. **Temporal Patterns:** Transactions follow realistic hourly patterns with peaks at 10 AM, 2 PM, and 8 PM
2. **Festival Effects:** Transaction amounts are 50% higher during Dashain and Tihar
3. **Network Impact:** 2G networks have higher failure rates and longer processing times
4. **User Behavior:** Users tend to use their preferred wallet 70% of the time
5. **Recurring Payments:** Utility bills marked as recurring 60% of the time

---

## Suggested Analysis Areas

### Descriptive Analytics
- Transaction volume trends by wallet, category, location
- Peak transaction hours and days
- Festival vs non-festival spending patterns
- User segment behavior analysis

### Diagnostic Analytics
- Failure rate analysis by network, device, time
- Success rate correlation with KYC status
- Processing time optimization opportunities
- Regional performance comparison

### Predictive Analytics
- Transaction volume forecasting
- Churn prediction based on usage patterns
- Failure probability prediction
- Customer lifetime value estimation

### Prescriptive Analytics
- Optimal cashback strategies
- Network infrastructure recommendations
- User experience improvement actions
- Market share growth tactics

---

## File Usage

```python
# Load transactions
import pandas as pd
transactions = pd.read_csv('nepal_digital_wallet_500k.csv')

# Load users
users = pd.read_csv('nepal_wallet_users_75k.csv')

# Merge for full analysis
full_data = transactions.merge(users, on='user_id', suffixes=('_txn', '_user'))
```

---

**Generated:** January 2026  
**Project:** Nepal Digital Wallet Optimization  
**Scope:** Kathmandu Valley (500,000 transactions, 75,000 users)

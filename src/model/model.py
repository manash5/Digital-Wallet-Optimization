# wallet_ml_models.py

import pandas as pd
import numpy as np
import json

# ML
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.cluster import KMeans
from sklearn.metrics import classification_report, mean_squared_error, r2_score, roc_auc_score

# Time series
from prophet import Prophet

# ---------------------------
# 1. LOAD DATA
# ---------------------------
df = pd.read_csv("src/data/nepal_digital_wallet_500k.csv")

# Basic cleanup
df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
df = df.dropna(subset=["timestamp"])
df["hour"] = df["timestamp"].dt.hour
df["is_weekend"] = (df["timestamp"].dt.dayofweek >= 5).astype(int)

# ---------------------------
# 2. TRANSACTION VOLUME FORECASTING (PROPHET)
# ---------------------------
def transaction_volume_forecast(df):
    """Forecast transaction volume for next 12 months using Prophet"""
    daily = (
        df.groupby(df["timestamp"].dt.date)
        .agg(txn_count=("transaction_id", "count"))
        .reset_index()
    )

    daily.columns = ["ds", "y"]
    daily["ds"] = pd.to_datetime(daily["ds"])

    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=True,
        interval_width=0.95
    )
    model.fit(daily)

    future = model.make_future_dataframe(periods=365)
    forecast = model.predict(future)
    
    # Get next 12 months
    forecast_next_12m = forecast[forecast['ds'] > daily['ds'].max()].tail(365)
    
    peak_days = forecast.sort_values("yhat", ascending=False).head(10)

    return {
        "forecast": forecast_next_12m[["ds", "yhat", "yhat_lower", "yhat_upper"]].to_dict(orient="records"),
        "peak_days": peak_days[["ds", "yhat"]].to_dict(orient="records"),
        "model_type": "Prophet Time Series"
    }


# ---------------------------
# 3. CHURN PREDICTION (CLASSIFICATION)
# ---------------------------
def churn_prediction_model(df):
    """
    Predict which users are likely to churn (stop using wallet).
    Based on: inactivity, transaction frequency, account age
    """
    # Create user-level features
    user_features = df.groupby("user_id").agg(
        txn_count=("transaction_id", "count"),
        avg_amount=("amount", "mean"),
        total_volume=("amount", "sum"),
        failure_rate=("status", lambda x: (x == "Failed").mean()),
        cashback=("cashback_earned", "sum"),
        kyc_status=("kyc_status", "last"),
        loyalty_tier=("loyalty_tier", "last"),
        user_segment=("user_segment", "last"),
        account_age_days=("timestamp", lambda x: (x.max() - x.min()).days),
        last_transaction=("timestamp", "max"),
        device=("device", "first"),
        network=("network", "first")
    ).reset_index()
    
    # Calculate inactivity (days since last transaction)
    max_date = df["timestamp"].max()
    user_features["days_inactive"] = (max_date - user_features["last_transaction"]).dt.days
    
    # Label: Churned if inactive > 90 days
    user_features["churned"] = (user_features["days_inactive"] > 90).astype(int)
    
    # Features for model
    feature_cols = ["txn_count", "avg_amount", "total_volume", "failure_rate", 
                    "cashback", "account_age_days", "days_inactive"]
    
    X = user_features[feature_cols].fillna(0)
    y = user_features["churned"]
    
    # Encode categorical features
    X_encoded = X.copy()
    
    X_train, X_test, y_train, y_test = train_test_split(
        X_encoded, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Train model with cross-validation
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight='balanced'
    )
    
    # Cross-validation
    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='roc_auc')
    
    model.fit(X_train, y_train)
    
    # Predictions
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    y_pred = model.predict(X_test)
    
    # Metrics
    auc_score = roc_auc_score(y_test, y_pred_proba)
    accuracy = (y_pred == y_test).mean() * 100
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'Feature': feature_cols,
        'Importance': model.feature_importances_
    }).sort_values('Importance', ascending=False)
    
    # High-risk churners
    user_features["churn_probability"] = 0.0
    user_features.loc[X.index, "churn_probability"] = y_pred_proba if len(y_pred_proba) == len(user_features) else 0.0
    
    high_risk_churners = user_features[user_features["churn_probability"] > 0.6].sort_values(
        "churn_probability", ascending=False
    ).head(10)
    
    return {
        "model_type": "Churn Prediction (Random Forest)",
        "cv_auc_mean": round(cv_scores.mean(), 4),
        "cv_auc_std": round(cv_scores.std(), 4),
        "test_auc": round(auc_score, 4),
        "test_accuracy": round(accuracy, 2),
        "churn_rate": round(y.mean() * 100, 2),
        "feature_importance": feature_importance.to_dict(orient="records"),
        "high_risk_users": high_risk_churners[["user_id", "days_inactive", "txn_count", "churn_probability"]].to_dict(orient="records"),
        "at_risk_count": int((user_features["churn_probability"] > 0.6).sum())
    }


# ---------------------------
# 4. FAILURE PROBABILITY PREDICTION (CLASSIFICATION)
# ---------------------------
def failure_probability_model(df):
    """
    Predict if a transaction will fail based on features like:
    KYC status, network, device, time of day, amount, category
    """
    df_fp = df.copy()
    df_fp["is_failure"] = (df_fp["status"] == "Failed").astype(int)
    
    # Feature engineering
    df_fp["hour_category"] = pd.cut(df_fp["hour"], 
                                     bins=[0, 10, 14, 20, 24], 
                                     labels=["Night", "Morning", "Afternoon", "Evening"])
    
    feature_cols = [
        "amount", "hour", "processing_time_ms",
        "kyc_status", "network", "device", "category", "loyalty_tier"
    ]
    
    X = df_fp[feature_cols].copy()
    y = df_fp["is_failure"]
    
    # Handle missing values
    X = X.fillna("Unknown")
    
    # Encode categorical features
    X_encoded = pd.get_dummies(X, columns=["kyc_status", "network", "device", "category", "loyalty_tier"], drop_first=True)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X_encoded, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Train model with cross-validation
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight='balanced'
    )
    
    # Cross-validation
    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='roc_auc')
    
    model.fit(X_train, y_train)
    
    # Predictions
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    y_pred = model.predict(X_test)
    
    # Metrics
    auc_score = roc_auc_score(y_test, y_pred_proba)
    accuracy = (y_pred == y_test).mean() * 100
    
    # Feature importance (top 10)
    feature_importance = pd.DataFrame({
        'Feature': X_encoded.columns,
        'Importance': model.feature_importances_
    }).sort_values('Importance', ascending=False).head(10)
    
    # Failure rate by category
    failure_by_category = df_fp.groupby("category").agg(
        failure_rate=("is_failure", lambda x: (x.mean() * 100)),
        total_txns=("transaction_id", "count")
    ).reset_index().sort_values("failure_rate", ascending=False)
    
    return {
        "model_type": "Failure Probability (Random Forest)",
        "cv_auc_mean": round(cv_scores.mean(), 4),
        "cv_auc_std": round(cv_scores.std(), 4),
        "test_auc": round(auc_score, 4),
        "test_accuracy": round(accuracy, 2),
        "failure_rate": round(y.mean() * 100, 2),
        "feature_importance": feature_importance.to_dict(orient="records"),
        "high_risk_categories": failure_by_category.head(5).to_dict(orient="records"),
        "predictions_sample": {
            "failure_count": int(y_pred.sum()),
            "success_count": int((y_pred == 0).sum()),
            "failure_probability_avg": round(y_pred_proba.mean(), 4)
        }
    }


# ---------------------------
# 5. CUSTOMER LIFETIME VALUE ESTIMATION (REGRESSION)
# ---------------------------
def customer_lifetime_value_model(df):
    """
    Estimate CLV for each user over 12 months based on:
    - Transaction frequency
    - Average transaction amount
    - Loyalty tier
    - User segment
    - Account age
    """
    user_features = df.groupby("user_id").agg(
        txn_count=("transaction_id", "count"),
        avg_amount=("amount", "mean"),
        total_volume=("amount", "sum"),
        success_rate=("status", lambda x: (x == "Success").mean()),
        failure_rate=("status", lambda x: (x == "Failed").mean()),
        cashback=("cashback_earned", "sum"),
        kyc_status=("kyc_status", "last"),
        loyalty_tier=("loyalty_tier", "last"),
        user_segment=("user_segment", "last"),
        account_age_days=("timestamp", lambda x: (x.max() - x.min()).days)
    ).reset_index()
    
    # Target: Estimated 12-month CLV (avg_amount * txn_count * success_rate + cashback)
    user_features["clv_12m"] = (
        user_features["avg_amount"] * 
        (user_features["txn_count"] / max(user_features["account_age_days"].max() / 365, 1)) * 
        365 * 
        user_features["success_rate"] +
        user_features["cashback"]
    )
    
    # Features
    feature_cols = [
        "txn_count", "avg_amount", "total_volume", "success_rate",
        "failure_rate", "cashback", "account_age_days"
    ]
    
    X = user_features[feature_cols].fillna(0)
    y = user_features["clv_12m"]
    
    # Remove outliers (CLV > 0)
    valid_mask = y > 0
    X = X[valid_mask]
    y = y[valid_mask]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train regression model
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=15,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    # Predictions
    y_pred = model.predict(X_test)
    
    # Metrics
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100
    accuracy = 100 - mape
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'Feature': feature_cols,
        'Importance': model.feature_importances_
    }).sort_values('Importance', ascending=False)
    
    # High-value customers
    user_features_valid = user_features[valid_mask].copy()
    user_features_valid["predicted_clv"] = 0.0
    user_features_valid.loc[X.index, "predicted_clv"] = y_pred if len(y_pred) == len(user_features_valid) else 0.0
    
    high_value_customers = user_features_valid.nlargest(10, "clv_12m")[
        ["user_id", "clv_12m", "txn_count", "loyalty_tier", "user_segment"]
    ]
    
    # CLV segments
    user_features_valid["clv_segment"] = pd.qcut(
        user_features_valid["clv_12m"],
        q=4,
        labels=["Low Value", "Medium Value", "High Value", "VIP"]
    )
    
    clv_segments = user_features_valid.groupby("clv_segment").agg(
        count=("user_id", "count"),
        avg_clv=("clv_12m", "mean"),
        total_clv=("clv_12m", "sum")
    ).to_dict(orient="index")
    
    return {
        "model_type": "Customer Lifetime Value (Random Forest Regression)",
        "rmse": round(rmse, 2),
        "r2_score": round(r2, 4),
        "mape": round(mape, 2),
        "model_accuracy": round(accuracy, 2),
        "avg_clv": round(y.mean(), 2),
        "median_clv": round(y.median(), 2),
        "feature_importance": feature_importance.to_dict(orient="records"),
        "high_value_customers": high_value_customers.to_dict(orient="records"),
        "clv_segments": clv_segments,
        "total_estimated_portfolio_value": round(y.sum(), 2)
    }


# ---------------------------
# 6. NETWORK FAILURE RISK MODEL (EXISTING)
# ---------------------------
def network_failure_model(df):
    df_nf = df.copy()
    df_nf["network_failure"] = (
        (df_nf["status"] == "Failed") &
        (df_nf["failure_reason"] == "Network Error")
    ).astype(int)

    features = [
        "amount", "hour", "is_weekend", "network",
        "device", "category"
    ]

    X = df_nf[features]
    y = df_nf["network_failure"]

    X = pd.get_dummies(X, drop_first=True)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=8,
        random_state=42
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)

    failure_rate = preds.mean() * 100

    return {
        "network_failure_rate": round(failure_rate, 2)
    }


# ---------------------------
# 7. DISTRICT UNDERPENETRATION (CLUSTERING)
# ---------------------------
def district_clustering(df):
    district_stats = df.groupby("district").agg(
        txn_count=("transaction_id", "count"),
        avg_amount=("amount", "mean"),
        failure_rate=("status", lambda x: (x == "Failed").mean())
    ).reset_index()

    X = district_stats[["txn_count", "avg_amount", "failure_rate"]]

    kmeans = KMeans(n_clusters=3, random_state=42)
    district_stats["cluster"] = kmeans.fit_predict(X)

    # Low txn cluster = underpenetrated
    underpenetrated = district_stats.sort_values("txn_count").head(3)

    return underpenetrated[["district", "txn_count", "failure_rate"]]


# ---------------------------
# 8. RUN ALL MODELS
# ---------------------------
if __name__ == "__main__":
    import sys
    from datetime import datetime
    
    print("="*60)
    print("NEPAL DIGITAL WALLET - PREDICTIVE MODELS")
    print(f"Execution Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)

    print("\n1️⃣ TRANSACTION VOLUME FORECASTING...")
    volume_forecast = transaction_volume_forecast(df)
    print(f"   Model: {volume_forecast['model_type']}")
    print(f"   Peak Days Identified: {len(volume_forecast['peak_days'])}")
    print(f"   First Peak: {volume_forecast['peak_days'][0]}")

    print("\n2️⃣ CHURN PREDICTION MODEL...")
    churn_result = churn_prediction_model(df)
    print(f"   Model: {churn_result['model_type']}")
    print(f"   CV AUC: {churn_result['cv_auc_mean']} ± {churn_result['cv_auc_std']}")
    print(f"   Test AUC: {churn_result['test_auc']}")
    print(f"   Test Accuracy: {churn_result['test_accuracy']}%")
    print(f"   Churn Rate: {churn_result['churn_rate']}%")
    print(f"   High-Risk Users: {churn_result['at_risk_count']}")

    print("\n3️⃣ FAILURE PROBABILITY MODEL...")
    failure_result = failure_probability_model(df)
    print(f"   Model: {failure_result['model_type']}")
    print(f"   CV AUC: {failure_result['cv_auc_mean']} ± {failure_result['cv_auc_std']}")
    print(f"   Test AUC: {failure_result['test_auc']}")
    print(f"   Test Accuracy: {failure_result['test_accuracy']}%")
    print(f"   Overall Failure Rate: {failure_result['failure_rate']}%")
    print(f"   Top Risk Category: {failure_result['high_risk_categories'][0]}")

    print("\n4️⃣ CUSTOMER LIFETIME VALUE MODEL...")
    clv_result = customer_lifetime_value_model(df)
    print(f"   Model: {clv_result['model_type']}")
    print(f"   RMSE: NPR {clv_result['rmse']}")
    print(f"   R² Score: {clv_result['r2_score']}")
    print(f"   Model Accuracy: {clv_result['model_accuracy']}%")
    print(f"   Average CLV (12m): NPR {clv_result['avg_clv']}")
    print(f"   Portfolio Value: NPR {clv_result['total_estimated_portfolio_value']}")
    
    print("\n" + "="*60)
    print("ALL MODELS EXECUTED SUCCESSFULLY ✅")
    print("="*60)
    
    # Save results to JSON for React frontend
    results = {
        "volume_forecast": volume_forecast,
        "churn_prediction": churn_result,
        "failure_probability": failure_result,
        "customer_lifetime_value": clv_result,
        "execution_time": datetime.now().isoformat()
    }
    
    with open("src/model/predictions.json", "w") as f:
        json.dump(results, f, indent=2, default=str)

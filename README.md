# 🏠 California House Price Prediction (End-to-End ML Project)

This is my first end-to-end Machine Learning project where I built, trained, evaluated, and deployed a house price prediction model using the California Housing dataset.

The project covers the full ML lifecycle — from data preprocessing to model deployment using Flask.

---

## 🚀 Project Overview

This project predicts the median house value in California districts using various housing-related features such as:

- Median Income
- Total Rooms
- Total Bedrooms
- Population
- Households
- Latitude & Longitude
- Ocean Proximity

It is a **Supervised Regression Problem**.

---

## 🛠 Tech Stack

- Python
- Pandas
- NumPy
- Matplotlib & Seaborn
- Scikit-learn
- Flask
- Joblib

---

## 📊 Machine Learning Workflow

### 1️⃣ Data Exploration (EDA)
- Checked dataset structure
- Identified missing values
- Visualized correlations
- Understood feature relationships

### 2️⃣ Data Preprocessing
- Handled missing values using median imputation
- Created new engineered features:
  - `rooms_per_household`
  - `bedrooms_per_room`
  - `population_per_household`
- Scaled numerical features
- Applied One-Hot Encoding to categorical features
- Used `ColumnTransformer` and `Pipeline` for clean preprocessing

### 3️⃣ Model Training
- Used **RandomForestRegressor**
- Split data using train-test split
- Evaluated using R² Score

📈 Achieved R² Score ≈ **0.8**

---

## 💾 Model Saving

The complete preprocessing pipeline + trained model was saved using:

```python
joblib.dump(model, "house_price_model.pkl")

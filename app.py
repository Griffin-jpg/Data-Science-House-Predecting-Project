from flask import Flask, render_template, request
import joblib
import pandas as pd

app = Flask(__name__)

# Load trained pipeline
model = joblib.load("house_price_model.pkl")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():

    total_rooms = float(request.form["total_rooms"])
    total_bedrooms = float(request.form["total_bedrooms"])
    population = float(request.form["population"])
    households = float(request.form["households"])

    data = {
        "longitude": float(request.form["longitude"]),
        "latitude": float(request.form["latitude"]),
        "housing_median_age": float(request.form["housing_median_age"]),
        "total_rooms": total_rooms,
        "total_bedrooms": total_bedrooms,
        "population": population,
        "households": households,
        "median_income": float(request.form["median_income"]),
        "ocean_proximity": request.form["ocean_proximity"],

        # ADD THESE 👇
        "rooms_per_household": total_rooms / households,
        "bedrooms_per_room": total_bedrooms / total_rooms,
        "population_per_household": population / households
    }

    df = pd.DataFrame([data])

    prediction = model.predict(df)[0]

    return render_template(
        "index.html",
        prediction_text=f"Predicted House Price: ${prediction:,.2f}"
    )

if __name__ == "__main__":
    app.run(debug=True)
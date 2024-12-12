import googlemaps
import itertools
import datetime
import streamlit as st
import pandas as pd

# Add title and description
st.title("Route Optimizer")
st.write("Find the best route for your errands based on distance or traffic time")

# Replace with your actual API key
API_KEY = "AIzaSyB0tl4TfxJfgHbAgpmsnUboHJECAQjvKjg"
gmaps = googlemaps.Client(key=API_KEY)

# Convert inputs to Streamlit widgets
origin = st.text_input("Starting Point", "777 S Broad St, Philadelphia, PA 19147")
destination = st.text_input("Ending Point", "777 S Broad St, Philadelphia, PA 19147")

# Create a dynamic list of errands
st.subheader("Enter your errands")
num_errands = st.number_input("Number of errands", min_value=1, max_value=10, value=3)
errands = []
for i in range(num_errands):
    errand = st.text_input(f"Errand {i+1}", value="Enter address")
    if errand != "Enter address":  # Only add valid addresses
        errands.append(errand)

# Add mode of transportation selector
transport_mode = st.selectbox(
    "Mode of Transportation",
    ["driving", "walking", "bicycling", "transit"],
    index=0  # Default to driving
)

# Add departure time selector
st.subheader("Departure Time")
use_custom_time = st.checkbox("Schedule for later?", False)

if use_custom_time:
    departure_date = st.date_input(
        "Select departure date",
        min_value=datetime.date.today(),
        value=datetime.date.today()
    )
    departure_time_input = st.time_input(
        "Select departure time",
        value=datetime.datetime.now().time()
    )
    # Combine date and time into datetime object
    departure_time = datetime.datetime.combine(departure_date, departure_time_input)
else:
    departure_time = datetime.datetime.now() + datetime.timedelta(minutes=30)

# Function to calculate total duration for a route with departure time
def calculate_total_duration(route, departure_time):
    total_duration = 0
    waypoints = [origin] + list(route) + [destination]  # Include origin and destination
    for i in range(len(waypoints) - 1):
        directions_result = gmaps.directions(
            waypoints[i],
            waypoints[i + 1],
            mode=transport_mode,  # Use selected transport mode
            departure_time=departure_time
        )
        total_duration += directions_result[0]['legs'][0]['duration_in_traffic']['value']
    return total_duration

# Function to calculate total distance for a route
def calculate_total_distance(route):
    total_distance = 0
    waypoints = [origin] + list(route) + [destination]  # Include origin and destination
    for i in range(len(waypoints) - 1):
        directions_result = gmaps.directions(
            waypoints[i], 
            waypoints[i + 1], 
            mode=transport_mode  # Use selected transport mode
        )
        total_distance += directions_result[0]['legs'][0]['distance']['value']
    return total_distance

if st.button("Calculate Best Routes"):
    if errands:  # Only proceed if there are valid errands
        # Generate all possible permutations
        all_routes = list(itertools.permutations(errands))

        # Calculate duration-based route
        shortest_duration = float('inf')
        best_route_duration = None
        for route in all_routes:
            duration = calculate_total_duration(route, departure_time)
            if duration < shortest_duration:
                shortest_duration = duration
                best_route_duration = route

        # Calculate distance-based route
        shortest_distance = float('inf')
        best_route_distance = None
        for route in all_routes:
            distance = calculate_total_distance(route)
            if distance < shortest_distance:
                shortest_distance = distance
                best_route_distance = route

        # Create DataFrames for both routes
        duration_df = pd.DataFrame({
            'Stop Number': range(1, len(best_route_duration) + 1),
            'Address': best_route_duration,
            'Route Type': ['Time-optimized'] * len(best_route_duration)
        })

        distance_df = pd.DataFrame({
            'Stop Number': range(1, len(best_route_distance) + 1),
            'Address': best_route_distance,
            'Route Type': ['Distance-optimized'] * len(best_route_distance)
        })

        # Combine and display results
        st.subheader("Optimized Routes")
        
        # Display time-optimized route
        st.write("Time-optimized Route (Total time: {:.2f} minutes)".format(shortest_duration/60))
        st.dataframe(duration_df)
        
        # Display distance-optimized route
        st.write("Distance-optimized Route (Total distance: {:.2f} km)".format(shortest_distance/1000))
        st.dataframe(distance_df)
    else:
        st.error("Please enter at least one valid errand address")
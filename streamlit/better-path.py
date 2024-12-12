import googlemaps
import itertools
import datetime
import streamlit as st
import pandas as pd
from geopy.geocoders import Nominatim
import folium
from streamlit_folium import folium_static
import certifi
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

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
default_addresses = [
    "1515 Walnut St, Philadelphia, PA 19102",
    "1700 Chestnut St, Philadelphia, PA 19103",
    "801 S 9th St, Philadelphia, PA 19147"
]
errands = []
for i in range(num_errands):
    default_value = default_addresses[i] if i < len(default_addresses) else "Enter address"
    errand = st.text_input(f"Errand {i+1}", value=default_value)
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

def get_coordinates(address):
    try:
        # Use Google Maps Geocoding instead of Nominatim
        geocode_result = gmaps.geocode(address)
        if geocode_result:
            location = geocode_result[0]['geometry']['location']
            return [location['lat'], location['lng']]
        
        st.warning(f"Could not geocode address: {address}")
        return None
    except Exception as e:
        st.warning(f"Error geocoding address: {address}. Error: {str(e)}")
        return None

def calculate_routes():
    if not errands:
        st.error("Please enter at least one valid errand address")
        return
        
    # Initialize map variable
    m = None
    
    # Create a map centered on the origin
    origin_coords = get_coordinates(origin)
    if not origin_coords:
        st.error("Could not find coordinates for the starting point")
        return
        
    # Create the map now that we have valid origin coordinates
    m = folium.Map(location=origin_coords, zoom_start=13)
    
    # Add origin marker
    folium.Marker(
        origin_coords,
        popup="Start",
        icon=folium.Icon(color='green', icon='info-sign')
    ).add_to(m)
    
    # Add destination marker
    dest_coords = get_coordinates(destination)
    if dest_coords:
        folium.Marker(
            dest_coords,
            popup="End",
            icon=folium.Icon(color='red', icon='info-sign')
        ).add_to(m)
    
    # Add errand markers
    for i, errand in enumerate(errands, 1):
        coords = get_coordinates(errand)
        if coords:
            folium.Marker(
                coords,
                popup=f"Stop {i}",
                icon=folium.Icon(color='blue', icon='info-sign')
            ).add_to(m)

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

    # Display the map if it was created successfully
    if m:
        st.subheader("Route Map")
        folium_static(m)
    
    # Display time-optimized route
    st.write("Time-optimized Route (Total time: {:.2f} minutes)".format(shortest_duration/60))
    st.dataframe(duration_df)
    
    # Display distance-optimized route
    st.write("Distance-optimized Route (Total distance: {:.2f} km)".format(shortest_distance/1000))
    st.dataframe(distance_df)

if st.button("Calculate Best Routes"):
    calculate_routes()
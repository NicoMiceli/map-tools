import streamlit as st
import pandas as pd
import numpy as np

# Set page config
st.set_page_config(
    page_title="My Streamlit App",
    page_icon="👋",
    layout="wide"
)

# Title of the app
st.title("Welcome to My Streamlit App")

# Add a sidebar
st.sidebar.header("Sidebar")

# Main content
st.write("Hello! This is my first Streamlit app.")

# Example of some basic Streamlit components
if st.checkbox("Show sample data"):
    data = pd.DataFrame({
        'Column 1': [1, 2, 3, 4, 5],
        'Column 2': [10, 20, 30, 40, 50]
    })
    st.dataframe(data)

# Add selectbox
option = st.selectbox(
    'Select an option',
    ['Option 1', 'Option 2', 'Option 3']
)

# Add slider
number = st.slider('Select a number', 0, 100, 50)

# Display the selected values
st.write('You selected:', option)
st.write('Your number is:', number)

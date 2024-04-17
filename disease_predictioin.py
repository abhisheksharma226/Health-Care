import pickle
import sys

# Load the trained machine learning model
def load_model(model_path):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    return model

# Function to preprocess input data (if necessary)
def preprocess_input(input_data):
    # Your preprocessing logic goes here
    # This might include encoding categorical variables, scaling numerical features, etc.
    return input_data

# Function to make predictions based on input data
def predict_disease(input_data, model):
    # Preprocess input data
    input_data_processed = preprocess_input(input_data)
    
    # Make predictions using the loaded model
    predictions = model.predict(input_data_processed)
    
    # Return predictions
    return predictions

if __name__ == "__main__":
    # Load the trained model
    model_path = "disease_prediction_model.pkl"  # Update with the path to your trained model
    model = load_model(model_path)
    
    # Extract input data from command line arguments
    input_data = [int(arg) for arg in sys.argv[1:]]  # Convert command line arguments to integers
    
    # Make predictions
    predictions = predict_disease([input_data], model)
    
    # Print prediction result
    print(predictions[0])

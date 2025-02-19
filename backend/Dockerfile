# Use an official Python runtime as a base image
FROM python:3.9

# Set the working directory
WORKDIR /app

# Copy the application files
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port Flask will run on
EXPOSE 8080

# Command to run the app using Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8080", "app:app"]
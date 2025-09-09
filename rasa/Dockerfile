FROM rasa/rasa:3.6.0

# Switch to root to install dependencies
USER root

# Copy training data and configuration
COPY . /app
WORKDIR /app

# Install additional dependencies if needed
RUN pip install --no-cache-dir requests

# Train the model
RUN rasa train --config config.yml --domain domain.yml --data data/

# Switch back to rasa user
USER 1001

# Expose port
EXPOSE 5005

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:5005/ || exit 1

# Start Rasa server
CMD ["rasa", "run", "--enable-api", "--cors", "*", "--port", "5005", "--debug"]
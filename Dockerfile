FROM nginx:stable-alpine

# Copy application files
COPY index.html /usr/share/nginx/html/
COPY scripts/ /usr/share/nginx/html/scripts/
COPY styles/ /usr/share/nginx/html/styles/

# Configure Nginx to serve the app on port 8080 to match the Kubernetes config
RUN sed -i 's/listen\s*80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

# Expose port 8080 as specified in the deployment.yaml
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD [ "wget", "-q", "http://localhost:8080", "-O", "/dev/null" ]

# Default command to start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
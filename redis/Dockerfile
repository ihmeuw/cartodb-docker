FROM redis:3.2

# Configure Redis to run with persistence.
ENTRYPOINT [ \
  "docker-entrypoint.sh", \
  "redis-server", \
  "--save", "900", "1", \
  "--appendonly", "yes", \
  "--appendfsync", "everysec" \
]

# Empty CMD directive to override CMD in the base image.
# Additional configuration options can be passed via a custom command.
CMD []

# Docker

Docker-related support files live here.

The root `docker-compose.yml` defines local PostgreSQL and Redis services for future development.

No application containers are defined during Phase 0.

## Services

- `postgres`: PostgreSQL 16 for future persistence work.
- `redis`: Redis latest stable Alpine image for future cache, queue, and coordination work.

Both services use:

- health checks
- `unless-stopped` restart policy
- named persistent volumes
- environment-variable defaults for local configuration

## Configuration

The Compose file can be validated without starting services:

```sh
docker compose config
```

Optional local startup:

```sh
docker compose up postgres redis
```

The default local values are intentionally development-only. Use `.env.example` as the source of documented application variables, and override Docker-specific values with local environment variables when needed:

- `POSTGRES_IMAGE`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_PORT`
- `POSTGRES_VOLUME`
- `REDIS_IMAGE`
- `REDIS_PORT`
- `REDIS_VOLUME`

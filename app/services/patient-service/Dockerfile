FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY app/packages/fhir-models/package.json app/packages/fhir-models/
COPY app/packages/db-client/package.json app/packages/db-client/
COPY app/packages/auth-client/package.json app/packages/auth-client/
COPY app/packages/common/package.json app/packages/common/
COPY app/services/patient-service/package.json app/services/patient-service/
RUN pnpm install --no-frozen-lockfile
COPY app/packages/ app/packages/
COPY app/services/patient-service/ app/services/patient-service/
RUN pnpm --filter @ananta/fhir-models build && \
    pnpm --filter @ananta/common build && \
    pnpm --filter @ananta/db-client build && \
    pnpm --filter @ananta/auth-client build && \
    pnpm --filter @ananta/patient-service build

FROM node:20-alpine AS runner
RUN addgroup -g 1001 -S ananta && adduser -S ananta -u 1001
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/app ./app
USER ananta
EXPOSE 3001
CMD ["node", "app/services/patient-service/dist/server.js"]

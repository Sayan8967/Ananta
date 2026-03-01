FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY app/packages/fhir-models/package.json app/packages/fhir-models/
COPY app/web/package.json app/web/
RUN pnpm install --no-frozen-lockfile
COPY app/packages/fhir-models/ app/packages/fhir-models/
COPY app/web/ app/web/
RUN pnpm --filter @ananta/fhir-models build && pnpm --filter @ananta/web build

FROM node:20-alpine AS runner
RUN addgroup -g 1001 -S ananta && adduser -S ananta -u 1001
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/app/web/.next/standalone ./
COPY --from=builder /app/app/web/.next/static ./.next/static
COPY --from=builder /app/app/web/public ./public
USER ananta
EXPOSE 3000
CMD ["node", "server.js"]

FROM node:23 AS node-builder
WORKDIR /app
COPY www/js/package*.json ./
RUN npm install

FROM golang:1.23 AS go-builder
WORKDIR /app
COPY . .
COPY --from=node-builder /app/node_modules ./www/js/node_modules
RUN go run core/cmd/build.go
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM alpine:latest
WORKDIR /app
COPY --from=go-builder /app/__immutable ./__immutable
COPY --from=go-builder /app/main ./
COPY --from=go-builder /app/app.lua ./
COPY --from=go-builder /app/www/static ./www/static
RUN ls
ENTRYPOINT ["./main"]
CMD ["--mode=production"]

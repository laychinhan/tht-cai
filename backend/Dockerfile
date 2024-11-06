FROM golang:alpine

RUN apk update && apk add --no-cache git

WORKDIR /app

COPY . .

RUN go mod tidy

RUN cd ./src && \
    go build -o ../bin/server && \
    chmod +x ../bin/server

EXPOSE 3003

ENTRYPOINT ["/app/bin/server"]
## Start Backing Services

```
docker-compose up -d
```

## Make sure running node +12
```
$ node -v
v12.18.3
```

## Start Server
```
$ node server/index.js 8000
```

## Start Ledger Sync
```
$ node ledger_sync/index.js
```

## Start Processor
```
$ node processor/index.js
```

## Start UI (React)
```
$ cd app && npm start
```
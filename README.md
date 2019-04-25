# redis-node
A NodeJS application with Socket.io and redis

# Common redis commands

#### Start
`redis-server` to start a redis server
`redis-cli` to connect to a redis server via the commandline

#### Set
`set key value` e.g. `set leroy jenkins`

#### Get
`get key` e.g. `get leroy` returns `jenkins`

#### Counter
Use `set` but ensure your key is numeric. Then use `incr` to increase it. Use `get` to retrieve it

#### Exists
Use `exists key` that returns a `1` if the key exists, otherwise `0`

#### Expire
Use `expire key value` to expire a key where `value` is seconds to until expire e.g. `expire leroy 2`
Adding `set key value EX number_of_seconds` will expire a key after the number of seconds. Look up time to live with `ttl key`

#### Hashes

`hset` and `hget`

```redis
redis> HSET name first "Adam"
(integer) 1
redis> HSET name last "Ahrens"
(integer) 1
redis> HGET name first
"Adam"
redis> HGET name last
"Ahrens"
```

For adding multiple key values use `hmget` and `hmset`. Use `hkeys` to look up all the available keys in a set
``` redis
redis> HMSET address street "4420 H St" city "Iowa City"
"OK"
redis> HMGET address street city
1) "4420 H St"
2) "Iowa City"
redis> HKEYS address
1) "street"
2) "city"
```
#### Lists

Can have duplicate values vs set can only have unique values

``` redis
redis> lpush movies Inception
(integer) 1
redis> lpush movies "The Matrix"
(integer) 2
redis> lpush movies "The Big Lebowski"
(integer) 3
redis> lrange movies 0 1
1) "The Big Lebowski"
2) "The Matrix"
```

#### Sets
Have plain sets and ordered sets `sadd` vs `zadd`. Can then perform common set operations such as union, diff, intersection

#### Storing Structures

```
127.0.0.1:6379> hmset user:1 username adam email blah@blah.com
OK
127.0.0.1:6379> hmset user:2 username josh email blah2@blah.com
OK
127.0.0.1:6379> hmset user:3 username leroy email jenkins@blah.com
OK
127.0.0.1:6379> hgetall user:1
1) "username"
2) "adam"
3) "email"
4) "blah@blah.com"
127.0.0.1:6379> hgetall user:2
1) "username"
2) "josh"
3) "email"
4) "blah2@blah.com"
127.0.0.1:6379> hgetall user:3
1) "username"
2) "leroy"
3) "email"
4) "jenkins@blah.com"
127.0.0.1:6379>
```

Now lets say we wanted to lookup by usernames. Lets add another structure to refer back to the hashes
```
127.0.0.1:6379> set username:adam user:1
OK
127.0.0.1:6379> set username:josh user:2
OK
127.0.0.1:6379> set username:leroy user:3
OK
127.0.0.1:6379>
```

With this new index we can do a lookupfor the key that refers to a username (for example of a signup form uses a username field)

```
127.0.0.1:6379> get username:adam
"user:1"
127.0.0.1:6379> hgetall user:1
1) "username"
2) "adam"
3) "email"
4) "blah@blah.com"
127.0.0.1:6379>
```

# Redis messaging

Simple messaging provided by PUB/SUB. Too subscribe you use `subscribe channel_name` so `subscribe user:created`. Also has `psubscribe` for pattern matching.

```
127.0.0.1:6379> subscribe movies

127.0.0.1:6379> publish movies "The Big Lebowski"
(integer) 1
127.0.0.1:6379> publish movies "The Matrix"
(integer) 1

1) "subscribe"
2) "movies"
3) (integer) 1
1) "message"
2) "movies"
3) "The Big Lebowski"
1) "message"
2) "movies"
3) "The Matrix"
```

# Socket.io
`io()` in browser console to connect a websocket
```
socket connection is open
```

# Using Rooms and Namespaces (Socket.io features)

An area to group clients. Treat (listen, emit, and broadcast) room as it's own socket.io

`socket.join(name_of_room);`

Clients know when connecting to a namespace. Namespace is a separate instance of socket.io.

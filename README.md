# redis-node
A NodeJS application with Socket.io and redis

# Common redis commands

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

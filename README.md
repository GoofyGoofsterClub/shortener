# shortener

A small, funky looking self-hosted URL shortener with multi-domain support.

## Notes

> [!IMPORTANT]  
> For now, there is no user-management, as it uses [imagination server's](https://github.com/LMNYX/imagination-server) database on our end.

To create a user right now, you have to:

1. Log in into your mongodb `mongosh`;
2. Select the database you specified, `use dbname;`;
3. Create a new user, using this:

```js
db.users.insertOne({
	displayName: "username",
	key: "", // Please put a random UUIDv4 here
	administrator: false,
	can_invite: false,
	protected: false,
	isBanned: false,
});
```

After this you will be able to log in with a key you specified in the `key` field. As other option you can use [imagination server's](https://github.com/LMNYX/imagination-server) dashboard to manage users, **again** for now.

## Installation

WIP

## Build

WIP

## API

To shorten a link using API, you can make request to `/api/link/shorten` while providing these GET parameters:

```
?key= # (required) Your authentication key
&link= # (required) Link to shorten
&onetime= # true/false: If the link should stop working after use
&samedomain= # true/false: By default true, can change only through API, set false, if you want for the link to work across all domains linked to instance.
```

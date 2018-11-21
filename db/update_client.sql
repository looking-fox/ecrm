update clients
set name = $3, session_id = $4, date = $5, location = $6
where user_id = $1 and client_id = $2;

update sessions
set session_price = $7
where session_id = $4 and user_id = $1;

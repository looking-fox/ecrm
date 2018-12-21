update clients
set name = $3, client_email = $4, session_id = $5, date = $6, location = $7, state = $9, country = $10, list_id = $12
where user_id = $1 and client_id = $2;

update sessions
set session_price = $8, actions = to_jsonb($11)
where session_id = $5 and user_id = $1;

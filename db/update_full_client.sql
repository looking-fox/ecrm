update clients
set name = $3, session_id = $4, client_email = $5, date = $6, location = $7, state = $10, country = $11
where user_id = $1 and client_id = $2;

update sessions
set session_price = $8, actions = array_to_json($9)
where session_id = $4 and user_id = $1;
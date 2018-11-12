update clients
set name = $3, session_id = $4, date = $5, location = $6
where user_id = $1 and client_id = $2;

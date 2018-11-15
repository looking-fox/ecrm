update clients
set completed = $3
where user_id = $1 and client_id = $2;

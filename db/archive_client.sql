update clients
set archived = $3
where user_id = $1 and client_id = $2;

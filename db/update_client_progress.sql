update clients
set completed = $2
where session_id = $1;
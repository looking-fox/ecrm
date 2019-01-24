update sessions
set index = $3 
where user_id = $1 and session_id = $2;
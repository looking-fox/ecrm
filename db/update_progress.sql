update sessions
set progress = $2
where session_id = $1;
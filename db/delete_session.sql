update sessions
set active='inactive'
where session_id = $1;
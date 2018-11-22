delete from session_actions
where session_id = $2 
and user_id = $1;
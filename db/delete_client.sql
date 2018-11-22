delete from session_actions
where user_id = $1
and session_id = $2;

delete from clients
where user_id = $1
and session_id = $2;
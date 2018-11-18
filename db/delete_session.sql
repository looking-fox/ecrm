delete from session_actions
where session_id = $1;

delete from sessions
where session_id = $1;
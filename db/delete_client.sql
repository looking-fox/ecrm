delete from payments
where user_id = $1;

delete from clients
where user_id = $1
and session_id = $2;

delete from sessions
where user_id = $1
and session_id = $2;

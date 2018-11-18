select distinct on (sessions.session_id) sessions.session_id, session_name, 
session_color, session_price, actions from sessions
where user_id = $1
and template = true; 
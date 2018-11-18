update sessions
set session_name = $3, session_color = $4, session_price = $5, 
actions = array_to_json($6), template = $7
where user_id = $1 and session_id = $2;

delete from session_actions
where user_id = $1 and session_id = $2;




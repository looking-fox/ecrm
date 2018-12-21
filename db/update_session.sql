update sessions
set session_name = $3, session_color = $4, session_price = $5, 
actions = to_jsonb($6), template = $7
where user_id = $1 and session_id = $2;




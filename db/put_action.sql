update sessions 
set actions = to_jsonb($3)
where user_id = $1 and session_id = $2;
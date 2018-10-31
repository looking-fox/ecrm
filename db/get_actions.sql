select sessions.session_id, session_name, 
session_color, session_price, sessions.user_id, 
array_agg( 
jsonb_build_object('name', session_actions.name, 'completed', session_actions.completed,
'id', session_actions.action_id)
) from sessions
inner join session_actions
on session_actions.session_id = sessions.session_id
where sessions.user_id=$1
group by sessions.session_id;

-- select sessions.session_id, session_name, 
-- session_color, session_price, sessions.user_id, 
-- array_agg( 
-- jsonb_build_object('name', session_actions.name, 'completed', session_actions.completed,
-- 'id', session_actions.action_id, 'client_id', session_actions.client_id)
-- ) from sessions
-- left join session_actions
-- on session_actions.session_id = sessions.session_id
-- where sessions.user_id=$1
-- group by sessions.session_id;


select 
array_agg( 
jsonb_build_object('user_id', session_actions.user_id, 'session_id', session_actions.session_id, 'name', session_actions.name, 'completed', session_actions.completed,
'id', session_actions.action_id, 'client_id', session_actions.client_id)
) as actions from session_actions
where user_id=$1
group by session_actions.client_id;
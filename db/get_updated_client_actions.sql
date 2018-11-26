select 
array_agg( 
jsonb_build_object('user_id', session_actions.user_id, 'session_id', session_actions.session_id, 'name', session_actions.name, 'completed', session_actions.completed,
'id', session_actions.action_id) order by action_id
) as actions from session_actions
where user_id=$1 and session_id = $2
group by session_actions.session_id
limit 1;
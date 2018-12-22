with exports as (
    select session_id, jsonb_array_elements_text(actions)::jsonb as doc from sessions
)
select exports.session_id, sessions.user_id, sessions.session_name, 
sessions.session_color, sessions.session_price,
jsonb_agg(doc) as actions, sessions.template from exports

left join sessions on
sessions.session_id = exports.session_id

where sessions.user_id = $1
and sessions.template = true

group by exports.session_id, sessions.user_id, 
sessions.session_name, sessions.session_color, sessions.session_price, sessions.template
order by session_id;



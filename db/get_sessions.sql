with a as (
    select session_id, jsonb_array_elements_text(actions)::jsonb as doc from sessions
),
b as (
    select session_id, jsonb_agg(doc) as actions from a
    group by session_id
)

select b.session_id, sessions.user_id, sessions.session_name, 
sessions.session_color, sessions.session_price,
sessions.progress,
b.actions, sessions.template from b

left join sessions on
sessions.session_id = b.session_id

where sessions.user_id = $1
and sessions.template = true

group by b.session_id, sessions.user_id, b.actions,
sessions.session_name, sessions.session_color, sessions.session_price, sessions.template
order by session_id;
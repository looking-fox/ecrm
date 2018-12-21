insert into sessions(
    "session_name", 
    "session_color", 
    "session_price", 
    "actions", 
    "user_id",
    "template")

values ( $1, $2, $3, to_jsonb($4), $5, $6 );

with a as (
    select session_id, jsonb_array_elements_text(actions)::jsonb as doc from sessions
),
b as (
    select session_id, jsonb_agg(doc) as actions from a
    group by session_id
)
select sessions.user_id, b.session_id, b.actions, sessions.session_name, 
sessions.session_color, sessions.session_price, sessions.template from b
left join sessions on
sessions.session_id = b.session_id
where user_id = $5
order by sessions.session_id desc
limit 1;
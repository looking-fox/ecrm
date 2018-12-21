with a as (
    select session_id, jsonb_array_elements_text(actions)::jsonb as doc from sessions
),
b as (
    select session_id, jsonb_agg(doc) as actions from a
    group by session_id
)
select clients.user_id, b.session_id, clients.client_id,
clients.name, clients.date, clients.location, clients.list_id,
clients.completed, clients.client_email, clients.state, clients.country, 
sessions.session_name, sessions.session_color, sessions.session_price, 
sessions.template, b.actions
from b
right join clients on
clients.session_id = b.session_id
join sessions on 
sessions.session_id = b.session_id
where clients.user_id = $1;
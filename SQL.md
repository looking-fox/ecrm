create table users (
user_id serial primary key,
name text,
email text,
sub text
)

insert into clients (user_id, name, session_id, date, location, price)
VALUES (
    'google-oauth2|103947273324697076686',
    'Martha Vimme',
    4,
    '10/12/2019',
    'Libby, MT',
    '$1,900'
)

select * from users
inner join clients 
on users.user_id = clients.user_id

select * from users
left join clients 
on users.user_id = clients.user_id
where users.user_id = 'google-oauth2|103947273324697076686'

select * from users
left join clients 
on users.user_id = clients.user_id
left join sessions
on sessions.session_id = clients.session_id
where users.user_id = 'google-oauth2|103947273324697076686';


select session_id, array_agg( 
jsonb_build_object('name', session_actions.name, 'completed', session_actions.completed,
'id', session_actions.action_id)
)
from session_actions
group by session_id;

select sessions.session_id, session_name, 
session_color, session_price, sessions.user_id, 
array_agg( 
jsonb_build_object('name', session_actions.name, 'completed', session_actions.completed,
'id', session_actions.action_id)
) from sessions
inner join session_actions
on session_actions.session_id = sessions.session_id
group by sessions.session_id;


//----With WHERE USER_ID----//
select sessions.session_id, session_name, 
session_color, session_price, sessions.user_id, 
array_agg( 
jsonb_build_object('name', session_actions.name, 'completed', session_actions.completed,
'id', session_actions.action_id, 'client_id', session_actions.client_id)
) from sessions
left join session_actions
on session_actions.session_id = sessions.session_id
where sessions.user_id='google-oauth2|103947273324697076686'
group by sessions.session_id;
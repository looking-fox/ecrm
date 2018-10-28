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
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




//json_agg() method

select 
json_agg( 
jsonb_build_object('user_id', session_actions.user_id, 'session_id', session_actions.session_id, 'name', session_actions.name, 'completed', session_actions.completed,
'id', session_actions.action_id, 'client_id', session_actions.client_id)
) as actions from session_actions
where user_id='google-oauth2|103947273324697076686'
group by session_actions.client_id;


<!-- Payment Totals -->

select client_id, sum(amount) as total from payments
where user_id = 'google-oauth2|103947273324697076686'
group by client_id


<!-- Payment Total per client with id and name -->
select payments.client_id, sum(amount) as total, clients.name from payments
left join clients
on clients.client_id = payments.client_id
where payments.user_id = 'google-oauth2|103947273324697076686'
group by payments.client_id, clients.name


<!-- Payment Total | Client ID | Session ID | Session Price  -->

select payments.client_id, sum(amount) as total, clients.name, clients.session_id, sessions.session_price  from payments
left join clients
on clients.client_id = payments.client_id
left join sessions
on sessions.session_id = clients.session_id
where payments.user_id = 'google-oauth2|103947273324697076686'
group by payments.client_id, clients.name, clients.session_id, sessions.session_price


<!-- Select payments within a certain time frame -->

SELECT 
CASE WHEN date > '2018-10-05T05:00:00.000Z' THEN amount END AS payments 
from payments



<!-- Find paid, total billed, and due for all payments in a year.  -->

SELECT sum(amount) as paid, 
sum( TO_NUMBER( session_price , 'L9G999g999.99' )) as total,
sum( TO_NUMBER( session_price , 'L9G999g999.99' )) - 
sum(amount) as due
FROM payments
left join clients on 
clients.client_id = payments.client_id
left join sessions on
sessions.session_id = clients.session_id
WHERE payments.date LIKE '%2018%'


<!-- Convert date to date data format -->

select cast(date as date) from payments


<!-- Group payment amount as object by month -->
SELECT json_agg( 
jsonb_build_object('date', date, 'amount', amount)
), EXTRACT(MONTH FROM date) AS Month
FROM payments
group by EXTRACT(MONTH FROM date)



<!-- Select monthly paid totals with payment count  -->
SELECT sum(amount) as amount, count(*) as quantity, EXTRACT(MONTH FROM date) AS Month
FROM payments
group by EXTRACT(MONTH FROM date)


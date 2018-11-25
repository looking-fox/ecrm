insert into clients (user_id, name, session_id, client_email, date, location, list_id)
VALUES ( $1, $2, $3, $4, $5, $6, $7 );

-- Give me back the action_list and new client_id for the client we just created. 
-- If we try and give where clauses for the client, we could potentially hit an edge case. 
-- Order by/limit help us avoid this, and the where clause avoids returning a null value from the DB by accident.

select * from users
left join clients 
on users.user_id = clients.user_id
left join sessions
on sessions.session_id = clients.session_id
where users.user_id = $1
order by clients.client_id desc
limit 1;




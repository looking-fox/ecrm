insert into clients (user_id, name, session_id, date, location)
VALUES ( $1, $2, $3, $4, $5 );

-- Give me back the action_list and new client_id for the client we just created. 
-- If we try and give where clauses for the client, we could potentially hit an edge case. 
-- Order by/limit help us avoid this, and the where clause avoids returning a null value from the DB by accident.

-- select 
-- sessions.action_list, clients.client_id, sessions.session_id, sessions.user_id
-- from sessions
-- left join clients
-- on clients.session_id = sessions.session_id
-- where action_list IS NOT NULL and client_id IS NOT NULL
-- order by client_id desc
-- limit 1;

select 
array_agg( sessions.actions ), clients.client_id
from sessions
left join clients
on clients.session_id = sessions.session_id
where actions IS NOT NULL and client_id IS NOT NULL
group by clients.client_id
order by clients.client_id desc
limit 1;


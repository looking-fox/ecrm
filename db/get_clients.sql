select * from users
left join clients 
on users.user_id = clients.user_id
left join sessions
on sessions.session_id = clients.session_id
where users.user_id = $1
order by clients.client_id desc;
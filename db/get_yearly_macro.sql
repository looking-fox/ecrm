select 
sum(amount) filter(where extract(year from payments.date) = $2
and sessions.user_id = $1) as paid
from sessions
join clients on 
clients.session_id = sessions.session_id
full join payments on 
payments.client_id = clients.client_id
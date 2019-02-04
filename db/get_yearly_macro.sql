select 
sum(amount) filter(where extract(year from expenses.date) = $2
and expenses.user_id = $1) as amount
from expenses
UNION ALL
select
sum(amount) filter(where extract(year from mileage.date) = $2
and mileage.user_id = $1) as amount
from mileage;

-- select 
-- sum(amount) filter(where extract(year from payments.date) = $2
-- and sessions.user_id = $1) as paid
-- from sessions
-- join clients on 
-- clients.session_id = sessions.session_id
-- full join payments on 
-- payments.client_id = clients.client_id
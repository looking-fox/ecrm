select * from expenses
where user_id = $1 and client_id = $2
order by date;
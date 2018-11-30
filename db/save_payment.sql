insert into payments (user_id, client_id, amount, date, description)
VALUES($1, $2, $3, $4, $5);

select * from payments
where user_id = $1
and client_id = $2
order by payment_id desc
limit 1;
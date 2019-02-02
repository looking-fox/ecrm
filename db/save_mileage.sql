insert into mileage (user_id, client_id, amount, date, description)
VALUES($1, $2, $3, $4, $5);

select * from mileage
where user_id = $1
and client_id = $2
order by mileage_id desc
limit 1;
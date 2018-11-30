update payments
set amount = $3, date = $4, description = $5
where user_id = $1 and payment_id = $2;

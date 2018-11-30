update payments
set amount = $4, date = $5, description = $6
where user_id = $1 and client_id = $2 and payment_id = $3;
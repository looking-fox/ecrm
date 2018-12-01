delete from payments
where user_id = $1 and payment_id = $2;
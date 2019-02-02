update mileage
set amount = $3, date = $4, description = $5
where user_id = $1 and mileage_id = $2;

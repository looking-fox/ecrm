update users
set user_id = $1, full_name = $2
where email = $3;


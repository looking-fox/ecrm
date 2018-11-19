update client_lists
set list_name = $3
where user_id = $1 and list_id = $2;
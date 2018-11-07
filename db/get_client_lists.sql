select client_id, client_name from client_lists
where user_id = $1
order by list_id;
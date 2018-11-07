select list_id, list_name from client_lists
where user_id = $1
order by list_id;
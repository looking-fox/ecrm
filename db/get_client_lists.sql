select list_id, list_name, index_id from client_lists
where user_id = $1
order by index_id;
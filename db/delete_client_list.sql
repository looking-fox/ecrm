delete from clients
where user_id = $1
and list_id = $2;

delete from client_lists
where user_id =$1
and list_id = $2;
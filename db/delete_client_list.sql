delete from payments where client_id in
(select client_id from clients
where list_id = 115 
);

delete from clients 
where user_id = $1 and list_id = $2;

delete from sessions where session_id in
(select session_id from clients
where list_id = 115
);

delete from client_lists
where user_id =$1
and list_id = $2;
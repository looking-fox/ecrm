insert into client_lists (user_id, list_name)
VALUES($1, $2);

select list_id, list_name from client_lists
where user_id = $1
order by list_id desc
limit 1;

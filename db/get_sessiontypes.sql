select * from sessions
where user_id=$1 and template = true;
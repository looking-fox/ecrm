insert into session_actions(name, session_id, user_id)
VALUES($1, $2, $3);

select action_id from session_actions
order by action_id desc
limit 1;
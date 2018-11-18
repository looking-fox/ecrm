insert into session_actions(name, session_id, user_id, template)
VALUES($1, $2, $3, $4);

select action_id from session_actions
order by action_id desc
limit 1;
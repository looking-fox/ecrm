update session_actions
set completed=$1
where action_id=$2;
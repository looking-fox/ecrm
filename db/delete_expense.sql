delete from expenses
where user_id = $1 and expense_id = $2;
update expenses
set amount = $3, date = $4, description = $5
where user_id = $1 and expense_id = $2;

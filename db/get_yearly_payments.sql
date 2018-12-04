select 
coalesce(sum(amount) 
filter(where extract(year from date) = $2 and user_id = $1), 0) as total from calendar
full outer join payments on 
calendar.month_id = extract(month from payments.date)
group by extract(month from date), calendar.month_id, calendar.month_name
order by month_id;
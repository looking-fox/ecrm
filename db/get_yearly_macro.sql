SELECT sum(amount) as paid, 
sum( TO_NUMBER( session_price , 'L9G999g999.99' )) as total,
sum( TO_NUMBER( session_price , 'L9G999g999.99' )) - 
sum(amount) as due
FROM payments
left join clients on 
clients.client_id = payments.client_id
left join sessions on
sessions.session_id = clients.session_id
where extract(year from payments.date) = $2 and clients.user_id = $1
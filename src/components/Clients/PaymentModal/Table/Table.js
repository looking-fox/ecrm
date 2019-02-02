import React from 'react'
import './Table.css'
import Payment from '../Payment/Payment'

export default function Table(props) {
    const { listData, listDataType, updatePayment, deletePayment, verifyDelete } = props
    return (
        <div className="payment-modal-table">
            {listData.map((e, i) => {
                if (listDataType === "payments") {
                    return (
                        <Payment
                            payment={e}
                            index={i}
                            key={e.payment_id}
                            updatePayment={updatePayment}
                            deletePayment={deletePayment}
                            verifyDelete={verifyDelete} />
                    )
                }
                else if (listDataType === "expenses") {
                    return (
                        <Payment
                            payment={e}
                            index={i}
                            key={e.expense_id}
                            updatePayment={updatePayment}
                            deletePayment={deletePayment}
                            verifyDelete={verifyDelete} />
                    )
                }
                else {
                    return (
                        <Payment
                            payment={e}
                            index={i}
                            key={e.payment_id}
                            updatePayment={updatePayment}
                            deletePayment={deletePayment}
                            verifyDelete={verifyDelete} />
                    )
                }
            })
            }
        </div>
    )
}

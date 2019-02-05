import React from 'react'
import './Table.css'
import Payment from '../Payment/Payment'

export default function Table(props) {
    const { listData, listDataType, updateItem, deleteItem, verifyDelete } = props
    return (
        <div className="payment-modal-table">
            {listData.map((e, i) => {
                if (listDataType === "payments") {
                    return (
                        <Payment
                            item={e}
                            index={i}
                            key={e.payment_id}
                            updateItem={updateItem}
                            deleteItem={deleteItem}
                            verifyDelete={verifyDelete} />
                    )
                }
                else if (listDataType === "expenses") {
                    return (
                        <Payment
                            item={e}
                            index={i}
                            key={e.expense_id}
                            updateItem={updateItem}
                            deleteItem={deleteItem}
                            verifyDelete={verifyDelete} />
                    )
                }
                else {
                    return (
                        <Payment
                            item={e}
                            index={i}
                            key={e.payment_id}
                            updateItem={updateItem}
                            deleteItem={deleteItem}
                            verifyDelete={verifyDelete}
                            showMileage={true} />
                    )
                }
            })
            }
        </div>
    )
}

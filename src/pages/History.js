import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTransaction, deleteTransaction, setError } from '../store/TransactionSlice'; // Adjust the path as needed
import { FaEdit, FaTrash } from 'react-icons/fa';
const History = () => {
    const transactions = useSelector((state) => state.transactions.transactions);
    const error = useSelector((state) => state.transactions.error);
    const dispatch = useDispatch();

    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [formData, setFormData] = useState({});
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // New state for search query

    const handleUpdateClick = (transaction) => {
        setSelectedTransaction(transaction);
        setFormData(transaction);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedTransaction(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (selectedTransaction) {
            try {
                dispatch(updateTransaction(formData));
                handleClosePopup();
            } catch (error) {
                dispatch(setError('Failed to update transaction'));
            }
        }
    };

    const handleDeleteClick = (transaction) => {
        setTransactionToDelete(transaction);
        setShowDeleteConfirmation(true);
    };

    const handleConfirmDelete = () => {
        if (transactionToDelete) {
            try {
                dispatch(deleteTransaction(transactionToDelete.id));
                setShowDeleteConfirmation(false);
                setTransactionToDelete(null);
            } catch (error) {
                dispatch(setError('Failed to delete transaction'));
            }
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
        setTransactionToDelete(null);
    };

    // Search handling
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter transactions based on the search query
    const filteredTransactions = transactions.filter((transaction) =>
        transaction.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.TransactionReports.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="layout">
            <h1 className="w-full text-2xl font-bold mb-6 text-center">سجلات المالية</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="البحث حسب الاسم أو تقارير المعاملات"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            {filteredTransactions.length === 0 ? (
                <p className="text-center">لا يوجد عمليات المالية</p>
            ) : (
                <table className="w-full table-fixed  border-collapse">
                    <thead>
                        <tr className="bg-gray-700 text-white  text-left">
                            <th className="p-3 border-b">اسم</th>
                            <th className="p-3 border-b">نوع</th>
                            <th className="p-3 border-b">تقارير المعاملات</th>
                            <th className="p-3 border-b">البلد المستهدف</th>
                            <th className="p-3 border-b">المبالغ</th>
                            <th className="p-3 border-b"> سعر الصرف (USD)</th>
                            <th className="p-3 border-b">سعر الصرف (LB)</th>
                            <th className="p-3 border-b">مبلغ الدفع (USD)</th>
                            <th className="p-3 border-b">مبلغ الدفع (LB)</th>
                            <th className="p-3 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((transaction, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="p-3 border-b">{transaction.userName}</td>
                                <td className="p-3 border-b">{transaction.transactionType}</td>
                                <td className="p-3 border-b">{transaction.TransactionReports}</td>
                                <td className="p-3 border-b">{transaction.targetCountry}</td>
                                <td className="p-3 border-b">{transaction.amount}</td>
                                <td className="p-3 border-b">{transaction.exchangeRateUs}</td>
                                <td className="p-3 border-b">{transaction.exchangeRateLb}</td>
                                <td className="p-3 border-b">{transaction.PaymentAmountUs} $</td>
                                <td className="p-3 border-b">{transaction.PaymentAmountLb} L.L.</td>
                                <td className="p-3 flex flex-col items-center border-b ">
                                    <button
                                        onClick={() => handleUpdateClick(transaction)}
                                        className="bg-blue-500 text-white p-2 mb-2 rounded-md hover:bg-blue-600 "
                                    >
                                        <div className='lg:hidden'>
                                            <FaEdit className="w-3 h-3" />
                                        </div>
                                        <div className='lg:block hidden'>Update</div>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(transaction)}
                                        className="bg-red-500 self-center p-2 text-white  rounded-md hover:bg-red-600"
                                    >
                                        <div className='lg:block hidden'>Delete</div>
                                        <div className='lg:hidden'>
                                            <FaTrash className="w-3 h-3" />
                                        </div>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showPopup && selectedTransaction && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                        <h2 className="text-xl font-bold mb-4">Update Transaction</h2>
                        <form onSubmit={handleFormSubmit}>
                            {Object.keys(selectedTransaction).map((key) => (
                                <div key={key} className="mb-4">
                                    <label className="block text-gray-700">{key}</label>
                                    <input
                                        type="text"
                                        name={key}
                                        value={formData[key] || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            ))}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleClosePopup}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p className="mb-4">Are you sure you want to delete this transaction?</p>
                        <div className="flex justify-end">
                            <button
                                onClick={handleCancelDelete}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;

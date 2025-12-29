import React, { useState, useEffect, useCallback } from 'react';
import { User, Mail, Smartphone, Layers, Calendar, DollarSign, RefreshCw, X, Check, Eye } from 'lucide-react';

// FIX: Reverted to import.meta.env. This is the correct way to access Vite/modern frontend
// environment variables and avoids the 'process is not defined' error in the browser.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const statusColors = {
    'Pending Review': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Confirmed': 'bg-green-100 text-green-800 border-green-300',
    'Rejected': 'bg-red-100 text-red-800 border-red-300',
};

const CandidatesDashboard = () => {
    const [registrations, setRegistrations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchRegistrations = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Note the use of the new admin route
            const response = await fetch(`${API_BASE_URL}/admin/registrations`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch registrations.');
            }

            setRegistrations(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRegistrations();
    }, [fetchRegistrations]);

    const handleStatusUpdate = async (id, newStatus) => {
        if (isUpdating) return;
        setIsUpdating(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/admin/registrations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentStatus: newStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update status.');
            }

            // Optimistically update the local state without full reload
            setRegistrations(prevRegs => 
                prevRegs.map(reg => 
                    reg._id === id ? { ...reg, paymentStatus: newStatus } : reg
                )
            );

        } catch (err) {
            console.error('Update Error:', err);
            setError(`Could not update status: ${err.message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-indigo-500">Loading candidate data...</div>;
    }

    return (
        <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-extrabold text-gray-900">Candidate Payment Dashboard</h1>
                <button
                    onClick={fetchRegistrations}
                    disabled={isUpdating}
                    className="flex items-center bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
                    Refresh Data
                </button>
            </header>

            {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}

            {registrations.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No candidates have registered yet.</div>
            ) : (
                <div className="space-y-6">
                    {registrations.map((reg) => (
                        <div key={reg._id} className="bg-white shadow-xl rounded-xl p-6 border-l-4" style={{ borderColor: statusColors[reg.paymentStatus].split(' ')[2].replace('border-', '#') }}>
                            
                            {/* Header and Status */}
                            <div className="flex justify-between items-start mb-4 pb-2 border-b">
                                <p className="text-lg font-bold text-gray-800">{reg.courseTitle}</p>
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColors[reg.paymentStatus]}`}>
                                    {reg.paymentStatus}
                                </span>
                            </div>

                            {/* Candidate Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-600">
                                <p className="flex items-center"><User className="w-4 h-4 mr-2 text-indigo-500" /> 
                                    <span className="font-semibold text-gray-800">{reg.candidateName}</span>
                                </p>
                                <p className="flex items-center"><Mail className="w-4 h-4 mr-2 text-indigo-500" /> 
                                    {reg.candidateEmail}
                                </p>
                                <p className="flex items-center"><Smartphone className="w-4 h-4 mr-2 text-indigo-500" /> 
                                    {reg.candidatePhone || 'N/A'}
                                </p>
                                <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-indigo-500" /> 
                                    Registered: {new Date(reg.registrationDate).toLocaleDateString()}
                                </p>
                                <p className="flex items-center"><DollarSign className="w-4 h-4 mr-2 text-indigo-500" /> 
                                    Price: {reg.coursePrice.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                                </p>
                                <p className="flex items-center col-span-1 md:col-span-2"><Layers className="w-4 h-4 mr-2 text-indigo-500" /> 
                                    Course ID: {reg.course}
                                </p>
                            </div>

                            {/* Payment Proof and Actions */}
                            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap justify-between items-center">
                                <a 
                                    href={reg.proofOfPayment} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
                                >
                                    <Eye className="w-4 h-4 mr-1" /> View Proof of Payment
                                </a>

                                <div className="flex space-x-2 mt-2 md:mt-0">
                                    <button
                                        onClick={() => handleStatusUpdate(reg._id, 'Confirmed')}
                                        disabled={reg.paymentStatus === 'Confirmed' || isUpdating}
                                        className="flex items-center bg-green-500 text-white text-xs font-medium py-1.5 px-3 rounded-full hover:bg-green-600 disabled:opacity-50"
                                    >
                                        <Check className="w-4 h-4 mr-1" /> Confirm
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(reg._id, 'Rejected')}
                                        disabled={reg.paymentStatus === 'Rejected' || isUpdating}
                                        className="flex items-center bg-red-500 text-white text-xs font-medium py-1.5 px-3 rounded-full hover:bg-red-600 disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4 mr-1" /> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CandidatesDashboard;
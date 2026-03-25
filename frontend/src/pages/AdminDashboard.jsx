import React, { useState } from 'react';
import { Download, Plus, Search, Edit2, Trash2 } from 'lucide-react';

const MOCK_TURFS = [
    { id: 1, name: 'Green Arena', district: 'Ernakulam', price: 1200 },
    { id: 2, name: 'Trivandrum Football', district: 'Trivandrum', price: 1300 },
];

const MOCK_BOOKINGS = [
    { id: 'PK10234', user: 'Yasir Usman', turf: 'Green Arena', date: '12 Mar 2026', time: '18:00', status: 'CONFIRMED' },
];

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('turfs');

    const exportCSV = () => {
        // Generate CSV mockup
        const headers = "Booking ID,User,Turf,Date,Time,Status\n";
        const rows = MOCK_BOOKINGS.map(b => `${b.id},${b.user},${b.turf},${b.date},${b.time},${b.status}`).join('\n');
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'bookings.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                    Admin Dashboard
                </h1>
            </div>

            <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab('turfs')}
                    className={`px-4 py-2 font-medium rounded-lg transition ${activeTab === 'turfs' ? 'bg-turf-green text-white' : 'text-gray-400 hover:bg-white/5'}`}
                >
                    Manage Turfs
                </button>
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`px-4 py-2 font-medium rounded-lg transition ${activeTab === 'bookings' ? 'bg-turf-green text-white' : 'text-gray-400 hover:bg-white/5'}`}
                >
                    Recent Bookings
                </button>
            </div>

            {activeTab === 'turfs' && (
                <div className="glass-dark border border-white/10 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl text-white font-bold">Turfs Directory</h2>
                        <button className="bg-turf-green text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-500 transition">
                            <Plus size={18} /> Add Turf
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-300">
                            <thead className="text-xs uppercase bg-white/5 text-gray-400">
                                <tr>
                                    <th className="px-6 py-3 rounded-tl-lg">Turn Name</th>
                                    <th className="px-6 py-3">District</th>
                                    <th className="px-6 py-3">Price/Hr</th>
                                    <th className="px-6 py-3 text-right rounded-tr-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_TURFS.map(t => (
                                    <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                        <td className="px-6 py-4 font-bold text-white">{t.name}</td>
                                        <td className="px-6 py-4">{t.district}</td>
                                        <td className="px-6 py-4">₹{t.price}</td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-3">
                                            <button className="text-blue-400 hover:text-blue-300"><Edit2 size={18} /></button>
                                            <button className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'bookings' && (
                <div className="glass-dark border border-white/10 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl text-white font-bold">Booking Records</h2>
                        <button
                            onClick={exportCSV}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10 transition"
                        >
                            <Download size={18} /> Export CSV
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-300">
                            <thead className="text-xs uppercase bg-white/5 text-gray-400">
                                <tr>
                                    <th className="px-6 py-3 rounded-tl-lg">ID</th>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Turf</th>
                                    <th className="px-6 py-3">Date & Time</th>
                                    <th className="px-6 py-3 rounded-tr-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_BOOKINGS.map(b => (
                                    <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                        <td className="px-6 py-4 font-mono text-turf-green">{b.id}</td>
                                        <td className="px-6 py-4 text-white font-medium">{b.user}</td>
                                        <td className="px-6 py-4">{b.turf}</td>
                                        <td className="px-6 py-4">{b.date} / {b.time}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md text-xs font-bold border border-green-500/30">
                                                {b.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

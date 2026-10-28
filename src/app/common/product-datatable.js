"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const ProductTable = ({ columns, data, onEdit, onDelete, onAddImage, onRowClick }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, order: "asc" });
    const [searchTerm, setSearchTerm] = useState("");
    const [sortedData, setSortedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        setSortedData(data);
    }, [data]);

    const sortData = (key) => {
        const order = sortConfig.key === key && sortConfig.order === "asc" ? "desc" : "asc";
        const sorted = [...data].sort((a, b) => {
            const aValue = a[key]?.toString().toLowerCase() || "";
            const bValue = b[key]?.toString().toLowerCase() || "";
            return order === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });
        setSortedData(sorted);
        setSortConfig({ key, order });
    };

    const filteredData = Array.isArray(sortedData)
        ? sortedData.filter((row) =>
            columns?.some((col) =>
                row[col.key]?.toString().toLowerCase().includes(searchTerm?.toLowerCase() || "")
            )
        )
        : [];

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const renderDescription = (value) => {
        if (!value) return '';
        return (
            <div className="max-w-[230px] overflow-hidden text-ellipsis whitespace-nowrap text-[#062c21]" title={value}>
                {value}
            </div>
        );
    };

    return (
        <div className="p-4 mt-6 rounded-md shadow-sm border border-slate-200 bg-white">
            {/* Search */}
            <div className="flex flex-col items-center justify-end mb-4 sm:flex-row">
                <h1 className="flex-1 text-xl font-semibold text-center text-[#062c21] sm:text-left sm:mr-4">
                    Product
                </h1>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 mt-2 border border-slate-300 rounded-md sm:mt-0 sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#062c21]"
                />
            </div>

            {/* desktop Table */}
            <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full border border-collapse border-slate-200">
                    <thead>
                        <tr className="bg-[#062c21]">
                            {(onEdit || onDelete) && (
                                <th className="px-6 py-3 text-amber-300 border border-slate-200">
                                    Actions
                                </th>
                            )}
                            {columns?.map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => sortData(col.key)}
                                    className="px-6 py-3 border border-slate-200 cursor-pointer bg-[#062c21] text-amber-300 hover:bg-[#093d2e] transition-colors"
                                >
                                    <div className="flex items-center justify-center">
                                        {col.label}
                                        {sortConfig.key === col.key && (
                                            <span className="ml-2">
                                                {sortConfig.order === "asc" ? "▲" : "▼"}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((row) => (
                            <tr key={row.id} className="hover:bg-emerald-50/60 transition-colors">
                                {(onEdit || onDelete) && (
                                    <td className="px-6 py-4 text-center border border-slate-200">
                                        <div className="flex items-center justify-center gap-2">
                                            {onEdit && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEdit(row);
                                                    }}
                                                    className="px-4 py-2 text-[#062c21] bg-amber-400 rounded-md hover:bg-amber-500 font-semibold transition"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (row.active) onDelete(row);
                                                    }}
                                                    disabled={!row.active}
                                                    className={`px-4 py-2 rounded-md font-medium transition ${row.active
                                                        ? "bg-rose-600 hover:bg-rose-700 text-white"
                                                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                                        }`}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        onClick={() => onRowClick(row)}
                                        className="px-6 py-4 text-center border border-slate-200 text-[#062c21] cursor-pointer"
                                    >
                                        {col.key === "image" || col.key === "imageUrl" ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onAddImage(row);
                                                }}
                                                className="px-4 py-2 text-amber-300 bg-[#062c21] rounded-md hover:bg-[#093d2e] font-semibold transition"
                                            >
                                                Add Image
                                            </button>
                                        ) : col.key === "username" ? (
                                            <Link
                                                href={`/pages/customer-management/customer-order-activity?username=${row[col.key]}`}
                                                className="text-[#062c21] font-semibold hover:underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {row[col.key]}
                                            </Link>
                                        ) : col.key === "description" ? (
                                            renderDescription(row[col.key])
                                        ) : col.render ? (
                                            col.render(row[col.key], row)
                                        ) : (
                                            row[col.key]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* mobile card table */}
            <div className="space-y-4 md:hidden">
                {currentRows.map((row) => (
                    <div
                        key={row.id}
                        onClick={() => onRowClick(row)}
                        className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm"
                    >
                        {columns.map((col) => (
                            <div key={col.key} className="flex justify-between py-1">
                                <span className="font-medium text-slate-500">{col.label}:</span>
                                <span className="text-right text-[#062c21]">
                                    {col.key === "image" || col.key === "imageUrl" ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAddImage(row);
                                            }}
                                            className="px-3 py-1 text-sm text-amber-300 bg-[#062c21] rounded hover:bg-[#093d2e] font-semibold transition"
                                        >
                                            Add Image
                                        </button>
                                    ) : col.key === "username" ? (
                                        <Link
                                            href={`/pages/customer-management/customer-order-activity?username=${row[col.key]}`}
                                            className="text-[#062c21] font-semibold hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {row[col.key]}
                                        </Link>
                                    ) : col.key === "description" ? (
                                        renderDescription(row[col.key])
                                    ) : col.render ? (
                                        col.render(row[col.key], row)
                                    ) : (
                                        row[col.key]
                                    )}
                                </span>
                            </div>
                        ))}

                        {/* Action Buttons */}
                        {(onEdit || onDelete) && (
                            <div className="flex justify-end gap-2 mt-4">
                                {onEdit && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(row);
                                        }}
                                        className="px-3 py-1 text-sm text-[#062c21] bg-amber-400 rounded hover:bg-amber-500 font-semibold transition"
                                    >
                                        Edit
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (row.active) onDelete(row);
                                        }}
                                        disabled={!row.active}
                                        className={`px-3 py-1 text-sm rounded font-medium transition ${row.active
                                            ? "bg-rose-600 hover:bg-rose-700 text-white"
                                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                            }`}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* No data */}
            {filteredData.length === 0 && (
                <p className="mt-4 text-center text-slate-500">No data found!</p>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center mt-4 space-x-8 text-[#062c21]">
                <div className="flex items-center space-x-2">
                    <span>Rows per page:</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="p-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#062c21]"
                    >
                        {[5, 10, 25].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <span>
                        {indexOfFirstRow + 1} -{" "}
                        {indexOfLastRow > filteredData.length
                            ? filteredData.length
                            : indexOfLastRow}{" "}
                        of {filteredData.length}
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 border rounded-md transition ${currentPage === 1
                            ? "text-slate-400 border-slate-200 bg-slate-50 cursor-not-allowed"
                            : "border-slate-300 hover:bg-emerald-50"
                            }`}
                    >
                        ◄
                    </button>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 border rounded-md transition ${currentPage === totalPages
                            ? "text-slate-400 border-slate-200 bg-slate-50 cursor-not-allowed"
                            : "border-slate-300 hover:bg-emerald-50"
                            }`}
                    >
                        ►
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductTable;
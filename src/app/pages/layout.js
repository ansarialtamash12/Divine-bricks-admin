"use client"
import Sidebar from "./sidebar/page"
import Navbar from "@/app/pages/navbar/page";
import { ToastContainer } from "react-toastify";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex flex-col w-full h-dvh overflow-hidden">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />
            <header className="fixed top-0 left-0 w-full bg-white border-b border-emerald-900/10 z-[99]">
                <Navbar />
            </header>
            <main className="flex min-w-0 min-h-0 pt-[60px]">
                <Sidebar />
                <div className="flex-1 min-w-0 p-3 overflow-auto sm:p-4 md:p-6 bg-[#faf9f6] h-[calc(100dvh-60px)]">
                    {children}
                </div>
            </main>
        </div>
    );
}
"use client";
import React from "react";
import { useSelector } from "react-redux";

const SubmenuPage = () => {
  const selectedPage = useSelector((state) => state.sidebar.selectedPage);

  if (!selectedPage) {
    return (
      <div className="p-4 sm:p-5 md:p-6 text-center text-slate-500 text-sm sm:text-base md:text-lg">
        Please select a submenu from the sidebar.
      </div>
    );
  }
  return (
    <div className="p-4 sm:p-5 md:p-6 bg-white rounded-lg shadow-md border border-slate-200/80">
      <h2 className="text-xl sm:text-2xl font-bold text-[#062c21]">
        {selectedPage.subMenuName}
      </h2>
      <p className="mt-1 sm:mt-2 text-slate-600 text-sm sm:text-base">
        This is the <strong className="text-[#062c21]">{selectedPage.subMenuName}</strong> page. Content for this section will go here.
      </p>
    </div>
  );
};

export default SubmenuPage;
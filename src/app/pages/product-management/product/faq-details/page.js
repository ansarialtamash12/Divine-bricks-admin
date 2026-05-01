import React from 'react'

const FaqDetails = ({ faqList, activeTab }) => {
  return (
    <div>
      {activeTab === 'faq' && (
        <div className="flex justify-center">
          {/* Desktop Table View */}
          <div className="hidden w-full p-4 bg-white border border-gray-200 shadow-md rounded-xl md:block md:w-3/4 lg:w-1/2">
            {faqList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-1/3 px-4 py-3 font-semibold text-gray-700">Title</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Description</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Faq Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faqList.map((faq, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3 text-gray-800">{faq.title}</td>
                        <td
                          className="max-w-xs px-6 py-4 prose text-gray-600 border-b"
                          dangerouslySetInnerHTML={{ __html: faq.description }}
                        ></td>
                        <td className="px-4 py-3 text-gray-600 whitespace-pre-line">{faq.faqType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500">No FAQs available.</div>
            )}
          </div>

          {/* Mobile Card View */}
          <div className="block w-full p-2 space-y-4 md:hidden">
            {faqList.length > 0 ? (
              faqList.map((faq, index) => (
                <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow">
                  <h4 className="mb-2 text-sm font-semibold text-gray-700">Title</h4>
                  <p className="mb-2 text-sm text-gray-800">{faq.title}</p>

                  <h4 className="mb-2 text-sm font-semibold text-gray-700">Description</h4>
                  <div
                    className="mb-2 text-sm prose text-gray-600"
                    dangerouslySetInnerHTML={{ __html: faq.description }}
                  ></div>

                  <h4 className="mb-2 text-sm font-semibold text-gray-700">Faq Type</h4>
                  <p className="text-sm text-gray-600">{faq.faqType}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No FAQs available.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FaqDetails


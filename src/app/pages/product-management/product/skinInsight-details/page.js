import React from 'react';

const SkinInsightDetails = ({ skinInsightList = [], activeTab }) => {
  return (
    <div>
      {activeTab === 'skinInsight' && (
        <div className="mt-4">
          <div className="flex items-center justify-center">
            <div className="w-full p-4 bg-white border border-gray-200 shadow-md md:w-1/2 rounded-xl">
              {Array.isArray(skinInsightList) && skinInsightList.length > 0 ? (
                <>
                  <div className="hidden md:block">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-center border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="w-1/3 px-4 py-3 font-semibold text-gray-700">Title</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Description</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Skin Type</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Skin Sensitive</th>
                          </tr>
                        </thead>
                        <tbody>
                          {skinInsightList.map((skinInsight, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-4 py-3 text-gray-800">{skinInsight.age}</td>
                              <td className="px-4 py-3 text-gray-600 whitespace-pre-line">{skinInsight.gender}</td>
                              <td className="px-4 py-3 text-gray-600 whitespace-pre-line">{skinInsight.skintype}</td>
                              <td className="px-4 py-3 text-gray-600 whitespace-pre-line">{skinInsight.skinSensitive}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="block md:hidden">
                    <div className="grid grid-cols-1 gap-4">
                      {skinInsightList.map((skinInsight, index) => (
                        <div
                          key={index}
                          className="flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow-md"
                        >
                          <div className="mb-2">
                            <span className="font-semibold text-gray-700">Title:</span>{' '}
                            <span className="text-gray-800">{skinInsight.age}</span>
                          </div>
                          <div className="mb-2">
                            <span className="font-semibold text-gray-700">Description:</span>{' '}
                            <span className="text-gray-800">{skinInsight.gender}</span>
                          </div>
                          <div className="mb-2">
                            <span className="font-semibold text-gray-700">Skin Type:</span>{' '}
                            <span className="text-gray-800">{skinInsight.skintype}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Skin Sensitive:</span>{' '}
                            <span className="text-gray-800">{skinInsight.skinSensitive}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </>
              ) : (
                <div className="text-center text-gray-500">No SkinInsightDetails available.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkinInsightDetails;

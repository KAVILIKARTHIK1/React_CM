import { useState, useEffect } from 'react';
import {  Save, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function Admin() {
  const [availableColumns, setAvailableColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [columnsRes, activeColsRes] = await Promise.all([
          axios.get('http://localhost:9000/api/table-columns'),
          axios.get('http://localhost:9000/api/table-columns/active')
        ]);

        setAvailableColumns(columnsRes.data);
        setSelectedColumns(activeColsRes.data);

        if (activeColsRes.data.length > 0) {
          const memberRes = await axios.post('http://localhost:9000/api/member-data', { columns: activeColsRes.data });
          setMemberData(memberRes.data);
        }
      } catch (error) {
        console.error('Init error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleColumnToggle = (col) => {
    setSelectedColumns(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const saveColumnPreferences = async() => {
    setSaveLoading(true);
    //console.log("selectedColumns : ",selectedColumns)
    try {
      await axios.post('http://localhost:9000/api/table-columns/save', { columns: selectedColumns });
      const memberRes = await axios.post('http://localhost:9000/api/member-data', { columns: selectedColumns });
      setMemberData(memberRes.data);
      alert('Column preferences saved!');
    } catch (error) {
      console.error('Save failed:', error.message);
      alert('Failed to save preferences');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3 bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Select Columns</h2>
            <button
              onClick={saveColumnPreferences}
              disabled={saveLoading}
              className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {saveLoading ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-1 h-4 w-4" />
              )}
              Save
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {availableColumns.map((col) => (
                <label key={col} className="flex items-center space-x-2 cursor-pointer">
                  <div
                    className={`w-5 h-5 border rounded flex items-center justify-center ${
                      selectedColumns.includes(col) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}
                  />
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selectedColumns.includes(col)}
                    onChange={() => handleColumnToggle(col)}
                  />
                  <span>{col}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-9 bg-white p-4 rounded shadow overflow-x-auto" style={{ display: 'none' }}>
          <h2 className="text-lg font-semibold mb-4">Member Data</h2>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : memberData.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {selectedColumns.map((col) => (
                    <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {memberData.map((member, idx) => (
                  <tr key={idx} className="bg-white hover:bg-gray-50">
                    {selectedColumns.map((col) => (
                      <td key={col} className="px-6 py-4 text-sm text-gray-900">{member[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No data available</div>
          )}
        </div>
      </div>
    </div>
  );
}

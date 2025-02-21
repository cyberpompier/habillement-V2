import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quvdxjxszquqqcvesntn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmR4anhzenF1cXFjdmVzbnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTk3MTQsImV4cCI6MjA1NTYzNTcxNH0.MB_f2XGYYNwV0CSIjz4W7_KoyNNTkeFMfJZee-N2vKw';
const supabase = createClient(supabaseUrl, supabaseKey);

function Personal() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('personnel')
          .select('nom, prenom, grade, photo');

        if (error) {
          setError(error);
        } else {
          setData(data || []);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4">Error: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Personal Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4 relative">
            <div className="absolute top-2 right-2 w-12 h-12 rounded-full overflow-hidden">
              <img src={item.photo} alt={`${item.prenom} ${item.nom}`} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center">
              <strong className="mr-2 text-gray-700">Nom:</strong>
              <span className="text-gray-600">{item.nom}</span>
            </div>
            <div className="flex items-center">
              <strong className="mr-2 text-gray-700">Prenom:</strong>
              <span className="text-gray-600">{item.prenom}</span>
            </div>
            <div className="flex items-center">
              <strong className="mr-2 text-gray-700">Grade:</strong>
              <span className="text-gray-600">{item.grade}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Personal;

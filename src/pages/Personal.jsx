import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quvdxjxszquqqcvesntn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmR4anhzenF1cXFjdmVzbnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTk3MTQsImV4cCI6MjA1NTYzNTcxNH0.MB_f2XGYYNwV0CSIjz4W7_KoyNNTkeFMfJZee-N2vKw';
const supabase = createClient(supabaseUrl, supabaseKey);

function Personal() {
  const [personnelList, setPersonnelList] = useState([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [personnelDetails, setPersonnelDetails] = useState(null);
  const [assignedArticles, setAssignedArticles] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const { data, error } = await supabase.from('personnel').select('*');
        if (error) {
          console.error('Erreur lors de la récupération du personnel:', error);
        } else {
          setPersonnelList(data || []);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchPersonnel();
  }, []);

  const handlePersonnelSelect = async (id) => {
    setSelectedPersonnel(id);
    setPersonnelDetails(null); // Clear previous details
    setAssignedArticles([]); // Clear previous articles

    // Fetch personnel details
    try {
      const { data: personnelData, error: personnelError } = await supabase
        .from('personnel')
        .select('*')
        .eq('id', id)
        .single();

      if (personnelError) {
        console.error('Erreur lors de la récupération des détails du personnel:', personnelError);
      } else {
        setPersonnelDetails(personnelData);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }

    // Fetch assigned articles from the 'Masse' table
    try {
      const { data, error } = await supabase
        .from('Masse')
        .select('habillement(*)')
        .eq('personnel_id', id);

      if (error) {
        console.error('Erreur lors de la récupération des articles assignés:', error);
      } else {
        // Vérifiez si les données sont correctement récupérées
        console.log("Assigned articles data:", data);
        setAssignedArticles(data || []);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }

    setShowDetailsModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setPersonnelDetails(null);
    setAssignedArticles([]);
    setSelectedPersonnel(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Données du Personnel</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {personnelList.map((personnel) => (
          <div
            key={personnel.id}
            className="bg-white rounded-lg shadow-md p-4 relative cursor-pointer"
            onClick={() => handlePersonnelSelect(personnel.id)}
          >
            <div className="absolute top-2 right-2 w-12 h-12 rounded-full overflow-hidden">
              <img
                src={personnel.photo}
                alt={`${personnel.prenom} ${personnel.nom}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center">
              <strong className="mr-2 text-gray-700">Nom:</strong>
              <span className="text-gray-600">{personnel.nom}</span>
            </div>
            <div className="flex items-center">
              <strong className="mr-2 text-gray-700">Prenom:</strong>
              <span className="text-gray-600">{personnel.prenom}</span>
            </div>
            <div className="flex items-center">
              <strong className="mr-2 text-gray-700">Grade:</strong>
              <span className="text-gray-600">{personnel.grade}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal pour les détails du personnel */}
      {showDetailsModal && personnelDetails && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 w-96">
            <h3 className="text-lg font-semibold mb-2">Détails du Personnel</h3>
            <p>Nom: {personnelDetails.nom}</p>
            <p>Prenom: {personnelDetails.prenom}</p>
            <p>Grade: {personnelDetails.grade}</p>
            <p>Email: {personnelDetails.email}</p>
            <p>Caserne: {personnelDetails.caserne}</p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Articles Assignés</h3>
            {assignedArticles.length > 0 ? (
              <ul>
                {assignedArticles.map((article) => (
                  <li key={article.habillement.id} className="p-2 rounded-md hover:bg-gray-100">
                    {article.habillement.article} - {article.habillement.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun article assigné à ce personnel.</p>
            )}

            <button className="bg-gray-200 rounded-md p-2 mt-4" onClick={handleCloseModal}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Personal;

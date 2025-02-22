import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quvdxjxszquqqcvesntn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmR4anhzenF1cXFjdmVzbnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTk3MTQsImV4cCI6MjA1NTYzNTcxNH0.MB_f2XGYYNwV0CSIjz4W7_KoyNNTkeFMfJZee-N2vKw';
const supabase = createClient(supabaseUrl, supabaseKey);

function Parametres() {
  const [showEditPersonnel, setShowEditPersonnel] = useState(false);
  const [showEditHabillement, setShowEditHabillement] = useState(false);
  const [showAffectationPersonnel, setShowAffectationPersonnel] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [personnelList, setPersonnelList] = useState([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [personnelNom, setPersonnelNom] = useState('');
  const [personnelPrenom, setPersonnelPrenom] = useState('');
  const [personnelGrade, setPersonnelGrade] = useState('');
  const [personnelEmail, setPersonnelEmail] = useState('');
  const [personnelCaserne, setPersonnelCaserne] = useState('');
  const [personnelPhoto, setPersonnelPhoto] = useState('');

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const { data, error } = await supabase.from('personnel').select('*');
        if (error) {
          console.error('Erreur lors de la récupération du personnel:', error);
        } else {
          // Sort personnelList alphabetically by 'nom'
          data.sort((a, b) => a.nom.localeCompare(b.nom));
          setPersonnelList(data || []);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchPersonnel();
  }, []);

  const handleEditPersonnel = async (id) => {
    const { data, error } = await supabase
      .from('personnel')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération des détails du personnel:', error);
    } else {
      setSelectedPersonnel(data);
      setPersonnelNom(data.nom);
      setPersonnelPrenom(data.prenom);
      setPersonnelGrade(data.grade);
      setPersonnelEmail(data.email);
      setPersonnelCaserne(data.caserne);
      setPersonnelPhoto(data.photo);
      setShowEditPopup(true);
    }
  };

  const handleUpdatePersonnel = async (e) => {
    e.preventDefault();

    // Validation: Ensure all required fields are filled
    if (!personnelNom || !personnelPrenom || !personnelGrade || !personnelEmail) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Additional validation for email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(personnelEmail)) {
      alert("Veuillez entrer une adresse email valide.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('personnel')
        .update({
          nom: personnelNom,
          prenom: personnelPrenom,
          grade: personnelGrade,
          email: personnelEmail,
          caserne: personnelCaserne,
          photo: personnelPhoto,
        })
        .eq('id', selectedPersonnel.id);

      if (error) {
        console.error('Erreur lors de la mise à jour du personnel:', error);
        alert(`Erreur lors de la mise à jour du personnel: ${error.message}`);
      } else {
        console.log('Personnel mis à jour avec succès:', data);
        setShowEditPopup(false);
        setSelectedPersonnel(null);
        // Refresh personnel list
        fetchPersonnel();
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du personnel:', err);
      alert("Une erreur inattendue s'est produite lors de la mise à jour du personnel.");
    }
  };

  const handleDeletePersonnel = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce personnel ?")) {
      try {
        const { data, error } = await supabase
          .from('personnel')
          .delete()
          .eq('id', selectedPersonnel.id);

        if (error) {
          console.error('Erreur lors de la suppression du personnel:', error);
          alert(`Erreur lors de la suppression du personnel: ${error.message}`);
        } else {
          console.log('Personnel supprimé avec succès:', data);
          setShowEditPopup(false);
          setSelectedPersonnel(null);
          // Refresh personnel list
          fetchPersonnel();
        }
      } catch (err) {
        console.error('Erreur lors de la suppression du personnel:', err);
        alert("Une erreur inattendue s'est produite lors de la suppression du personnel.");
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Paramètres</h2>

      <div className="flex flex-col items-center space-y-4">
        <button
          className="bg-ios-blue text-white rounded-md p-2 w-64"
          onClick={() => setShowEditPersonnel(true)}
        >
          Ajouter Personnel
        </button>
        <button
          className="bg-ios-blue text-white rounded-md p-2 w-64"
          onClick={() => setShowEditHabillement(true)}
        >
          Ajouter Habillement
        </button>
        <button
          className="bg-ios-blue text-white rounded-md p-2 w-64"
          onClick={() => setShowAffectationPersonnel(true)}
        >
          Affectation Personnel
        </button>
        <button
          className="bg-green-500 text-white rounded-md p-2 w-64"
          onClick={() => setShowEditPopup(true)}
        >
          Edition Personnel
        </button>
      </div>

      {showEditPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 w-96">
            <h3 className="text-lg font-semibold mb-2">Modifier Personnel</h3>
            <select
              onChange={(e) => handleEditPersonnel(e.target.value)}
              className="border rounded-md p-1 mb-4"
            >
              <option value="">Sélectionner un personnel</option>
              {personnelList.map((personnel) => (
                <option key={personnel.id} value={personnel.id}>
                  {personnel.nom} {personnel.prenom}
                </option>
              ))}
            </select>

            {selectedPersonnel && (
              <form onSubmit={handleUpdatePersonnel} className="flex flex-col space-y-2">
                <label>Nom:</label>
                <input
                  type="text"
                  value={personnelNom}
                  onChange={(e) => setPersonnelNom(e.target.value)}
                  className="border rounded-md p-1"
                  required
                />
                <label>Prenom:</label>
                <input
                  type="text"
                  value={personnelPrenom}
                  onChange={(e) => setPersonnelPrenom(e.target.value)}
                  className="border rounded-md p-1"
                  required
                />
                <label>Grade:</label>
                <input
                  type="text"
                  value={personnelGrade}
                  onChange={(e) => setPersonnelGrade(e.target.value)}
                  className="border rounded-md p-1"
                  required
                />
                <label>Email:</label>
                <input
                  type="email"
                  value={personnelEmail}
                  onChange={(e) => setPersonnelEmail(e.target.value)}
                  className="border rounded-md p-1"
                  required
                />
                <label>Caserne:</label>
                <input
                  type="text"
                  value={personnelCaserne}
                  onChange={(e) => setPersonnelCaserne(e.target.value)}
                  className="border rounded-md p-1"
                />
                <label>Photo URL:</label>
                <input
                  type="text"
                  value={personnelPhoto}
                  onChange={(e) => setPersonnelPhoto(e.target.value)}
                  className="border rounded-md p-1"
                />
                <button type="submit" className="bg-ios-blue text-white rounded-md p-2">
                  Mettre à jour
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white rounded-md p-2"
                  onClick={handleDeletePersonnel}
                >
                  Supprimer
                </button>
              </form>
            )}
            <button className="bg-gray-200 rounded-md p-2 mt-4" onClick={() => setShowEditPopup(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Parametres;

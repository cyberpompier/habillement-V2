import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quvdxjxszquqqcvesntn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmR4anhzenF1cXFjdmVzbnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTk3MTQsImV4cCI6MjA1NTYzNTcxNH0.MB_f2XGYYNwV0CSIjz4W7_KoyNNTkeFMfJZee-N2vKw';
const supabase = createClient(supabaseUrl, supabaseKey);

function Parametres() {
  const [showEditPersonnel, setShowEditPersonnel] = useState(false);
  const [showEditHabillement, setShowEditHabillement] = useState(false);
  const [showAffectationPersonnel, setShowAffectationPersonnel] = useState(false);
  const [personnelList, setPersonnelList] = useState([]);
  const [habillementList, setHabillementList] = useState([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [assignedArticles, setAssignedArticles] = useState([]);
  const [personnelDetails, setPersonnelDetails] = useState(null);

  // State for affectation form
  const [affectationPersonnelId, setAffectationPersonnelId] = useState('');
  const [affectationArticleId, setAffectationArticleId] = useState('');

  // State for personnel form
  const [personnelNom, setPersonnelNom] = useState('');
  const [personnelPrenom, setPersonnelPrenom] = useState('');
  const [personnelGrade, setPersonnelGrade] = useState('');
  const [personnelPhoto, setPersonnelPhoto] = useState('');
  const [personnelEmail, setPersonnelEmail] = useState('');
  const [personnelCaserne, setPersonnelCaserne] = useState('');

  // State for habillement form
  const [habillementArticle, setHabillementArticle] = useState('');
  const [habillementDescription, setHabillementDescription] = useState('');
  const [habillementTaille, setHabillementTaille] = useState('');
  const [habillementCode, setHabillementCode] = useState('');
  const [habillementImage, setHabillementImage] = useState('');

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

    const fetchHabillement = async () => {
      try {
        const { data, error } = await supabase.from('habillement').select('*');
        if (error) {
          console.error('Erreur lors de la récupération de l\'habillement:', error);
        } else {
          setHabillementList(data || []);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchPersonnel();
    fetchHabillement();
  }, []);

  const handlePersonnelSelect = async (id) => {
    setSelectedPersonnel(id);
    await fetchPersonnelDetailsAndArticles(id);
  };

  const fetchPersonnelDetailsAndArticles = async (id) => {
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
        // Extract habillement data from the Masse table
        const assignedHabillement = data.map(item => item.habillement);
        setAssignedArticles(assignedHabillement || []);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const handlePersonnelSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., add to Supabase)
    try {
      const { data, error } = await supabase
        .from('personnel')
        .insert([
          {
            nom: personnelNom,
            prenom: personnelPrenom,
            grade: personnelGrade,
            photo: personnelPhoto,
            email: personnelEmail,
            caserne: personnelCaserne,
          },
        ]);

      if (error) {
        console.error('Erreur lors de l\'ajout du personnel:', error);
        alert('Impossible d\'ajouter le personnel.');
      } else {
        console.log('Personnel ajouté avec succès:', data);
        // Clear the form
        setPersonnelNom('');
        setPersonnelPrenom('');
        setPersonnelGrade('');
        setPersonnelPhoto('');
        setPersonnelEmail('');
        setPersonnelCaserne('');
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout du personnel:', err);
      alert('Une erreur inattendue s\'est produite.');
    }
    setShowEditPersonnel(false); // Close the popup after submission
  };

  const handleHabillementSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., add to Supabase)
    try {
      const { data, error } = await supabase
        .from('habillement')
        .insert([
          {
            article: habillementArticle,
            description: habillementDescription,
            code: habillementCode,
            taille: habillementTaille,
            image: habillementImage,
          },
        ]);

      if (error) {
        console.error('Erreur lors de l\'ajout de l\'habillement:', error);
        alert('Impossible d\'ajouter l\'habillement.');
      } else {
        console.log('Habillement ajouté avec succès:', data);
        // Clear the form
        setHabillementArticle('');
        setHabillementDescription('');
        setHabillementTaille('');
        setHabillementCode('');
        setHabillementImage('');
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'habillement:', err);
      alert('Une erreur inattendue s\'est produite.');
    }
    setShowEditHabillement(false); // Close the popup after submission
  };

  const handleAffectationSubmit = async (e) => {
    e.preventDefault();

    try {
      // Insert a new entry into the 'Masse' table
      const { data, error } = await supabase
        .from('Masse')
        .insert([
          {
            personnel_id: affectationPersonnelId,
            habillement_id: affectationArticleId,
          },
        ]);

      if (error) {
        console.error('Erreur lors de l\'affectation de l\'habillement:', error);
        alert('Impossible d\'affecter l\'habillement.');
      } else {
        console.log('Habillement affecté avec succès:', data);
        alert('Habillement affecté avec succès!');

        // After successful affectation, refetch the personnel details and assigned articles
        await fetchPersonnelDetailsAndArticles(affectationPersonnelId);
      }
    } catch (err) {
      console.error('Erreur lors de l\'affectation de l\'habillement:', err);
      alert('Une erreur inattendue s\'est produite.');
    }

    setShowAffectationPersonnel(false); // Close the popup after submission
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
      </div>

      {showEditPersonnel && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 w-96">
            <h3 className="text-lg font-semibold mb-2">Ajouter Personnel</h3>
            <form onSubmit={handlePersonnelSubmit} className="flex flex-col space-y-2">
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
              <label>Photo URL:</label>
              <input
                type="text"
                value={personnelPhoto}
                onChange={(e) => setPersonnelPhoto(e.target.value)}
                className="border rounded-md p-1"
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
              <button type="submit" className="bg-ios-blue text-white rounded-md p-2">
                Ajouter Personnel
              </button>
            </form>
            <button className="bg-gray-200 rounded-md p-2 mt-4" onClick={() => setShowEditPersonnel(false)}>Fermer</button>
          </div>
        </div>
      )}

      {showEditHabillement && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 w-96">
            <h3 className="text-lg font-semibold mb-2">Ajouter Habillement</h3>
            <form onSubmit={handleHabillementSubmit} className="flex flex-col space-y-2">
              <label>Article:</label>
              <input
                type="text"
                value={habillementArticle}
                onChange={(e) => setHabillementArticle(e.target.value)}
                className="border rounded-md p-1"
                required
              />
              <label>Description:</label>
              <input
                type="text"
                value={habillementDescription}
                onChange={(e) => setHabillementDescription(e.target.value)}
                className="border rounded-md p-1"
                required
              />
              <label>Taille:</label>
              <input
                type="text"
                value={habillementTaille}
                onChange={(e) => setHabillementTaille(e.target.value)}
                className="border rounded-md p-1"
                required
              />
              <label>Code:</label>
              <input
                type="text"
                value={habillementCode}
                onChange={(e) => setHabillementCode(e.target.value)}
                className="border rounded-md p-1"
                required
              />
              <label>Image URL:</label>
              <input
                type="text"
                value={habillementImage}
                onChange={(e) => setHabillementImage(e.target.value)}
                className="border rounded-md p-1"
                required
              />
              <button type="submit" className="bg-ios-blue text-white rounded-md p-2">
                Ajouter Habillement
              </button>
            </form>
            <button className="bg-gray-200 rounded-md p-2 mt-4" onClick={() => setShowEditHabillement(false)}>Fermer</button>
          </div>
        </div>
      )}

      {showAffectationPersonnel && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 w-96">
            <h3 className="text-lg font-semibold mb-2">Affectation Personnel</h3>
            <form onSubmit={handleAffectationSubmit} className="flex flex-col space-y-2">
              <label>Personnel:</label>
              <select
                value={affectationPersonnelId}
                onChange={(e) => setAffectationPersonnelId(e.target.value)}
                className="border rounded-md p-1"
                required
              >
                <option value="">Sélectionner un personnel</option>
                {personnelList.map((personnel) => (
                  <option key={personnel.id} value={personnel.id}>
                    {personnel.nom} {personnel.prenom}
                  </option>
                ))}
              </select>

              <label>Article:</label>
              <select
                value={affectationArticleId}
                onChange={(e) => setAffectationArticleId(e.target.value)}
                className="border rounded-md p-1"
                required
              >
                <option value="">Sélectionner un article</option>
                {habillementList.map((habillement) => (
                  <option key={habillement.id} value={habillement.id}>
                    {habillement.article} - {habillement.description}
                  </option>
                ))}
              </select>

              <button type="submit" className="bg-ios-blue text-white rounded-md p-2">
                Affecter
              </button>
            </form>
            <button className="bg-gray-200 rounded-md p-2 mt-4" onClick={() => setShowAffectationPersonnel(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Parametres;

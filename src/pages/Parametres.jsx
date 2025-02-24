import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quvdxjxszquqqcvesntn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmR4anhzenF1cXFjdmVzbnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTk3MTQsImV4cCI6MjA1NTYzNTcxNH0.MB_f2XGYYNwV0CSIjz4W7_KoyNNTkeFMfJZee-N2vKw';
const supabase = createClient(supabaseUrl, supabaseKey);

function Parametres() {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showAddPersonnel, setShowAddPersonnel] = useState(false);
  const [showAddHabillement, setShowAddHabillement] = useState(false);
  const [showAffectHabillement, setShowAffectHabillement] = useState(false);
  const [showEditHabillementPopup, setShowEditHabillementPopup] = useState(false);
  const [personnelList, setPersonnelList] = useState([]);
  const [newPersonnelNom, setNewPersonnelNom] = useState('');
  const [newPersonnelPrenom, setNewPersonnelPrenom] = useState('');
  const [newPersonnelGrade, setNewPersonnelGrade] = useState('');
  const [newPersonnelEmail, setNewPersonnelEmail] = useState('');
  const [newPersonnelCaserne, setNewPersonnelCaserne] = useState('');
  const [newPersonnelPhoto, setNewPersonnelPhoto] = useState('');
  const [addError, setAddError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [personnelNom, setPersonnelNom] = useState('');
  const [personnelPrenom, setPersonnelPrenom] = useState('');
  const [personnelGrade, setPersonnelGrade] = useState('');
  const [personnelEmail, setPersonnelEmail] = useState('');
  const [personnelCaserne, setPersonnelCaserne] = useState('');
  const [personnelPhoto, setPersonnelPhoto] = useState('');

  // Habillement state variables
  const [newHabillementArticle, setNewHabillementArticle] = useState('');
  const [newHabillementDescription, setNewHabillementDescription] = useState('');
  const [newHabillementCode, setNewHabillementCode] = useState('');
  const [newHabillementTaille, setNewHabillementTaille] = useState('');
  const [newHabillementImage, setNewHabillementImage] = useState('');
  const [addHabillementError, setAddHabillementError] = useState('');
  const [habillementList, setHabillementList] = useState([]);

  // Edit Habillement state variables
  const [selectedHabillement, setSelectedHabillement] = useState(null);
  const [habillementArticle, setHabillementArticle] = useState('');
  const [habillementDescription, setHabillementDescription] = useState('');
  const [habillementCode, setHabillementCode] = useState('');
  const [habillementTaille, setHabillementTaille] = useState('');
  const [habillementImage, setHabillementImage] = useState('');
  const [editHabillementError, setEditHabillementError] = useState('');

  // Affect Habillement state variables
  const [selectedPersonnelId, setSelectedPersonnelId] = useState('');
  const [selectedHabillementId, setSelectedHabillementId] = useState('');
  const [newMasseCode, setNewMasseCode] = useState('');
  const [affectHabillementError, setAffectHabillementError] = useState('');

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const { data, error } = await supabase.from('personnel').select('*');
        if (error) {
          console.error('Erreur lors de la récupération du personnel:', error);
        } else {
          data.sort((a, b) => a.nom.localeCompare(b.nom));
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

  const handleAddPersonnel = async (e) => {
    e.preventDefault();
    setAddError('');

    if (!newPersonnelNom || !newPersonnelPrenom || !newPersonnelGrade || !newPersonnelEmail) {
      setAddError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newPersonnelEmail)) {
      setAddError("Veuillez entrer une adresse email valide.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('personnel')
        .insert([
          {
            nom: newPersonnelNom,
            prenom: newPersonnelPrenom,
            grade: newPersonnelGrade,
            email: newPersonnelEmail,
            caserne: newPersonnelCaserne,
            photo: newPersonnelPhoto || 'https://emojis.wiki/emoji-pics/apple/man-firefighter-apple.png',
          },
        ])
        .select();

      if (error) {
        console.error('Erreur lors de l\'ajout du personnel:', error);
        setAddError(`Erreur lors de l'ajout du personnel: ${error.message}`);
      } else {
        console.log('Personnel ajouté avec succès:', data);
        setShowAddPersonnel(false);
        setNewPersonnelNom('');
        setNewPersonnelPrenom('');
        setNewPersonnelGrade('');
        setNewPersonnelEmail('');
        setNewPersonnelCaserne('');
        setNewPersonnelPhoto('');
        fetchPersonnel();
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout du personnel:', err);
      setAddError("Une erreur inattendue s'est produite lors de l'ajout du personnel.");
    }
  };

  const handleAddHabillement = async (e) => {
    e.preventDefault();
    setAddHabillementError('');

    if (!newHabillementArticle || !newHabillementDescription || !newHabillementCode || !newHabillementTaille) {
      setAddHabillementError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('habillement')
        .insert([
          {
            article: newHabillementArticle,
            description: newHabillementDescription,
            code: newHabillementCode,
            taille: newHabillementTaille,
            image: newHabillementImage,
          },
        ])
        .select();

      if (error) {
        console.error('Erreur lors de l\'ajout de l\'habillement:', error);
        setAddHabillementError(`Erreur lors de l'ajout de l'habillement: ${error.message}`);
      } else {
        console.log('Habillement ajouté avec succès:', data);
        setShowAddHabillement(false);
        setNewHabillementArticle('');
        setNewHabillementDescription('');
        setNewHabillementCode('');
        setNewHabillementTaille('');
        setNewHabillementImage('');
        fetchHabillement();
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'habillement:', err);
      setAddHabillementError("Une erreur inattendue s'est produite lors de l'ajout de l'habillement.");
    }
  };

  const handleAffectHabillement = async (e) => {
    e.preventDefault();
    setAffectHabillementError('');

    if (!selectedPersonnelId || !selectedHabillementId || !newMasseCode) {
      setAffectHabillementError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('Masse')
        .insert([
          {
            personnel_id: selectedPersonnelId,
            habillement_id: selectedHabillementId,
            code: newMasseCode,
          },
        ])
        .select();

      if (error) {
        console.error('Erreur lors de l\'affectation de l\'habillement:', error);
        setAffectHabillementError(`Erreur lors de l'affectation de l'habillement: ${error.message}`);
      } else {
        console.log('Habillement affecté avec succès:', data);
        setShowAffectHabillement(false);
        setSelectedPersonnelId('');
        setSelectedHabillementId('');
        setNewMasseCode('');
      }
    } catch (err) {
      console.error('Erreur lors de l\'affectation de l\'habillement:', err);
      setAffectHabillementError("Une erreur inattendue s'est produite lors de l'affectation de l'habillement.");
    }
  };

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

  const handleEditHabillement = async (id) => {
    const { data, error } = await supabase
      .from('habillement')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération des détails de l\'habillement:', error);
    } else {
      setSelectedHabillement(data);
      setHabillementArticle(data.article);
      setHabillementDescription(data.description);
      setHabillementCode(data.code);
      setHabillementTaille(data.taille);
      setHabillementImage(data.image);
      setShowEditHabillementPopup(true);
    }
  };

  const handleUpdateHabillement = async (e) => {
    e.preventDefault();
    setEditHabillementError('');

    if (!habillementArticle || !habillementDescription || !habillementCode || !habillementTaille) {
      setEditHabillementError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('habillement')
        .update({
          article: habillementArticle,
          description: habillementDescription,
          code: habillementCode,
          taille: habillementTaille,
          image: habillementImage,
        })
        .eq('id', selectedHabillement.id)
        .select();

      if (error) {
        console.error('Erreur lors de la mise à jour de l\'habillement:', error);
        setEditHabillementError(`Erreur lors de la mise à jour de l'habillement: ${error.message}`);
      } else {
        console.log('Habillement mis à jour avec succès:', data);
        setShowEditHabillementPopup(false);
        setSelectedHabillement(null);
        fetchHabillement();
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'habillement:', err);
      setEditHabillementError("Une erreur inattendue s'est produite lors de la mise à jour de l'habillement.");
    }
  };

  const handleDeleteHabillement = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet habillement ?")) {
      setDeleteError('');
      try {
        const { data, error } = await supabase
          .from('habillement')
          .delete()
          .eq('id', selectedHabillement.id);

        if (error) {
          console.error('Erreur lors de la suppression de l\'habillement:', error);
          setDeleteError(`Erreur lors de la suppression de l'habillement: ${error.message}`);
        } else {
          console.log('Habillement supprimé avec succès:', data);
          setShowEditHabillementPopup(false);
          setSelectedHabillement(null);
          fetchHabillement();
        }
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'habillement:', err);
        setDeleteError("Une erreur inattendue s'est produite lors de la suppression de l'habillement.");
      }
    }
  };

  const handleUpdatePersonnel = async (e) => {
    e.preventDefault();
    setUpdateError('');

    // Validation: Ensure all required fields are filled
    if (!personnelNom || !personnelPrenom || !personnelGrade || !personnelEmail) {
      setUpdateError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Additional validation for email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(personnelEmail)) {
      setUpdateError("Veuillez entrer une adresse email valide.");
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
        .eq('id', selectedPersonnel.id)
        .select(); // Ensure we select the updated data

      if (error) {
        console.error('Erreur lors de la mise à jour du personnel:', error);
        setUpdateError(`Erreur lors de la mise à jour du personnel: ${error.message}`);
      } else if (data && data.length > 0) {
        console.log('Personnel mis à jour avec succès:', data);
        setShowEditPopup(false);
        setSelectedPersonnel(null);
        fetchPersonnel();
      } else {
        console.log('Personnel mis à jour avec succès, no data returned');
        setShowEditPopup(false);
        setSelectedPersonnel(null);
        fetchPersonnel();
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du personnel:', err);
      setUpdateError("Une erreur inattendue s'est produite lors de la mise à jour du personnel.");
    }
  };

  const handleDeletePersonnel = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce personnel ?")) {
      setDeleteError('');
      try {
        const { data, error } = await supabase
          .from('personnel')
          .delete()
          .eq('id', selectedPersonnel.id);

        if (error) {
          console.error('Erreur lors de la suppression du personnel:', error);
          setDeleteError(`Erreur lors de la suppression du personnel: ${error.message}`);
        } else {
          console.log('Personnel supprimé avec succès:', data);
          setShowEditPopup(false);
          setSelectedPersonnel(null);
          fetchPersonnel();
        }
      } catch (err) {
        console.error('Erreur lors de la suppression du personnel:', err);
        setDeleteError("Une erreur inattendue s'est produite lors de la suppression du personnel.");
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Paramètres</h2>

      <div className="flex flex-col items-center space-y-4">
        <button
          className="bg-ios-blue text-white rounded-md p-2 w-64"
          onClick={() => setShowAddPersonnel(true)}
        >
          Ajouter Personnel
        </button>
        <button
          className="bg-ios-blue text-white rounded-md p-2 w-64"
          onClick={() => setShowAddHabillement(true)}
        >
          Ajouter Habillement
        </button>
        <button
          className="bg-green-500 text-white rounded-md p-2 w-64"
          onClick={() => setShowEditPopup(true)}
        >
          Edition Personnel
        </button>
        <button
          className="bg-green-500 text-white rounded-md p-2 w-64"
          onClick={() => setShowEditHabillementPopup(true)}
        >
          Edition Habillement
        </button>
        <button
          className="bg-ios-blue text-white rounded-md p-2 w-64"
          onClick={() => setShowAffectHabillement(true)}
        >
          Affecter Habillement
        </button>
      </div>

      {showAddPersonnel && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 w-96">
            <h3 className="text-lg font-semibold mb-2">Ajouter Personnel</h3>
            <form onSubmit={handleAddPersonnel} className="flex flex-col space-y-2">
              <label>Nom:</label>
              <input
                type="text"
                value={newPersonnelNom}
                onChange={(e) => setNewPersonnelNom(e.target.value)}
                className="border rounded-md p-1"
                required
              />
              <label>Prenom:</label>
              <input
                type="text"
                value={newPersonnelPrenom}
                onChange={(e) => setNewPersonnelPrenom(e.target.value)}
                className="border rounded-md p-1"
                required
              />
              <label>Grade:</label>
              <input
                type="text"
                value={newPersonnelGrade}
                onChange={(e) => setNewPersonnelGrade(e.target.value)}
                className="border rounded-md p-1"
                required
              />
              <label>Email:</label>
              <input
                type="email"
                value={newPersonnelEmail}
                onChange={(e) => setNewPersonnelEmail(e.target.value)}
                className="border rounded-md p-1"
                required
              />
              <label>Caserne:</label>
              <input
                type="text"
                value={newPersonnelCaserne}
                onChange={(e) => setNewPersonnelCaserne(e.target.value)}
                className="border rounded-md p-1"
              />
              <label>Photo URL:</label>
              <input
                type="text"
                value={newPersonnelPhoto}
                onChange={(e) => setNewPersonnelPhoto(e.target.value)}
                className="border rounded-md p-1"
              />
              {addError && <p className="text-red-500">{addError}</p>}
              <button type="submit" className="bg-ios-blue text-white rounded-md p-2">
                Ajouter
              </button>
              <button type="button" className="bg-gray-200 rounded-md p-2" onClick={() => setShowAddPersonnel(false)}>
                Fermer
              </button>
            </form>
          </div>
        </div>
      )}

      {showAddHabillement && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 w-96">
            <h3 className="text-lg font-semibold mb-2">Ajouter Habillement</h3>
            <form onSubmit={handleAddHabillement} className="flex flex-col space-y-2">
              <label>Article:</label>
              <input
                type="text"
                value={newHabillementArticle}
                onChange={(e) => setNewHabillementArticle(e.target.value)}
                className="border rounded-md p-1"
                required
              />
              <label>Description:</label>
              <input
                type="text"
                value={newHabillementDescription}
                onChange={(e) => setNewHabillementDescription(e.target.value)}
                className="border rounded-md p-1"
                required
              />
              <label>Code:</label>
              <input
                type="text"
                value={newHabillementCode}
                onChange={(e) => setNewHabillementCode(e.target.value)}
                className="border rounded-md p-1"
                required
              />
              <label>Taille:</label>
              <input
                type="text"
                value={newHabillementTaille}
                onChange={(e) => setNewHabillementTaille(e.target.value)}
                className="border rounded-md p-1"
                required
              />
              <label>Image URL:</label>
              <input
                type="text"
                value={newHabillementImage}
                onChange={(e) => setNewHabillementImage(e.target.value)}
                className="border rounded-md p-1"
              />
              {addHabillementError && <p className="text-red-500">{addHabillementError}</p>}
              <button type="submit" className="bg-ios-blue text-white rounded-md p-2">
                Ajouter
              </button>
              <button type="button" className="bg-gray-200 rounded-md p-2" onClick={() => setShowAddHabillement(false)}>
                Fermer
              </button>
            </form>
          </div>
        </div>
      )}

      {showAffectHabillement && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 w-96">
            <h3 className="text-lg font-semibold mb-2">Affecter Habillement</h3>
            <form onSubmit={handleAffectHabillement} className="flex flex-col space-y-2">
              <label>Personnel:</label>
              <select
                value={selectedPersonnelId}
                onChange={(e) => setSelectedPersonnelId(e.target.value)}
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
              <label>Habillement:</label>
              <select
                value={selectedHabillementId}
                onChange={(e) => setSelectedHabillementId(e.target.value)}
                className="border rounded-md p-1"
                required
              >
                <option value="">Sélectionner un habillement</option>
                {habillementList.map((habillement) => (
                  <option key={habillement.id} value={habillement.id}>
                    {habillement.article} - {habillement.description}
                  </option>
                ))}
              </select>
              <label>Code:</label>
              <input
                type="text"
                value={newMasseCode}
                onChange={(e) => setNewMasseCode(e.target.value)}
                className="border rounded-md p-1"
                required
              />
              {affectHabillementError && <p className="text-red-500">{affectHabillementError}</p>}
              <button type="submit" className="bg-ios-blue text-white rounded-md p-2">
                Affecter
              </button>
              <button type="button" className="bg-gray-200 rounded-md p-2" onClick={() => setShowAffectHabillement(false)}>
                Fermer
              </button>
            </form>
          </div>
        </div>
      )}

      {showEditPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 w-96">
            <h3 className="text-lg font-semibold mb-2">Modifier Personnel</h3>
            <div className="flex items-center justify-between">
              <select
                onChange={(e) => handleEditPersonnel(e.target.value)}
                className="border rounded-md p-1 mb-4 flex-grow"
              >
                <option value="">Sélectionner un personnel</option>
                {personnelList.map((personnel) => (
                  <option key={personnel.id} value={personnel.id}>
                    {personnel.nom} {personnel.prenom}
                  </option>
                ))}
              </select>
              <button className="bg-gray-200 rounded-md p-2 mt-4 ml-2" onClick={() => setShowEditPopup(false)}>Fermer</button>
            </div>

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
                {updateError && <p className="text-red-500">{updateError}</p>}
                {deleteError && <p className="text-red-500">{deleteError}</p>}
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
          </div>
        </div>
      )}

      {showEditHabillementPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 w-96">
            <h3 className="text-lg font-semibold mb-2">Modifier Habillement</h3>
            <div className="flex items-center justify-between">
              <select
                onChange={(e) => handleEditHabillement(e.target.value)}
                className="border rounded-md p-1 mb-4 flex-grow"
              >
                <option value="">Sélectionner un habillement</option>
                {habillementList.map((habillement) => (
                  <option key={habillement.id} value={habillement.id}>
                    {habillement.article} - {habillement.description}
                  </option>
                ))}
              </select>
              <button className="bg-gray-200 rounded-md p-2 mt-4 ml-2" onClick={() => setShowEditHabillementPopup(false)}>Fermer</button>
            </div>

            {selectedHabillement && (
              <form onSubmit={handleUpdateHabillement} className="flex flex-col space-y-2">
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
                <label>Code:</label>
                <input
                  type="text"
                  value={habillementCode}
                  onChange={(e) => setHabillementCode(e.target.value)}
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
                <label>Image URL:</label>
                <input
                  type="text"
                  value={habillementImage}
                  onChange={(e) => setHabillementImage(e.target.value)}
                  className="border rounded-md p-1"
                />
                {editHabillementError && <p className="text-red-500">{editHabillementError}</p>}
                <button type="submit" className="bg-ios-blue text-white rounded-md p-2">
                  Mettre à jour
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white rounded-md p-2"
                  onClick={handleDeleteHabillement}
                >
                  Supprimer
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Parametres;

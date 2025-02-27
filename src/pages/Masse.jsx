import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quvdxjxszquqqcvesntn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmR4anhzenF1cXFjdmVzbnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTk3MTQsImV4cCI6MjA1NTYzNTcxNH0.MB_f2XGYYNwV0CSIjz4W7_KoyNNTkeFMfJZee-N2vKw';
const supabase = createClient(supabaseUrl, supabaseKey);

function Masse() {
  const [personnelList, setPersonnelList] = useState([]);
  const [filteredPersonnel, setFilteredPersonnel] = useState([]);
  const [masseArticles, setMasseArticles] = useState([]);
  const [selectedPersonnelId, setSelectedPersonnelId] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showArticlePopup, setShowArticlePopup] = useState(false);

  const [articleTaille, setArticleTaille] = useState('');
  const [articleCode, setArticleCode] = useState('');

  
  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const { data, error } = await supabase
          .from('personnel')
          .select('id, nom, prenom')
          .order('nom', { ascending: true });

        if (error) {
          console.error('Error fetching personnel:', error);
        } else {
          setPersonnelList(data || []);
        }
      } catch (error) {
        console.error('Error fetching personnel:', error);
      }
    };

    fetchPersonnel();
  }, []);


  const handlePersonnelSelect = async (personnelId) => {
   try {
      const { data, error } = await supabase
        .from('Masse')
        .select('habillement(article, description, code, taille, image)')
        .eq('personnel_id', personnelId);

      if (error) {
        console.error('Error fetching Masse articles:', error);
      } else {
        setMasseArticles(data || []);
        setSelectedPersonnelId(personnelId);
      }
    } catch (error) {
      console.error('Error fetching Masse articles:', error);
    }
  };

  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
    setArticleTaille(article.habillement.taille);
    setArticleCode(article.habillement.code);
    setShowArticlePopup(true);
  };

  const handleClosePopup = () => {
    setShowArticlePopup(false);
    setSelectedArticle(null);
  };

  const handleModifierArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('habillement')
        .update({
          taille: articleTaille,
          code: articleCode,
        })
        .eq('id', selectedArticle.habillement.id)
        .select();

      if (error) {
        console.error('Error updating habillement:', error);
      } else {
        console.log('Habillement updated successfully:', data);
        // Refresh articles
        handlePersonnelSelect(selectedPersonnelId);
        handleClosePopup();
      }
    } catch (error) {
      console.error('Error updating habillement:', error);
    }
  };

  const handleDeleteArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('Masse')
        .delete()
        .eq('habillement_id', selectedArticle.habillement.id)
        .eq('personnel_id', selectedPersonnelId);

      if (error) {
        console.error('Error deleting Masse entry:', error);
      } else {
        console.log('Masse entry deleted successfully:', data);
        // Refresh articles
        handlePersonnelSelect(selectedPersonnelId);
        handleClosePopup();
      }
    } catch (error) {
      console.error('Error deleting Masse entry:', error);
    }
  };


  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Masse</h2>
      {/*
        <h2 className="text-xl font-semibold mb-4">Masse</h2>
        <p>Content for Masse will go here.</p>
      */}

      <div className="flex mb-4">
        <select
          className="w-full p-2 border rounded-md"
          onChange={(e) => handlePersonnelSelect(e.target.value)}
        >
          <option value="">Sélectionner un personnel</option>
          {personnelList.map((personnel) => (
            <option key={personnel.id} value={personnel.id}>
              {personnel.nom} {personnel.prenom}
            </option>
          ))}
        </select>
        </div>


      {selectedPersonnelId && masseArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {masseArticles.map(article => (
            <div key={article.habillement.id} className="bg-white rounded-lg shadow-md p-4 relative cursor-pointer" onClick={() => handleArticleSelect(article)}>
              {article.habillement.image && (
                <div className="absolute top-2 right-2 w-24 h-24 rounded-full overflow-hidden">
                 <img
                    src={article.habillement.image}
                    alt={article.habillement.article}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center mb-2">
                <strong className="text-gray-700 text-sm font-bold mr-2">Article:</strong>
                <span className="text-gray-600 text-sm">{article.habillement.article}</span>
              </div>
              <div className="flex items-center">
                <strong className="text-gray-700 text-sm font-bold mr-2">Description:</strong>
                <span className="text-gray-600 text-sm">{article.habillement.description}</span>
              </div>
              <div className="flex items-center">
                <strong className="text-gray-700 text-sm font-bold mr-2">Code:</strong>
                <span className="text-gray-600 text-sm">{article.habillement.code}</span>
              </div>
              <div className="flex items-center">
                <strong className="text-gray-700 text-sm font-bold mr-2">Taille:</strong>
                <span className="text-gray-600 text-sm">{article.habillement.taille}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showArticlePopup && selectedArticle && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 w-96 relative">
            <h2 className="text-xl font-semibold mb-4">{selectedArticle.habillement.article}</h2>

            {selectedArticle.habillement.image && (
              <div className="absolute top-4 right-4 w-24 h-24 rounded-full overflow-hidden">
                <img
                  src={selectedArticle.habillement.image}
                  alt={selectedArticle.habillement.article}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Taille:</label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={articleTaille}
                onChange={(e) => setArticleTaille(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Code:</label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={articleCode}
                onChange={(e) => setArticleCode(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <button
                className="bg-ios-blue text-white rounded-md p-2"
                onClick={handleModifierArticle}
              >
                Modifier
              </button>
              <button
                className="bg-red-500 text-white rounded-md p-2"
                onClick={handleDeleteArticle}
              >
                Supprimer
              </button>
              <button className="bg-gray-200 rounded-md p-2" onClick={handleClosePopup}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Masse;

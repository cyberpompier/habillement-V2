import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quvdxjxszquqqcvesntn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmR4anhzenF1cXFjdmVzbnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTk3MTQsImV4cCI6MjA1NTYzNTcxNH0.MB_f2XGYYNwV0CSIjz4W7_KoyNNTkeFMfJZee-N2vKw';
const supabase = createClient(supabaseUrl, supabaseKey);

function Parametres() {
  const [showEditPersonnel, setShowEditPersonnel] = useState(false);
  const [showEditHabillement, setShowEditHabillement] = useState(false);
  const [showAffectationPersonnel, setShowAffectationPersonnel] = useState(false);

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
        console.error('Error adding personnel:', error);
        alert('Failed to add personnel.');
      } else {
        console.log('Personnel added successfully:', data);
        // Clear the form
        setPersonnelNom('');
        setPersonnelPrenom('');
        setPersonnelGrade('');
        setPersonnelPhoto('');
        setPersonnelEmail('');
        setPersonnelCaserne('');
      }
    } catch (err) {
      console.error('Error adding personnel:', err);
      alert('An unexpected error occurred.');
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
        console.error('Error adding habillement:', error);
        alert('Failed to add habillement.');
      } else {
        console.log('Habillement added successfully:', data);
        // Clear the form
        setHabillementArticle('');
        setHabillementDescription('');
        setHabillementTaille('');
        setHabillementCode('');
        setHabillementImage('');
      }
    } catch (err) {
      console.error('Error adding habillement:', err);
      alert('An unexpected error occurred.');
    }
    setShowEditHabillement(false); // Close the popup after submission
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Paramètres</h2>

      <div className="flex flex-col items-center space-y-4">
        <button
          className="bg-ios-blue text-white rounded-md p-2 w-64"
          onClick={() => setShowEditPersonnel(true)}
        >
          Add Personnel
        </button>
        <button
          className="bg-ios-blue text-white rounded-md p-2 w-64"
          onClick={() => setShowEditHabillement(true)}
        >
          Add Habillement
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
            <h3 className="text-lg font-semibold mb-2">Add Personnel</h3>
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
                Add Personnel
              </button>
            </form>
            <button className="bg-gray-200 rounded-md p-2 mt-4" onClick={() => setShowEditPersonnel(false)}>Close</button>
          </div>
        </div>
      )}

      {showEditHabillement && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 w-96">
            <h3 className="text-lg font-semibold mb-2">Add Habillement</h3>
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
              />
              <label>Taille:</label>
              <input
                type="text"
                value={habillementTaille}
                onChange={(e) => setHabillementTaille(e.target.value)}
                className="border rounded-md p-1"
              />
              <label>Code:</label>
              <input
                type="text"
                value={habillementCode}
                onChange={(e) => setHabillementCode(e.target.value)}
                className="border rounded-md p-1"
              />
              <label>Image URL:</label>
              <input
                type="text"
                value={habillementImage}
                onChange={(e) => setHabillementImage(e.target.value)}
                className="border rounded-md p-1"
              />
              <button type="submit" className="bg-ios-blue text-white rounded-md p-2">
                Add Habillement
              </button>
            </form>
            <button className="bg-gray-200 rounded-md p-2 mt-4" onClick={() => setShowEditHabillement(false)}>Close</button>
          </div>
        </div>
      )}

      {showAffectationPersonnel && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Affectation Personnel</h3>
            {/* Add your form for affectation personnel here */}
            <button className="bg-gray-200 rounded-md p-2 mt-4" onClick={() => setShowAffectationPersonnel(false)}>Close</button>
          </div>
        </div>
      )}
			<elevenlabs-convai agent-id="cPSFENw0adX5x4anM4CG"></elevenlabs-convai><script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
    </div>
  );
}

export default Parametres;

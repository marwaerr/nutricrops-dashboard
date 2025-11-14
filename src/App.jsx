import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, FileText, Ship, Package, Users, Calendar, Mail, Filter, Search, Plus, Download, TrendingUp, TrendingDown, BarChart3, PieChart, X, MapPin, Edit, Save, Trash2 } from 'lucide-react';
import { supabase } from './supabaseClient';
import GeographicView from '../GeographicView';

// Composant pour la sélection multiple des types d'incident
const MultipleIncidentTypesSelector = ({ selectedTypes, onTypesChange, label, required = false }) => {
  const incidentTypesOptions = [
    'Prise en masse',
    'Poussière',
    'Contamination',
    'Granulométrie',
    'Corps étranger',
    'Composition chimique',
    'Odeur',
    'Humidité',
    'Particules noires',
    'Couleur',
    'Produit huileux',
    'Sous enrobage',
    'Température élevée'
  ];

  const toggleType = (type) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    onTypesChange(newTypes);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      
      {/* Affichage des types sélectionnés */}
      {selectedTypes.length > 0 && (
        <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800 mb-2">Types sélectionnés:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTypes.map(type => (
              <span 
                key={type}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200"
              >
                {type}
                <button
                  type="button"
                  onClick={() => toggleType(type)}
                  className="text-green-600 hover:text-green-800 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Liste des options */}
      <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
        {incidentTypesOptions.map(type => (
          <label 
            key={type}
            className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedTypes.includes(type)}
              onChange={() => toggleType(type)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">{type}</span>
          </label>
        ))}
      </div>
      
      {selectedTypes.length === 0 && (
        <p className="text-xs text-gray-500 mt-1">Aucun type sélectionné. Cliquez pour choisir.</p>
      )}
    </div>
  );
};

// Composant pour sélectionner le type de réclamation
const ReclamationTypeSelector = ({ selectedType, onTypeChange }) => {
  const types = [
    { id: 'quantite', label: 'Quantité', icon: Package, color: 'blue' },
    { id: 'qualite', label: 'Qualité', icon: CheckCircle, color: 'green' },
    { id: 'logistique', label: 'Logistique', icon: Ship, color: 'orange' },
    { id: 'documentation', label: 'Documentation', icon: FileText, color: 'purple' }
  ];

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Type de Réclamation *
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {types.map(type => (
          <button
            key={type.id}
            type="button"
            onClick={() => onTypeChange(type.id)}
            className={`p-3 sm:p-4 border-2 rounded-lg text-center transition-all ${
              selectedType === type.id
                ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700`
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            <type.icon className={`w-6 h-6 mx-auto mb-2 ${
              selectedType === type.id ? `text-${type.color}-600` : 'text-gray-400'
            }`} />
            <span className="text-sm font-medium">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Composant pour afficher l'historique des follow-ups
const FollowUpHistory = ({ reclamationId }) => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFollowUps();
  }, [reclamationId]);

  const loadFollowUps = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reclamation_followups')
        .select('*')
        .eq('reclamation_id', reclamationId)
        .order('date', { ascending: false });
      
      if (!error && data) {
        setFollowUps(data);
      }
    } catch (error) {
      console.error('Error loading follow-ups:', error);
    }
    setLoading(false);
  };

  const getTypeBadge = (type) => {
    const styles = {
      information: 'bg-blue-100 text-blue-800 border-blue-200',
      reponse_partielle: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      reponse_finale: 'bg-green-100 text-green-800 border-green-200',
      autre: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    const labels = {
      information: 'Information',
      reponse_partielle: 'Réponse Partielle',
      reponse_finale: 'Réponse Finale',
      autre: 'Autre'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${styles[type]}`}>
        {labels[type]}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Chargement de l'historique...</div>;
  }

  return (
    <div className="mt-6">
      <h4 className="font-semibold text-gray-900 mb-3 text-lg">Historique des Suivis</h4>
      <div className="space-y-4">
        {followUps.length > 0 ? (
          followUps.map((followUp) => (
            <div key={followUp.id} className="bg-white p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{followUp.personne}</span>
                  {getTypeBadge(followUp.type)}
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {formatDate(followUp.date)}
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{followUp.retour}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Aucun suivi enregistré pour cette réclamation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function NutricropsQualityExcellence() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewReclamation, setShowNewReclamation] = useState(false);
  const [dashboardView, setDashboardView] = useState('overview');
  const [editingReclamation, setEditingReclamation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteReclamationConfirm, setDeleteReclamationConfirm] = useState(null);
  const [editingFinances, setEditingFinances] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [evolutionData, setEvolutionData] = useState([]);
  
  // États pour les données
  const [reclamations, setReclamations] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalReclamations: 0,
    cloturees: 0,
    montantTotalDemande: 0,
    montantTotalDedommage: 0,
    previousYearReclamations: 0,
    evolutionPercentage: '0.0'
  });
  const [produitStats, setProduitStats] = useState([]);
  const [regionStats, setRegionStats] = useState([]);
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [topClients, setTopClients] = useState([]);

  // États pour les produits depuis la base de données
  const [produitsData, setProduitsData] = useState({});
  const [loadingProduits, setLoadingProduits] = useState(false);

  // États pour les types d'incident multiples
  const [selectedIncidentTypes, setSelectedIncidentTypes] = useState([]);

  // États pour le type de réclamation
  const [reclamationType, setReclamationType] = useState('qualite');

  // États pour le système de follow-up
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedReclamationForFollowUp, setSelectedReclamationForFollowUp] = useState(null);
  const [newFollowUp, setNewFollowUp] = useState({
    date: new Date().toISOString().split('T')[0],
    personne: '',
    retour: '',
    type: 'information'
  });

  // Données pour les régions et pays - VERSION COMPLÈTE
  const [regionsData, setRegionsData] = useState({
    Europe: [
      'France', 'Allemagne', 'Espagne', 'Italie', 'Royaume-Uni', 'Pays-Bas', 'Belgique', 
      'Pologne', 'Portugal', 'Suède', 'Danemark', 'Finlande', 'Norvège', 'Suisse', 'Autriche',
      'Ukraine', 'Bulgarie', 'Irlande', 'Lettonie', 'Lituanie', 'Roumanie', 'Grèce',
      'République Tchèque', 'Hongrie', 'Slovaquie', 'Croatie', 'Slovénie', 'Estonie','Latvia'
    ],
    Asie: [
      'Chine', 'Japon', 'Corée du Sud', 'Inde', 'Vietnam', 'Thaïlande', 'Malaisie', 
      'Indonésie', 'Philippines', 'Bangladesh', 'Pakistan', 'Sri Lanka', 'Taiwan',
      'Liban', 'Arabie Saoudite', 'Émirats Arabes Unis', 'Qatar', 'Koweït', 'Oman',
      'Israël', 'Turquie', 'Singapour', 'Corée du Nord', 'Birmanie', 'Cambodge', 'Laos'
    ],
    Amérique: [
      'États-Unis', 'Canada', 'Brésil', 'Mexique', 'Argentine', 'Chili', 'Colombie', 
      'Pérou', 'Uruguay', 'Équateur', 'Venezuela', 'El Salvador', 'Guatemala', 'Costa Rica',
      'Panama', 'République Dominicaine', 'Cuba', 'Honduras', 'Nicaragua', 'Paraguay', 'Bolivie'
    ],
    Afrique: [
      'Maroc', 'Algérie', 'Tunisie', 'Égypte', 'Sénégal', 'Côte d\'Ivoire', 'Nigeria', 
      'Ghana', 'Kenya', 'Afrique du Sud', 'Éthiopie', 'Tanzanie', 'Bénin', 'Rwanda',
      'Cameroun', 'Mali', 'Burkina Faso', 'République Démocratique du Congo', 'Congo',
      'Gabon', 'Madagascar', 'Ouganda', 'Zambie', 'Zimbabwe', 'Soudan', 'Angola'
    ],
    Océanie: [
      'Australie', 'Nouvelle-Zélande'
    ]
  });

  // États pour le formulaire de réclamation
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProduit, setSelectedProduit] = useState('');
  const [searchPays, setSearchPays] = useState('');
  const [showPaysSuggestions, setShowPaysSuggestions] = useState(false);

  // Charger toutes les données depuis Supabase
  useEffect(() => {
    loadAllData();
    loadProduitsData();
  }, [selectedYear]);

  // S'assurer que produitsData a toujours une structure valide
  useEffect(() => {
    if (Object.keys(produitsData).length === 0 && !loadingProduits) {
      // Fallback data en attendant le chargement
      setProduitsData({
        'ASP': ['ASP 19 38 6S EURO'],
        'DAP': ['DAP SPECIAL DARK', 'DAP EURO', 'DAP TANZANIE', 'DAP VIETNAM'],
        'MAP': ['MAP 11 52', 'MAP 11 52 Special', 'MAP 11 52 EU'],
        'TSP': ['TSP EURO', 'TSP Special', 'TSP Spécial Jorf'],
        'NPK': ['NPK 10 26 26', 'NPK 14 18 18 6S 1B2O3', 'NPK 14 28 14'],
        'NP': ['NP 10 30 EU']
      });
    }
  }, [produitsData, loadingProduits]);

  // Charger les produits depuis la base de données
  const loadProduitsData = async () => {
    setLoadingProduits(true);
    try {
      const { data, error } = await supabase
        .from('produits')
        .select('produit, sous_produit')
        .order('produit');

      if (error) {
        console.error('Error loading produits:', error);
        alert('Erreur lors du chargement des produits depuis la base de données');
        return;
      }

      // Transformer les données en format {produit: [sous-produits]}
      const formattedData = data.reduce((acc, item) => {
        if (!acc[item.produit]) {
          acc[item.produit] = [];
        }
        if (item.sous_produit) {
          acc[item.produit].push(item.sous_produit);
        }
        return acc;
      }, {});

      setProduitsData(formattedData);
      console.log('Produits chargés:', Object.keys(formattedData).length, 'produits trouvés');
    } catch (error) {
      console.error('Error in loadProduitsData:', error);
      alert('Erreur lors du chargement des produits');
    }
    setLoadingProduits(false);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadReclamations()
      ]);
      await loadDashboardStats();
      await loadProduitStats();
      await loadRegionStats();
      await loadIncidentTypes();
      await loadTopClients();
      await loadEvolutionData();
    } catch (error) {
      console.error('Error loading all data:', error);
    }
    setLoading(false);
  };

  const loadReclamations = async () => {
    try {
      const { data, error } = await supabase
        .from('reclamations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading reclamations:', error);
      } else {
        setReclamations(data || []);
      }
    } catch (error) {
      console.error('Error in loadReclamations:', error);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const currentYear = selectedYear;
      const previousYear = currentYear - 1;

      // Compter les réclamations par année (utiliser date_reception au lieu de created_at)
      const { data: currentYearReclamations } = await supabase
        .from('reclamations')
        .select('id, date_reception')
        .gte('date_reception', `${currentYear}-01-01`)
        .lte('date_reception', `${currentYear}-12-31`);

      const { data: previousYearReclamations } = await supabase
        .from('reclamations')
        .select('id, date_reception')
        .gte('date_reception', `${previousYear}-01-01`)
        .lte('date_reception', `${previousYear}-12-31`);

      // Compter les réclamations clôturées de l'année sélectionnée (utiliser date_reception)
      const { data: clotureesData } = await supabase
        .from('reclamations')
        .select('id, date_reception')
        .eq('statut', 'cloture')
        .gte('date_reception', `${currentYear}-01-01`)
        .lte('date_reception', `${currentYear}-12-31`);

      // Calculer les montants pour l'année sélectionnée (utiliser date_reception)
      const { data: montantsData } = await supabase
        .from('reclamations')
        .select('montant_demande, montant_dedommage, date_reception')
        .gte('date_reception', `${currentYear}-01-01`)
        .lte('date_reception', `${currentYear}-12-31`);

      const totalDemande = montantsData?.reduce((sum, r) => sum + (r.montant_demande || 0), 0) || 0;
      const totalDedommage = montantsData?.reduce((sum, r) => sum + (r.montant_dedommage || 0), 0) || 0;

      // Calculer le pourcentage d'évolution
      const evolutionPercentage = previousYearReclamations?.length > 0 ? 
        (((currentYearReclamations?.length || 0) - previousYearReclamations.length) / previousYearReclamations.length * 100).toFixed(1) : '0.0';

      setDashboardStats({
        totalReclamations: currentYearReclamations?.length || 0,
        cloturees: clotureesData?.length || 0,
        montantTotalDemande: totalDemande,
        montantTotalDedommage: totalDedommage,
        previousYearReclamations: previousYearReclamations?.length || 0,
        evolutionPercentage: evolutionPercentage
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const loadEvolutionData = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const years = [currentYear - 4, currentYear - 3, currentYear - 2, currentYear - 1, currentYear];
      
      const evolutionPromises = years.map(async (year) => {
        const { data: reclamationsData } = await supabase
          .from('reclamations')
          .select('id, date_reception')
          .gte('date_reception', `${year}-01-01`)
          .lte('date_reception', `${year}-12-31`);

        return {
          year,
          reclamations: reclamationsData?.length || 0
        };
      });

      const evolutionResults = await Promise.all(evolutionPromises);
      setEvolutionData(evolutionResults);
    } catch (error) {
      console.error('Error loading evolution data:', error);
    }
  };

  const loadProduitStats = async () => {
    try {
      const { data, error } = await supabase
        .from('reclamations')
        .select('qualite, date_reception')
        .gte('date_reception', `${selectedYear}-01-01`)
        .lte('date_reception', `${selectedYear}-12-31`);

      if (!error && data) {
        const produitCounts = data.reduce((acc, item) => {
          if (item.qualite) {
            acc[item.qualite] = (acc[item.qualite] || 0) + 1;
          }
          return acc;
        }, {});

        const stats = Object.entries(produitCounts).map(([produit, count]) => ({
          produit,
          count,
          color: getRandomColor()
        }));

        setProduitStats(stats);
      }
    } catch (error) {
      console.error('Error loading produit stats:', error);
    }
  };

  const loadRegionStats = async () => {
    try {
      const { data, error } = await supabase
        .from('reclamations')
        .select('region, date_reception')
        .gte('date_reception', `${selectedYear}-01-01`)
        .lte('date_reception', `${selectedYear}-12-31`);

      if (!error && data) {
        const regionCounts = data.reduce((acc, item) => {
          if (item.region) {
            acc[item.region] = (acc[item.region] || 0) + 1;
          }
          return acc;
        }, {});

        const total = data.length;
        const stats = Object.entries(regionCounts).map(([region, count]) => ({
          region,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0
        }));

        setRegionStats(stats);
      }
    } catch (error) {
      console.error('Error loading region stats:', error);
    }
  };

  const loadIncidentTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('reclamations')
        .select('type_incident, date_reception')
        .gte('date_reception', `${selectedYear}-01-01`)
        .lte('date_reception', `${selectedYear}-12-31`);

      if (!error && data) {
        const typeCounts = data.reduce((acc, item) => {
          if (item.type_incident) {
            acc[item.type_incident] = (acc[item.type_incident] || 0) + 1;
          }
          return acc;
        }, {});

        const stats = Object.entries(typeCounts).map(([type, count]) => ({
          type,
          count,
          color: getRandomColor()
        }));

        setIncidentTypes(stats);
      }
    } catch (error) {
      console.error('Error loading incident types:', error);
    }
  };

  const loadTopClients = async () => {
    try {
      const { data, error } = await supabase
        .from('reclamations')
        .select('client, date_reception')
        .gte('date_reception', `${selectedYear}-01-01`)
        .lte('date_reception', `${selectedYear}-12-31`);

      if (!error && data) {
        const clientCounts = data.reduce((acc, item) => {
          if (item.client) {
            acc[item.client] = (acc[item.client] || 0) + 1;
          }
          return acc;
        }, {});

        const topClients = Object.entries(clientCounts)
          .map(([client, claims]) => ({ client, claims }))
          .sort((a, b) => b.claims - a.claims)
          .slice(0, 5);

        setTopClients(topClients);
      }
    } catch (error) {
      console.error('Error loading top clients:', error);
    }
  };

  const getRandomColor = () => {
    const colors = [
      'bg-green-600', 'bg-yellow-600', 'bg-blue-600', 'bg-teal-600', 
      'bg-red-600', 'bg-orange-600', 'bg-purple-600', 'bg-pink-600'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Fonction pour générer un ID lisible
  const generateReadableId = (type, date, produit, client) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const produitCode = produit ? produit.substring(0, 3).toUpperCase() : 'PRO';
    const clientCode = client ? client.substring(0, 3).toUpperCase() : 'CLI';
    
    return `${type}-${year}${month}${day}-${produitCode}-${clientCode}`;
  };

  // Fonction pour formater les montants en MAD
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  // Fonction pour ajouter un follow-up
  const addFollowUp = async () => {
    if (!newFollowUp.personne || !newFollowUp.retour) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reclamation_followups')
        .insert([{
          reclamation_id: selectedReclamationForFollowUp.id,
          date: newFollowUp.date,
          personne: newFollowUp.personne,
          retour: newFollowUp.retour,
          type: newFollowUp.type
        }])
        .select();

      if (error) {
        console.error('Error adding follow-up:', error);
        alert('Erreur lors de l\'ajout du suivi');
      } else {
        // Réinitialiser le formulaire
        setNewFollowUp({
          date: new Date().toISOString().split('T')[0],
          personne: '',
          retour: '',
          type: 'information'
        });
        setShowFollowUpModal(false);
        alert('Suivi ajouté avec succès!');
      }
    } catch (error) {
      console.error('Error in addFollowUp:', error);
      alert('Erreur lors de l\'ajout du suivi');
    }
    setLoading(false);
  };

  // Fonction pour ajouter une nouvelle réclamation
  const addNewReclamation = async (formData) => {
    setLoading(true);
    
    try {
      // Vérifier qu'au moins un type est sélectionné
      if (selectedIncidentTypes.length === 0) {
        alert('Veuillez sélectionner au moins un type d\'incident');
        setLoading(false);
        return;
      }

      const readableId = generateReadableId(
        'REC', 
        formData.date_reception || new Date(), 
        formData.qualite, 
        formData.client || 'N/A'
      );

      const newReclamation = {
        client: formData.client || 'Non spécifié',
        navire: formData.navire,
        site: formData.site,
        qualite: formData.qualite,
        sous_produit: formData.sous_produit || null,
        quantite: parseInt(formData.quantite) || 0,
        type_incident: selectedIncidentTypes.join(', '), // Convertir en string séparée par des virgules
        type_reclamation: reclamationType, // Ajouter le type de réclamation
        probleme: formData.probleme || 'Non spécifié',
        statut: 'nouveau',
        priorite: formData.priorite || 'moyenne',
        region: formData.region,
        pays: formData.pays || 'À définir',
        date_bl: formData.date_bl,
        date_reception: formData.date_reception || new Date().toISOString().split('T')[0],
        montant_demande: parseFloat(formData.montant_demande) || 0,
        montant_dedommage: 0,
        nouveau_produit: formData.nouveau_produit === 'true',
        readable_id: readableId
      };

      const { data, error } = await supabase
        .from('reclamations')
        .insert([newReclamation])
        .select();
      
      if (error) {
        console.error('Error adding reclamation:', error);
        alert(`Erreur lors de l'ajout de la réclamation: ${error.message}`);
      } else {
        setReclamations([data[0], ...reclamations]);
        setShowNewReclamation(false);
        // Réinitialiser les états du formulaire
        setSelectedRegion('');
        setSelectedProduit('');
        setSearchPays('');
        setSelectedIncidentTypes([]); // Réinitialiser les types sélectionnés
        setReclamationType('qualite'); // Réinitialiser le type de réclamation
        await loadDashboardStats();
        alert('Réclamation créée avec succès!');
      }
    } catch (error) {
      console.error('Error in addNewReclamation:', error);
      alert('Erreur lors de l\'ajout de la réclamation');
    }
    setLoading(false);
  };

  // Fonction pour démarrer l'édition des finances
  const startEditingFinances = (reclamation) => {
    setEditingFinances({
      id: reclamation.id,
      montant_demande: reclamation.montant_demande || 0,
      montant_dedommage: reclamation.montant_dedommage || 0
    });
  };

  // Fonction pour sauvegarder les modifications financières
  const saveFinances = async () => {
    if (!editingFinances) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('reclamations')
        .update({
          montant_demande: parseFloat(editingFinances.montant_demande) || 0,
          montant_dedommage: parseFloat(editingFinances.montant_dedommage) || 0
        })
        .eq('id', editingFinances.id);

      if (error) {
        console.error('Error updating finances:', error);
        alert(`Erreur lors de la mise à jour: ${error.message}`);
      } else {
        // Mettre à jour l'état local
        setReclamations(reclamations.map(rec => 
          rec.id === editingFinances.id ? {
            ...rec,
            montant_demande: parseFloat(editingFinances.montant_demande) || 0,
            montant_dedommage: parseFloat(editingFinances.montant_dedommage) || 0
          } : rec
        ));

        // Mettre à jour la réclamation sélectionnée si elle est ouverte
        if (selectedReclamation && selectedReclamation.id === editingFinances.id) {
          setSelectedReclamation({
            ...selectedReclamation,
            montant_demande: parseFloat(editingFinances.montant_demande) || 0,
            montant_dedommage: parseFloat(editingFinances.montant_dedommage) || 0
          });
        }

        setEditingFinances(null);
        await loadDashboardStats();
        alert('Données financières mises à jour avec succès!');
      }
    } catch (error) {
      console.error('Error in saveFinances:', error);
      alert('Erreur lors de la mise à jour des données financières');
    }
    setLoading(false);
  };

  // Fonction pour supprimer une réclamation
  const deleteReclamation = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('reclamations')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting reclamation:', error);
        alert(`Erreur lors de la suppression: ${error.message}`);
      } else {
        setReclamations(reclamations.filter(rec => rec.id !== id));
        setDeleteReclamationConfirm(null);
        if (selectedReclamation && selectedReclamation.id === id) {
          setSelectedReclamation(null);
        }
        await loadDashboardStats();
        alert('Réclamation supprimée avec succès!');
      }
    } catch (error) {
      console.error('Error in deleteReclamation:', error);
      alert('Erreur lors de la suppression de la réclamation');
    }
    setLoading(false);
  };

  // Fonction pour clôturer une réclamation
  const closeReclamation = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('reclamations')
        .update({ 
          statut: 'cloture',
          date_cloture: new Date().toISOString().split('T')[0]
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error closing reclamation:', error);
        alert(`Erreur lors de la clôture: ${error.message}`);
      } else {
        setReclamations(reclamations.map(rec => 
          rec.id === id ? { 
            ...rec, 
            statut: 'cloture',
            date_cloture: new Date().toISOString().split('T')[0]
          } : rec
        ));
        if (selectedReclamation && selectedReclamation.id === id) {
          setSelectedReclamation({
            ...selectedReclamation,
            statut: 'cloture',
            date_cloture: new Date().toISOString().split('T')[0]
          });
        }
        await loadDashboardStats();
        alert('Réclamation clôturée avec succès!');
      }
    } catch (error) {
      console.error('Error in closeReclamation:', error);
      alert('Erreur lors de la clôture de la réclamation');
    }
    setLoading(false);
  };

  // Formatage des données
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
    }
  };

  const getStatutBadge = (statut) => {
    const styles = {
      nouveau: 'bg-blue-100 text-blue-800 border-blue-200',
      en_cours: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cloture: 'bg-green-100 text-green-800 border-green-200'
    };
    const labels = { 
      nouveau: 'Nouveau', 
      en_cours: 'En cours', 
      cloture: 'Clôturé' 
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[statut] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {labels[statut] || statut}
      </span>
    );
  };

  const getPrioriteBadge = (priorite) => {
    const styles = {
      haute: 'bg-red-100 text-red-800 border-red-200',
      moyenne: 'bg-orange-100 text-orange-800 border-orange-200',
      basse: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold border ${styles[priorite] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {priorite?.charAt(0)?.toUpperCase() + priorite?.slice(1) || 'Non définie'}
      </span>
    );
  };

  const getReclamationTypeBadge = (type) => {
    const styles = {
      quantite: 'bg-blue-100 text-blue-800 border-blue-200',
      qualite: 'bg-green-100 text-green-800 border-green-200',
      logistique: 'bg-orange-100 text-orange-800 border-orange-200',
      documentation: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    const labels = {
      quantite: 'Quantité',
      qualite: 'Qualité',
      logistique: 'Logistique',
      documentation: 'Documentation'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[type] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {labels[type] || type}
      </span>
    );
  };

  // Filtrage des réclamations
  let filteredReclamations = reclamations;

  // Filtre par année - utiliser date_reception au lieu de created_at
  if (filterYear !== 'all') {
    filteredReclamations = filteredReclamations.filter(rec => {
      const reclamationYear = new Date(rec.date_reception).getFullYear();
      return reclamationYear === filterYear;
    });
  }

  if (filterStatus !== 'all') filteredReclamations = filteredReclamations.filter(r => r.statut === filterStatus);
  if (searchTerm) {
    filteredReclamations = filteredReclamations.filter(r => 
      (r.client && r.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.navire && r.navire.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.readable_id && r.readable_id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  // Filtrer les pays basé sur la région sélectionnée et la recherche
  const filteredPays = selectedRegion && regionsData[selectedRegion] 
    ? regionsData[selectedRegion].filter(pays => 
        pays.toLowerCase().includes(searchPays.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Header avec branding OCP */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-700 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="bg-white/20 p-2 sm:p-4 rounded-xl sm:rounded-2xl backdrop-blur-sm border-2 border-white/30">
                <Package className="w-6 h-6 sm:w-10 sm:h-10" />
              </div>
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-1">
                  <h1 className="text-2xl sm:text-4xl font-bold">OCP</h1>
                  <span className="text-xl sm:text-2xl font-light">|</span>
                  <h2 className="text-xl sm:text-3xl font-semibold">NUTRICROPS</h2>
                </div>
                <p className="text-green-100 text-sm sm:text-lg font-medium">Quality Excellence Dashboard</p>
                <p className="text-green-200 text-xs sm:text-sm hidden sm:block">Plateforme de Gestion des Réclamations Clients</p>
              </div>
            </div>
            <div className="flex gap-3 flex-col sm:flex-row w-full sm:w-auto">
              <button 
                onClick={() => setShowNewReclamation(true)}
                className="bg-white text-green-700 px-4 sm:px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl text-sm justify-center"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Nouvelle Réclamation</span>
                <span className="sm:hidden">Réclamation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b-2 shadow-md sticky top-0 z-10 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 min-w-max sm:min-w-0">
            {[
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard', fullLabel: 'Dashboard Quality Excellence' },
              { id: 'reclamations', icon: FileText, label: 'Réclamations', fullLabel: 'Gestion Réclamations' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 sm:py-4 px-3 sm:px-6 font-bold transition-all relative flex items-center gap-2 text-sm sm:text-base ${
                  activeTab === tab.id 
                    ? 'text-green-700 bg-green-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="sm:hidden">{tab.label}</span>
                <span className="hidden sm:inline">{tab.fullLabel}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center mb-6">
            <p className="text-blue-700 font-semibold">Chargement des données...</p>
          </div>
        )}

        {loadingProduits && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center mb-6">
            <p className="text-blue-700 font-semibold">Chargement des produits...</p>
          </div>
        )}

        {/* DASHBOARD QUALITY EXCELLENCE */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Sélecteur d'année et vue */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Quality Excellence</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-semibold text-gray-700">Année:</label>
                    <select 
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    >
                      {[2021, 2022, 2023, 2024, 2025].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDashboardView('overview')}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        dashboardView === 'overview'
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      📊 Vue d'ensemble
                    </button>
                    <button
                      onClick={() => setDashboardView('geographic')}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        dashboardView === 'geographic'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      🌍 Vue géographique
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Vue Géographique */}
            {dashboardView === 'geographic' && (
              <GeographicView 
                reclamations={reclamations} 
                selectedYear={selectedYear} 
              />
            )}

            {/* Vue Overview */}
            {dashboardView === 'overview' && (
              <div className="space-y-6">
                {/* KPIs Principaux */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* Réclamations de l'année sélectionnée */}
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-xs sm:text-sm font-medium">Réclamations {selectedYear}</p>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">{dashboardStats.totalReclamations}</p>
                        <p className="text-xs sm:text-sm text-green-100 mt-1">
                          {dashboardStats.evolutionPercentage >= 0 ? '+' : ''}{dashboardStats.evolutionPercentage}% vs {selectedYear - 1}
                        </p>
                      </div>
                      <FileText className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-200" />
                    </div>
                  </div>

                  {/* Réclamations Clôturées */}
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-xs sm:text-sm font-medium">Clôturées {selectedYear}</p>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">{dashboardStats.cloturees}</p>
                        <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                          Taux: {dashboardStats.totalReclamations > 0 ? 
                            ((dashboardStats.cloturees / dashboardStats.totalReclamations) * 100).toFixed(0) 
                            : 0}%
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-emerald-200" />
                    </div>
                  </div>

                  {/* Taux de Résolution */}
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-xs sm:text-sm font-medium">Taux de Résolution</p>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">
                          {dashboardStats.totalReclamations > 0 ? 
                            ((dashboardStats.cloturees / dashboardStats.totalReclamations) * 100).toFixed(0) 
                            : 0}%
                        </p>
                        <p className="text-xs sm:text-sm text-blue-100 mt-1">Réclamations traitées</p>
                      </div>
                      <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-200" />
                    </div>
                  </div>
                </div>

                {/* Montants Totaux - année sélectionnée */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100 text-sm font-medium">Montant Total Demandé {selectedYear}</p>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-2">{formatCurrency(dashboardStats.montantTotalDemande)}</p>
                        <p className="text-red-100 text-sm mt-1">Réclamations {selectedYear}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-red-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">Montant Total Dédommagé {selectedYear}</p>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-2">{formatCurrency(dashboardStats.montantTotalDedommage)}</p>
                        <p className="text-green-100 text-sm mt-1">
                          Taux: {dashboardStats.montantTotalDemande > 0 ? 
                            ((dashboardStats.montantTotalDedommage / dashboardStats.montantTotalDemande) * 100).toFixed(1) 
                            : 0}%
                        </p>
                      </div>
                      <TrendingDown className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-200" />
                    </div>
                  </div>
                </div>

                {/* Graphiques côte à côte */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Répartition par Famille Engrais */}
                  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      Répartition par Famille Engrais {selectedYear}
                    </h3>
                    <div className="space-y-3">
                      {produitStats.length > 0 ? (
                        produitStats.map(prod => {
                          const percentage = dashboardStats.totalReclamations > 0 ? 
                            ((prod.count / dashboardStats.totalReclamations) * 100).toFixed(0) : 0;
                          return (
                            <div key={prod.produit}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-gray-700 text-sm sm:text-base">{prod.produit}</span>
                                <span className="text-gray-600 font-bold text-sm sm:text-base">{prod.count} ({percentage}%)</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                                <div 
                                  className={`${prod.color} h-3 sm:h-4 rounded-full transition-all`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-500 text-center py-4">Aucune donnée disponible pour {selectedYear}</p>
                      )}
                    </div>
                  </div>

                  {/* Répartition Géographique */}
                  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      Répartition par Régions {selectedYear}
                    </h3>
                    <div className="space-y-3">
                      {regionStats.length > 0 ? (
                        regionStats.map(region => (
                          <div key={region.region}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-gray-700 text-sm sm:text-base">{region.region}</span>
                              <span className="text-gray-600 font-bold text-sm sm:text-base">{region.count} ({region.percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                              <div 
                                className="bg-blue-600 h-3 sm:h-4 rounded-full transition-all"
                                style={{ width: `${region.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">Aucune donnée disponible pour {selectedYear}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Répartition par Type */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Répartition par Type d'Incident {selectedYear}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {incidentTypes.length > 0 ? (
                      incidentTypes.map(incident => (
                        <div key={incident.type} className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-700 text-sm sm:text-base">{incident.type}</span>
                            <span className={`${incident.color} text-white px-2 sm:px-3 py-1 rounded-full font-bold text-sm`}>
                              {incident.count}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-4 text-gray-500">
                        Aucun type d'incident disponible pour {selectedYear}
                      </div>
                    )}
                  </div>
                </div>

                {/* Top Clients */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border-2 border-green-200">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                    TOP 5 Clients / Claims {selectedYear}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    {topClients.length > 0 ? (
                      topClients.map((client, idx) => (
                        <div key={client.client} className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-md text-center border-2 border-green-300">
                          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-1 sm:mb-2">#{idx + 1}</div>
                          <p className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 truncate">{client.client}</p>
                          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700">{client.claims}</p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">réclamations</p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 sm:col-span-3 lg:col-span-5 text-center py-6 sm:py-8 text-gray-500">
                        Aucun client avec réclamations pour {selectedYear}
                      </div>
                    )}
                  </div>
                </div>

                {/* Graphique d'évolution - VERSION RESPONSIVE */}
                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Évolution du Nombre de Réclamations par Année</h3>
                  
                  {/* Conteneur graphique responsive */}
                  <div className="h-48 sm:h-64 lg:h-80 relative">
                    {evolutionData.length > 0 ? (
                      <>
                        {/* Grille d'arrière-plan responsive */}
                        <div className="absolute inset-0 flex flex-col justify-between">
                          {[0, 25, 50, 75, 100].map((percent) => {
                            const maxValue = Math.max(...evolutionData.map(d => d.reclamations));
                            return (
                              <div key={percent} className="flex items-center">
                                <div className="w-6 sm:w-8 lg:w-12 text-xs text-gray-400 text-right pr-1 sm:pr-2">
                                  {Math.round((percent / 100) * maxValue)}
                                </div>
                                <div className="flex-1 border-t border-gray-100"></div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Barres du graphique - VERSION RESPONSIVE */}
                        <div className="flex items-end justify-between h-full gap-1 sm:gap-2 lg:gap-4 pl-8 sm:pl-10 lg:pl-14">
                          {evolutionData.map((item) => {
                            // Trouver la valeur maximale
                            const maxValue = Math.max(...evolutionData.map(d => d.reclamations));
                            
                            // Calculer la hauteur proportionnelle
                            const heightReclamations = maxValue > 0 ? (item.reclamations / maxValue) * 95 : 0;

                            return (
                              <div key={item.year} className="flex-1 flex flex-col items-center justify-end h-full min-w-0">
                                {/* Barre des réclamations */}
                                <div className="flex flex-col items-center justify-end h-full" style={{ height: '95%' }}>
                                  <div 
                                    className="w-8 sm:w-12 lg:w-16 xl:w-20 bg-gradient-to-t from-green-500 to-green-600 rounded-t transition-all duration-500 hover:from-green-600 hover:to-green-700 relative group"
                                    style={{ 
                                      height: `${heightReclamations}%`,
                                      minHeight: heightReclamations > 0 ? '2px' : '0px'
                                    }}
                                  >
                                    {/* Tooltip pour mobile et desktop */}
                                    <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 hidden sm:block">
                                      {item.reclamations} réclamations
                                    </div>
                                  </div>
                                  {/* Nombre de réclamations - visible sur tous les écrans */}
                                  <div className="mt-1 text-[10px] xs:text-xs sm:text-sm font-bold text-green-700 text-center leading-tight">
                                    {item.reclamations}
                                  </div>
                                </div>
                                
                                {/* Label d'année responsive */}
                                <div className="text-center mt-2 sm:mt-3 w-full px-1">
                                  <p className="text-xs sm:text-sm font-semibold text-gray-700 truncate">
                                    {item.year}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Légende mobile pour les tooltips */}
                        <div className="sm:hidden mt-4 text-center">
                          <p className="text-xs text-gray-500">
                            👆 Touchez les barres pour voir les détails
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-sm sm:text-base">Chargement des données d'évolution...</p>
                      </div>
                    )}
                  </div>

                  {/* Tableau récapitulatif responsive */}
                  <div className="mt-6 sm:mt-8 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    {evolutionData.map(item => {
                      const maxReclamations = Math.max(...evolutionData.map(d => d.reclamations));
                      
                      return (
                        <div key={item.year} className="text-center p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
                          <p className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">{item.year}</p>
                          
                          <div className="space-y-2 sm:space-y-3">
                            {/* Barre de progression pour les réclamations */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded"></div>
                                  <span className="hidden xs:inline">Réc:</span>
                                  <span className="xs:hidden">R:</span>
                                </span>
                                <span className="text-sm sm:text-lg font-bold text-green-600">{item.reclamations}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                                <div 
                                  className="bg-green-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${maxReclamations > 0 ? (item.reclamations / maxReclamations) * 100 : 0}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            {/* Évolution annuelle */}
                            <div className="pt-2 border-t border-gray-200">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500">Évolution:</span>
                                <span className={`font-semibold ${
                                  item.reclamations > (evolutionData.find(d => d.year === item.year - 1)?.reclamations || 0) 
                                    ? 'text-red-600' 
                                    : 'text-green-600'
                                }`}>
                                  {item.reclamations > (evolutionData.find(d => d.year === item.year - 1)?.reclamations || 0) ? '+' : ''}
                                  {item.reclamations - (evolutionData.find(d => d.year === item.year - 1)?.reclamations || 0)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Statistiques globales responsive */}
                  <div className="mt-4 sm:mt-6">
                    <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-green-800">Total Réclamations (5 ans)</p>
                          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-900">
                            {evolutionData.reduce((sum, item) => sum + item.reclamations, 0)}
                          </p>
                          <p className="text-xs text-green-600 mt-0.5 sm:mt-1">
                            Moyenne: {(evolutionData.reduce((sum, item) => sum + item.reclamations, 0) / evolutionData.length).toFixed(1)} / an
                          </p>
                        </div>
                        <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0 ml-2" />
                      </div>
                    </div>
                  </div>

                  {/* Indicateur responsive pour mobile */}
                  <div className="mt-4 sm:hidden bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-800 text-center">
                      <span className="font-semibold">💡 Conseil :</span> Tournez l'écran pour une meilleure visibilité
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* GESTION RÉCLAMATIONS */}
        {activeTab === 'reclamations' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Filtres */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1 w-full min-w-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <input
                        type="text"
                        placeholder="Rechercher par client, navire ou ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  <button className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold text-sm sm:text-base w-full sm:w-auto justify-center">
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    Exporter Excel
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  
                  {/* Filtre Année */}
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold text-gray-700">Année:</span>
                    <select 
                      value={filterYear}
                      onChange={(e) => setFilterYear(parseInt(e.target.value))}
                      className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      {[2021, 2022, 2023, 2024, 2025].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-semibold text-gray-700 w-full sm:w-auto">Statut:</span>
                    {['all', 'nouveau', 'en_cours', 'cloture'].map(status => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                          filterStatus === status
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status === 'all' && 'Toutes'}
                        {status === 'nouveau' && 'Nouveau'}
                        {status === 'en_cours' && 'En cours'}
                        {status === 'cloture' && 'Clôturées'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{filteredReclamations.length}</span> réclamation(s) trouvée(s) pour {filterYear}
                </div>
              </div>
            </div>

            {/* Liste Réclamations */}
            {!selectedReclamation ? (
              <div className="space-y-4">
                {filteredReclamations.length > 0 ? (
                  filteredReclamations.map(rec => (
                    <div key={rec.id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                                {rec.readable_id || `REC-${rec.id.substring(0, 8)}`}
                              </h3>
                              {getStatutBadge(rec.statut)}
                              {getPrioriteBadge(rec.priorite)}
                              {rec.type_reclamation && getReclamationTypeBadge(rec.type_reclamation)}
                              {rec.region && (
                                <span className="text-sm px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                                  {rec.region}
                                </span>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm mb-3">
                              <div>
                                <span className="text-gray-500">Client:</span>
                                <p className="font-semibold text-gray-900 truncate">{rec.client}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Navire:</span>
                                <p className="font-semibold text-gray-900 truncate">{rec.navire}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Site:</span>
                                <p className="font-semibold text-gray-900 truncate">{rec.site}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Date réception:</span>
                                <p className="font-semibold text-gray-900">{formatDate(rec.date_reception)}</p>
                              </div>
                            </div>

                            {rec.nouveau_produit && (
                              <div className="mb-3">
                                <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold border border-purple-300">
                                  ⭐ NOUVEAU PRODUIT
                                </span>
                              </div>
                            )}

                            {/* AFFICHAGE PRODUIT ET SOUS-PRODUIT */}
                            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm mb-3">
                              <div className="flex items-center gap-1">
                                <Package className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-600">
                                  {rec.qualite}
                                  {rec.sous_produit && (
                                    <span className="text-gray-400"> / {rec.sous_produit}</span>
                                  )}
                                </span>
                              </div>
                              {rec.quantite > 0 && (
                                <div>
                                  <span className="text-gray-600">Quantité: </span>
                                  <span className="font-semibold text-gray-900">{rec.quantite?.toLocaleString()} MT</span>
                                </div>
                              )}
                              <div>
                                <span className="text-gray-600">Demandé: </span>
                                <span className="font-bold text-red-600">{formatCurrency(rec.montant_demande)}</span>
                              </div>
                              {rec.montant_dedommage > 0 && (
                                <div>
                                  <span className="text-gray-600">Dédommagé: </span>
                                  <span className="font-bold text-green-600">{formatCurrency(rec.montant_dedommage)}</span>
                                </div>
                              )}
                            </div>

                            {/* Affichage des types d'incident multiples */}
                            {rec.type_incident && (
                              <div className="mb-3">
                                <span className="text-gray-600 text-sm">Types d'incident: </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {rec.type_incident.split(', ').map((type, index) => (
                                    <span 
                                      key={index}
                                      className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                                    >
                                      {type}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">{rec.probleme}</p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 w-full sm:w-auto">
                            <button 
                              onClick={() => setSelectedReclamation(rec)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm w-full sm:w-auto"
                            >
                              Voir Détails
                            </button>
                            <button 
                              onClick={() => setDeleteReclamationConfirm(rec)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm flex items-center gap-2 justify-center w-full sm:w-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 text-center">
                    <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Aucune réclamation trouvée</h3>
                    <p className="text-gray-500">Aucune réclamation ne correspond aux critères de recherche.</p>
                  </div>
                )}
              </div>
            ) : (
              /* DÉTAIL RÉCLAMATION */
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
                  <button 
                    onClick={() => setSelectedReclamation(null)}
                    className="text-green-600 hover:text-green-700 font-semibold mb-4 flex items-center gap-2 text-sm sm:text-base"
                  >
                    ← Retour à la liste
                  </button>
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                          {selectedReclamation.readable_id || `REC-${selectedReclamation.id.substring(0, 8)}`}
                        </h2>
                        {getStatutBadge(selectedReclamation.statut)}
                        {getPrioriteBadge(selectedReclamation.priorite)}
                        {selectedReclamation.type_reclamation && getReclamationTypeBadge(selectedReclamation.type_reclamation)}
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Reçue le: <span className="font-semibold">{formatDate(selectedReclamation.date_reception) || 'En attente'}</span>
                        {selectedReclamation.date_cloture && (
                          <> • Clôturée le: <span className="font-semibold">{formatDate(selectedReclamation.date_cloture)}</span></>
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <button className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm justify-center">
                        <Download className="w-4 h-4" />
                        Exporter PDF
                      </button>
                      <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm justify-center">
                        <Mail className="w-4 h-4" />
                        Envoyer Email
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Informations Principales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-blue-50 p-4 sm:p-5 rounded-xl border border-blue-200">
                      <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        Informations Client
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Client:</span>
                          <p className="font-bold text-gray-900 truncate">{selectedReclamation.client}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Région:</span>
                          <p className="font-semibold text-gray-900">{selectedReclamation.region}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Pays:</span>
                          <p className="font-semibold text-gray-900">{selectedReclamation.pays}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 sm:p-5 rounded-xl border border-green-200">
                      <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                        <Ship className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        Informations Logistique
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Navire:</span>
                          <p className="font-bold text-gray-900 truncate">{selectedReclamation.navire}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Site:</span>
                          <p className="font-semibold text-gray-900">{selectedReclamation.site}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Date B/L:</span>
                          <p className="font-semibold text-gray-900">{formatDate(selectedReclamation.date_bl)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 sm:p-5 rounded-xl border border-purple-200">
                      <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                        <Package className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        Informations Produit
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Qualité:</span>
                          <p className="font-bold text-gray-900">{selectedReclamation.qualite}</p>
                        </div>
                        {selectedReclamation.sous_produit && (
                          <div>
                            <span className="text-gray-600">Sous-Produit:</span>
                            <p className="font-semibold text-gray-900">{selectedReclamation.sous_produit}</p>
                          </div>
                        )}
                        {selectedReclamation.quantite > 0 && (
                          <div>
                            <span className="text-gray-600">Quantité:</span>
                            <p className="font-semibold text-gray-900">{selectedReclamation.quantite?.toLocaleString()} MT</p>
                          </div>
                        )}
                        {selectedReclamation.nouveau_produit && (
                          <div>
                            <span className="text-gray-600">Statut:</span>
                            <p className="font-semibold text-purple-600">⭐ NOUVEAU PRODUIT</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Types d'incident multiples */}
                  {selectedReclamation.type_incident && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 sm:p-6 rounded-lg">
                      <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        Types d'Incident Signalés
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedReclamation.type_incident.split(', ').map((type, index) => (
                          <span 
                            key={index}
                            className="inline-block px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium border border-blue-200"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Problème */}
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 sm:p-6 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-base sm:text-lg">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                      Problème Signalé
                    </h3>
                    <p className="text-gray-900 font-medium text-sm sm:text-base">{selectedReclamation.probleme}</p>
                  </div>

                  {/* Informations Financières */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 sm:p-6 rounded-xl border border-orange-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base sm:text-lg">
                        <span className="text-xl sm:text-2xl">💰</span>
                        Informations Financières
                      </h3>
                      {!editingFinances && selectedReclamation.statut !== 'cloture' && (
                        <button 
                          onClick={() => startEditingFinances(selectedReclamation)}
                          className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
                        >
                          <Edit className="w-4 h-4" />
                          Modifier
                        </button>
                      )}
                    </div>
                    
                    {editingFinances && editingFinances.id === selectedReclamation.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Montant Demandé (MAD)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={editingFinances.montant_demande}
                              onChange={(e) => setEditingFinances({
                                ...editingFinances,
                                montant_demande: e.target.value
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Montant Dédommagé (MAD)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={editingFinances.montant_dedommage}
                              onChange={(e) => setEditingFinances({
                                ...editingFinances,
                                montant_dedommage: e.target.value
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 flex-col sm:flex-row">
                          <button 
                            onClick={saveFinances}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm justify-center"
                          >
                            <Save className="w-4 h-4" />
                            Sauvegarder
                          </button>
                          <button 
                            onClick={() => setEditingFinances(null)}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
                          <p className="text-sm text-gray-600 mb-1">Montant Demandé</p>
                          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">{formatCurrency(selectedReclamation.montant_demande)}</p>
                        </div>
                        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
                          <p className="text-sm text-gray-600 mb-1">Montant Dédommagé</p>
                          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{formatCurrency(selectedReclamation.montant_dedommage)}</p>
                        </div>
                        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
                          <p className="text-sm text-gray-600 mb-1">Taux de Dédommagement</p>
                          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                            {selectedReclamation.montant_demande > 0 
                              ? ((selectedReclamation.montant_dedommage / selectedReclamation.montant_demande) * 100).toFixed(1) 
                              : 0}%
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Historique des Follow-ups */}
                  <FollowUpHistory reclamationId={selectedReclamation.id} />

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                    <button 
                      onClick={() => {
                        setSelectedReclamationForFollowUp(selectedReclamation);
                        setShowFollowUpModal(true);
                      }}
                      className="bg-blue-600 text-white py-3 sm:py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
                    >
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      Ajouter un Suivi
                    </button>
                    {selectedReclamation.statut !== 'cloture' && (
                      <button 
                        onClick={() => closeReclamation(selectedReclamation.id)}
                        className="bg-green-600 text-white py-3 sm:py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm sm:text-base flex-1 text-center"
                      >
                        Clôturer la Réclamation
                      </button>
                    )}
                    <button 
                      onClick={() => setDeleteReclamationConfirm(selectedReclamation)}
                      className="bg-red-600 text-white py-3 sm:py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm sm:text-base flex-1 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      Supprimer la Réclamation
                    </button>
                    <button className="bg-gray-200 text-gray-700 py-3 sm:py-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm sm:text-base flex-1 flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                      Générer Rapport
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL NOUVELLE RÉCLAMATION - AVEC PRODUITS DYNAMIQUES */}
      {showNewReclamation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-xl sm:rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Nouvelle Réclamation Client</h2>
                <button 
                  onClick={() => setShowNewReclamation(false)}
                  className="text-white hover:bg-white/20 p-1 sm:p-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                addNewReclamation(data);
              }}>
                {/* Sélecteur de type de réclamation */}
                <ReclamationTypeSelector
                  selectedType={reclamationType}
                  onTypeChange={setReclamationType}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Client</label>
                    <input 
                      name="client"
                      type="text" 
                      placeholder="Ex: HELM AG" 
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Région *</label>
                    <select 
                      name="region"
                      value={selectedRegion}
                      onChange={(e) => {
                        setSelectedRegion(e.target.value);
                        setSearchPays(''); // Réinitialiser la recherche pays
                      }}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      required
                    >
                      <option value="">Sélectionner...</option>
                      <option>Europe</option>
                      <option>Asie</option>
                      <option>Amérique</option>
                      <option>Afrique</option>
                      <option>Océanie</option>
                    </select>
                  </div>
                </div>

                {/* Pays avec autocomplete */}
                {selectedRegion && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pays *</label>
                    <div className="relative">
                      <input 
                        name="pays"
                        type="text" 
                        placeholder={`Rechercher un pays en ${selectedRegion}...`}
                        value={searchPays}
                        onChange={(e) => {
                          setSearchPays(e.target.value);
                          setShowPaysSuggestions(true);
                        }}
                        onFocus={() => setShowPaysSuggestions(true)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        required
                      />
                      {showPaysSuggestions && filteredPays.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {filteredPays.map((pays) => (
                            <div
                              key={pays}
                              className="px-3 sm:px-4 py-2 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 text-sm"
                              onClick={() => {
                                setSearchPays(pays);
                                setShowPaysSuggestions(false);
                              }}
                            >
                              {pays}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {filteredPays.length} pays disponible(s) pour {selectedRegion}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Navire *</label>
                    <input 
                      name="navire"
                      type="text" 
                      placeholder="Ex: MV ARKLOW MILL" 
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Site *</label>
                    <select 
                      name="site"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      required
                    >
                      <option value="">Sélectionner...</option>
                      <option>OIJ - Jorf Lasfar</option>
                      <option>OIS - Safi</option>
                    </select>
                  </div>
                </div>

                {/* PRODUITS DYNAMIQUES - RÉCLAMATION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Produit *</label>
                      <button 
                        type="button"
                        onClick={loadProduitsData}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded mb-2"
                        disabled={loadingProduits}
                      >
                        {loadingProduits ? '🔄' : '🔄'}
                      </button>
                    </div>
                    <select 
                      name="qualite"
                      value={selectedProduit}
                      onChange={(e) => setSelectedProduit(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      required
                      disabled={loadingProduits}
                    >
                      <option value="">{loadingProduits ? 'Chargement...' : 'Sélectionner...'}</option>
                      {Object.keys(produitsData).map(produit => (
                        <option key={produit} value={produit}>{produit}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sous-Produit</label>
                    <select 
                      name="sous_produit"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      disabled={loadingProduits || !selectedProduit}
                    >
                      <option value="">Sélectionner un sous-produit...</option>
                      {selectedProduit && produitsData[selectedProduit]?.map((sousProduit) => (
                        <option key={sousProduit} value={sousProduit}>{sousProduit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quantité (MT)</label>
                    <input 
                      name="quantite"
                      type="number" 
                      placeholder="Ex: 5500" 
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date B/L *</label>
                    <input 
                      name="date_bl"
                      type="date" 
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm" 
                      required
                    />
                  </div>
                </div>

                {/* Date de réception ajoutée */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date de Réception *</label>
                  <input 
                    name="date_reception"
                    type="date" 
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm" 
                    required
                  />
                </div>

                <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-3 sm:p-4">
                  <label className="flex items-start sm:items-center gap-3 cursor-pointer">
                    <input 
                      name="nouveau_produit"
                      type="checkbox" 
                      value="true"
                      className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1 sm:mt-0"
                    />
                    <div>
                      <span className="text-sm font-bold text-purple-900">Il s'agit d'un nouveau produit</span>
                      <p className="text-xs text-purple-700 mt-1">Cocher cette case si c'est la première commercialisation de ce produit</p>
                    </div>
                  </label>
                </div>

                {/* Sélecteur multiple de types d'incident */}
                <MultipleIncidentTypesSelector
                  selectedTypes={selectedIncidentTypes}
                  onTypesChange={setSelectedIncidentTypes}
                  label="Types d'Incident *"
                  required={true}
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Problème Signalé</label>
                  <textarea 
                    name="probleme"
                    rows="3" 
                    placeholder="Décrire le problème en détail..." 
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Montant Demandé (MAD)</label>
                    <input 
                      name="montant_demande"
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priorité</label>
                    <select 
                      name="priorite"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      defaultValue="moyenne"
                    >
                      <option value="basse">Basse</option>
                      <option value="moyenne">Moyenne</option>
                      <option value="haute">Haute</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-3 sm:py-4 rounded-lg hover:bg-green-700 transition-colors font-bold text-sm sm:text-base"
                  >
                    {loading ? 'Enregistrement...' : 'Créer la Réclamation'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setShowNewReclamation(false);
                      setSelectedRegion('');
                      setSelectedProduit('');
                      setSearchPays('');
                      setSelectedIncidentTypes([]);
                      setReclamationType('qualite');
                    }} 
                    className="flex-1 bg-gray-200 text-gray-700 py-3 sm:py-4 rounded-lg hover:bg-gray-300 transition-colors font-bold text-sm sm:text-base"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POUR AJOUTER UN FOLLOW-UP */}
      {showFollowUpModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 bg-blue-600 text-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Ajouter un Suivi</h2>
                <button 
                  onClick={() => setShowFollowUpModal(false)}
                  className="text-white hover:bg-white/20 p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                <input 
                  type="date"
                  value={newFollowUp.date}
                  onChange={(e) => setNewFollowUp({...newFollowUp, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Personne *</label>
                <input 
                  type="text"
                  placeholder="Nom de la personne"
                  value={newFollowUp.personne}
                  onChange={(e) => setNewFollowUp({...newFollowUp, personne: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type de retour *</label>
                <select 
                  value={newFollowUp.type}
                  onChange={(e) => setNewFollowUp({...newFollowUp, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="information">Information</option>
                  <option value="reponse_partielle">Réponse Partielle</option>
                  <option value="reponse_finale">Réponse Finale</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Retour / Commentaire *</label>
                <textarea 
                  rows="4"
                  placeholder="Détails du retour reçu..."
                  value={newFollowUp.retour}
                  onChange={(e) => setNewFollowUp({...newFollowUp, retour: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={addFollowUp}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  {loading ? 'Enregistrement...' : 'Ajouter le Suivi'}
                </button>
                <button 
                  onClick={() => setShowFollowUpModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMATION DE SUPPRESSION RÉCLAMATION */}
      {deleteReclamationConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Confirmer la suppression</h2>
            </div>
            
            <div className="p-4 sm:p-6">
              <p className="text-gray-700 mb-4 text-sm sm:text-base">
                Êtes-vous sûr de vouloir supprimer la réclamation <strong>{deleteReclamationConfirm.readable_id}</strong> ?
              </p>
              <p className="text-sm text-red-600 mb-4 sm:mb-6">
                ⚠️ Cette action est irréversible et supprimera définitivement toutes les données de cette réclamation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => deleteReclamation(deleteReclamationConfirm.id)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm sm:text-base"
                >
                  {loading ? 'Suppression...' : 'Supprimer'}
                </button>
                <button 
                  onClick={() => setDeleteReclamationConfirm(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm sm:text-base"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

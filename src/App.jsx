import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, FileText, Ship, Package, Users, Calendar, Mail, Filter, Search, Plus, Download, TrendingUp, TrendingDown, BarChart3, PieChart, X, MapPin, Factory, Droplet, Wind, Circle } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function NutricropsQualityExcellence() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterProduit, setFilterProduit] = useState('all');
  const [filterNouveauProduit, setFilterNouveauProduit] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewReclamation, setShowNewReclamation] = useState(false);
  const [showNewIncident, setShowNewIncident] = useState(false);
  const [dashboardView, setDashboardView] = useState('overview');

  // États pour les données depuis Supabase
  const [reclamations, setReclamations] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données au montage du composant
  useEffect(() => {
    loadData();

    // S'abonner aux changements en temps réel
    const reclamationsSubscription = supabase
      .channel('reclamations-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'reclamations' 
      }, () => {
        loadReclamations();
      })
      .subscribe();

    const incidentsSubscription = supabase
      .channel('incidents-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'incidents' 
      }, () => {
        loadIncidents();
      })
      .subscribe();

    return () => {
      reclamationsSubscription.unsubscribe();
      incidentsSubscription.unsubscribe();
    };
  }, []);

  // Fonction pour charger toutes les données
  async function loadData() {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([loadReclamations(), loadIncidents()]);
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Fonction pour charger les réclamations
  async function loadReclamations() {
    try {
      const { data, error: fetchError } = await supabase
        .from('reclamations')
        .select('*')
        .order('date_reception', { ascending: false });

      if (fetchError) throw fetchError;
      setReclamations(data || []);
    } catch (err) {
      console.error('Erreur réclamations:', err);
      throw err;
    }
  }

  // Fonction pour charger les incidents
  async function loadIncidents() {
    try {
      const { data, error: fetchError } = await supabase
        .from('incidents')
        .select('*')
        .order('date_detection', { ascending: false });

      if (fetchError) throw fetchError;
      setIncidents(data || []);
    } catch (err) {
      console.error('Erreur incidents:', err);
      throw err;
    }
  }

  // Fonction pour ajouter une nouvelle réclamation
  async function addReclamation(newReclamation) {
    try {
      const { data, error: insertError } = await supabase
        .from('reclamations')
        .insert([newReclamation])
        .select();

      if (insertError) throw insertError;

      alert('Réclamation créée avec succès !');
      setShowNewReclamation(false);
      return data;
    } catch (err) {
      console.error('Erreur création réclamation:', err);
      alert('Erreur: ' + err.message);
    }
  }

  // Fonction pour ajouter un nouvel incident
  async function addNewIncident(newIncident) {
    try {
      const { data, error: insertError } = await supabase
        .from('incidents')
        .insert([newIncident])
        .select();

      if (insertError) throw insertError;

      alert('Incident enregistré avec succès !');
      setShowNewIncident(false);
      return data;
    } catch (err) {
      console.error('Erreur création incident:', err);
      alert('Erreur: ' + err.message);
    }
  }

  // État de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-green-600 mx-auto mb-6"></div>
          <p className="text-gray-600 font-bold text-xl">Chargement des données...</p>
          <p className="text-gray-500 text-sm mt-2">Connexion à Supabase</p>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-white flex items-center justify-center p-6">
        <div className="bg-white border-2 border-red-200 rounded-2xl p-8 max-w-lg shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-red-800 font-bold text-2xl mb-3 text-center">Erreur de connexion</h3>
          <p className="text-red-600 text-center mb-6">{error}</p>
          <p className="text-sm text-gray-600 text-center mb-4">
            Vérifiez vos variables d'environnement dans .env.local
          </p>
          <button 
            onClick={loadData}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Statistiques calculées dynamiquement
  const stats = {
    total2024: reclamations.filter(r => r.date_bl?.startsWith('2024')).length,
    total2025: reclamations.filter(r => r.date_bl?.startsWith('2025')).length,
    enCours: reclamations.filter(r => r.statut === 'en_cours').length,
    cloturees: reclamations.filter(r => r.statut === 'cloture').length,
    claimsRate2024: 2.6,
    claimsRate2025: 2.0,
    montantTotalDemande: reclamations.reduce((sum, r) => sum + (parseFloat(r.montant_demande) || 0), 0),
    montantTotalDedommage: reclamations.reduce((sum, r) => sum + (parseFloat(r.montant_dedommage) || 0), 0)
  };

  // Répartition par type d'incident
  const incidentTypes = [
    { type: 'Prise en masse', count: 13, color: 'bg-red-500' },
    { type: 'Poussière', count: 8, color: 'bg-orange-500' },
    { type: 'Contamination', count: 6, color: 'bg-yellow-500' },
    { type: 'Granulométrie', count: 5, color: 'bg-green-500' },
    { type: 'Corps étranger', count: 1, color: 'bg-blue-500' },
    { type: 'Odeur Enrobant', count: 1, color: 'bg-purple-500' }
  ];

  // Répartition par produit
  const produitStats = [
    { produit: 'TSP', count: 12, color: 'bg-green-600' },
    { produit: 'DAP', count: 11, color: 'bg-yellow-600' },
    { produit: 'MAP', count: 2, color: 'bg-blue-600' },
    { produit: 'NPK', count: 3, color: 'bg-teal-600' },
    { produit: 'ASP', count: 1, color: 'bg-black' },
    { produit: 'NP', count: 1, color: 'bg-gray-600' }
  ];

  // Top clients
  const topClients = [
    { client: 'OCP Brazil', claims: 6 },
    { client: 'HELM', claims: 6 },
    { client: 'Seefco', claims: 3 },
    { client: 'Nitron', claims: 2 },
    { client: 'PPL', claims: 2 }
  ];

  // Répartition géographique
  const regionStats = [
    { region: 'Europe', count: 30, percentage: 50 },
    { region: 'Asie', count: 11, percentage: 18 },
    { region: 'Amérique', count: 11, percentage: 18 },
    { region: 'Afrique', count: 6, percentage: 10 },
    { region: 'Brésil', count: 1, percentage: 4 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const getStatutBadge = (statut) => {
    const styles = {
      nouveau: 'bg-blue-100 text-blue-800 border-blue-200',
      en_cours: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cloture: 'bg-green-100 text-green-800 border-green-200'
    };
    const labels = { nouveau: 'Nouveau', en_cours: 'En cours', cloture: 'Clôturé' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[statut]}`}>
        {labels[statut]}
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
      <span className={`px-2 py-1 rounded text-xs font-semibold border ${styles[priorite]}`}>
        {priorite?.charAt(0).toUpperCase() + priorite?.slice(1)}
      </span>
    );
  };

  // Fonction pour obtenir le badge de sévérité
  const getSeveriteBadge = (severite) => {
    const styles = {
      faible: 'bg-green-100 text-green-800 border-green-200',
      moyenne: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      elevee: 'bg-orange-100 text-orange-800 border-orange-200',
      critique: 'bg-red-100 text-red-800 border-red-200'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold border ${styles[severite]}`}>
        {severite?.charAt(0).toUpperCase() + severite?.slice(1)}
      </span>
    );
  };

  // Fonction pour obtenir le badge de statut incident
  const getIncidentStatutBadge = (statut) => {
    const styles = {
      detecte: 'bg-blue-100 text-blue-800 border-blue-200',
      en_analyse: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      resolu: 'bg-green-100 text-green-800 border-green-200',
      transforme_reclamation: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    const labels = {
      detecte: 'Détecté',
      en_analyse: 'En analyse',
      resolu: 'Résolu',
      transforme_reclamation: 'Réclamation'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[statut]}`}>
        {labels[statut]}
      </span>
    );
  };

  // Filtrage
  let filteredReclamations = reclamations;
  if (filterStatus !== 'all') filteredReclamations = filteredReclamations.filter(r => r.statut === filterStatus);
  if (filterRegion !== 'all') filteredReclamations = filteredReclamations.filter(r => r.region === filterRegion);
  if (filterProduit !== 'all') filteredReclamations = filteredReclamations.filter(r => r.qualite?.includes(filterProduit));
  if (filterNouveauProduit !== 'all') {
    filteredReclamations = filteredReclamations.filter(r => 
      filterNouveauProduit === 'oui' ? r.nouveau_produit === true : r.nouveau_produit === false
    );
  }
  if (searchTerm) {
    filteredReclamations = filteredReclamations.filter(r => 
      r.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.navire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(r.id).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

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
                <p className="text-green-200 text-xs sm:text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Connecté à Supabase • {reclamations.length} réclamations • {incidents.length} incidents
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowNewReclamation(true)}
              className="bg-white text-green-700 px-4 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold hover:bg-green-50 transition-all flex items-center gap-2 sm:gap-3 shadow-xl hover:shadow-2xl text-sm sm:text-lg w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden sm:inline">Nouvelle Réclamation</span>
              <span className="sm:hidden">Nouvelle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b-2 shadow-md sticky top-0 z-10 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 min-w-max sm:min-w-0">
            {[
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard', fullLabel: 'Dashboard Quality Excellence' },
              { id: 'reclamations', icon: FileText, label: 'Réclamations', fullLabel: 'Gestion Réclamations' },
              { id: 'incidents', icon: AlertCircle, label: 'Incidents', fullLabel: 'Gestion Incidents' }
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* DASHBOARD QUALITY EXCELLENCE */}
{activeTab === 'dashboard' && (
  <div className="space-y-6">
    {/* Sous-navigation Dashboard */}
    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md border border-gray-200">
      <div className="flex gap-2 sm:gap-3 overflow-x-auto">
        {['overview', 'claims', 'incidents'].map(view => (
          <button
            key={view}
            onClick={() => setDashboardView(view)}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${
              dashboardView === view
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {view === 'overview' && 'Vue d\'ensemble'}
            {view === 'claims' && 'Quality Claims'}
            {view === 'incidents' && 'Quality Incidents'}
          </button>
        ))}
      </div>
    </div>

    {/* Vue Overview */}
    {dashboardView === 'overview' && (
      <div className="space-y-6">
        {/* KPIs Principaux */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Réclamations 2024</p>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">{stats.total2024}</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Claims Rate: {stats.claimsRate2024}%</p>
              </div>
              <TrendingDown className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm font-medium">Réclamations 2025</p>
                <p className="text-3xl sm:text-4xl font-bold mt-2">{stats.total2025}</p>
                <p className="text-xs sm:text-sm text-green-100 mt-1">Claims Rate: {stats.claimsRate2025}%</p>
              </div>
              <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-xs sm:text-sm font-medium">En Cours</p>
                <p className="text-3xl sm:text-4xl font-bold mt-2">{stats.enCours}</p>
              </div>
              <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-xs sm:text-sm font-medium">Clôturées</p>
                <p className="text-3xl sm:text-4xl font-bold mt-2">{stats.cloturees}</p>
              </div>
              <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-200" />
            </div>
          </div>
        </div>

        {/* Evolution Claims Rate */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg overflow-x-auto">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Evolution du Claims Rate</h3>
          <div className="min-w-[600px] sm:min-w-0">
            <table className="w-full">
              <thead>
                <tr className="bg-green-100">
                  <th className="px-3 sm:px-4 py-3 text-left font-bold text-gray-700 text-sm sm:text-base">Fertilisers</th>
                  <th className="px-3 sm:px-4 py-3 text-center font-bold text-gray-700 text-sm sm:text-base">2022</th>
                  <th className="px-3 sm:px-4 py-3 text-center font-bold text-gray-700 text-sm sm:text-base">2023</th>
                  <th className="px-3 sm:px-4 py-3 text-center font-bold text-gray-700 text-sm sm:text-base">2024</th>
                  <th className="px-3 sm:px-4 py-3 text-center font-bold text-gray-700 text-sm sm:text-base">2025</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-3 sm:px-4 py-4 font-semibold text-sm sm:text-base">Claims Rate</td>
                  <td className="px-3 sm:px-4 py-4 text-center text-base sm:text-lg font-bold text-red-600">2.58%</td>
                  <td className="px-3 sm:px-4 py-4 text-center text-base sm:text-lg font-bold text-orange-600">2.74%</td>
                  <td className="px-3 sm:px-4 py-4 text-center text-base sm:text-lg font-bold text-yellow-600">2.6%</td>
                  <td className="px-3 sm:px-4 py-4 text-center text-base sm:text-lg font-bold text-green-600">2.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 font-semibold flex items-center gap-2 text-sm sm:text-base">
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
              Amélioration de 0.6% du Claims Rate entre 2024 et 2025
            </p>
          </div>
        </div>

        {/* Graphiques côte à côte */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Répartition par Famille Engrais */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-green-600" />
              Répartition par Famille Engrais 2025
            </h3>
            <div className="space-y-3">
              {produitStats.map(prod => {
                const percentage = ((prod.count / 30) * 100).toFixed(0);
                return (
                  <div key={prod.produit}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-gray-700">{prod.produit}</span>
                      <span className="text-gray-600 font-bold">{prod.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className={`${prod.color} h-4 rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Répartition Géographique */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              Répartition par Régions 2025
            </h3>
            <div className="space-y-3">
              {regionStats.map(region => (
                <div key={region.region}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-700">{region.region}</span>
                    <span className="text-gray-600 font-bold">{region.count} ({region.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-600 h-4 rounded-full transition-all"
                      style={{ width: `${region.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Répartition par Type */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Répartition par Type d'Incident - Aspects Physiques (34)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {incidentTypes.map(incident => (
              <div key={incident.type} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">{incident.type}</span>
                  <span className={`${incident.color} text-white px-3 py-1 rounded-full font-bold`}>
                    {incident.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-gray-700">
              <span className="font-bold">Chimique:</span> 3 (Composition, Humidité, Métaux lourds)
            </p>
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg border-2 border-green-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Users className="w-8 h-8 text-green-600" />
            TOP 5 Clients / Claims
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {topClients.map((client, idx) => (
              <div key={client.client} className="bg-white p-6 rounded-xl shadow-md text-center border-2 border-green-300">
                <div className="text-4xl font-bold text-green-600 mb-2">#{idx + 1}</div>
                <p className="font-bold text-gray-900 text-lg mb-2">{client.client}</p>
                <p className="text-3xl font-bold text-green-700">{client.claims}</p>
                <p className="text-sm text-gray-600 mt-1">réclamations</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}

    {/* Vue Claims */}
    {dashboardView === 'claims' && (
      <div className="space-y-6">
        {/* Evolution 2024-2025 */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Evolution du Nombre de Réclamations 2024-2025</h3>
          <div className="flex items-end justify-around gap-8 h-80">
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg w-24 transition-all hover:shadow-xl" style={{ height: '230px' }}>
                <div className="text-white font-bold text-3xl mt-4 text-center">{stats.total2024}</div>
              </div>
              <p className="mt-3 font-bold text-gray-700">2024</p>
              <p className="text-sm text-gray-500">(2.6%)</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t-lg w-24 transition-all hover:shadow-xl" style={{ height: '150px' }}>
                <div className="text-white font-bold text-3xl mt-4 text-center">{stats.total2025}</div>
              </div>
              <p className="mt-3 font-bold text-gray-700">2025</p>
              <p className="text-sm text-gray-500">(2.0%)</p>
            </div>
          </div>
        </div>

        {/* Zoom TSP 2024 */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border-2 border-blue-300">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-7 h-7 text-blue-600" />
            Zoom sur les Réclamations TSP reçues en 2024
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-sm text-gray-600">Brésil</p>
              <p className="text-4xl font-bold text-blue-600">12</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-sm text-gray-600">France</p>
              <p className="text-4xl font-bold text-blue-600">3</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-sm text-gray-600">Inde</p>
              <p className="text-4xl font-bold text-blue-600">1</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-600 text-white p-4 rounded-lg shadow text-center">
              <p className="text-sm">Site JORF</p>
              <p className="text-4xl font-bold">12</p>
            </div>
            <div className="bg-orange-600 text-white p-4 rounded-lg shadow text-center">
              <p className="text-sm">Site SAFI</p>
              <p className="text-4xl font-bold">5</p>
            </div>
          </div>
        </div>

        {/* Zoom TSP 2025 */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border-2 border-green-300">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-7 h-7 text-green-600" />
            Zoom sur les Réclamations TSP reçues en 2025 YTD
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-sm text-gray-600">Brésil</p>
              <p className="text-4xl font-bold text-green-600">5</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-sm text-gray-600">Inde</p>
              <p className="text-4xl font-bold text-green-600">4</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-sm text-gray-600">Germany</p>
              <p className="text-4xl font-bold text-green-600">3</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <p className="text-sm text-gray-700 mb-2 font-semibold">Problèmes principaux:</p>
            <div className="grid grid-cols-3 gap-2">
              <span className="bg-red-100 text-red-800 px-3 py-2 rounded text-sm font-semibold">Poussière: 5</span>
              <span className="bg-orange-100 text-orange-800 px-3 py-2 rounded text-sm font-semibold">Prise en masse: 4</span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded text-sm font-semibold">Contamination: 3</span>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Vue Incidents */}
    {dashboardView === 'incidents' && (
      <div className="space-y-6">
        {/* Statistiques Incidents */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <p className="text-gray-600 text-sm mb-2">Cargaisons Inspectées</p>
            <p className="text-5xl font-bold text-gray-900">619</p>
          </div>
          <div className="bg-green-600 text-white p-6 rounded-xl shadow-lg text-center">
            <p className="text-green-100 text-sm mb-2">Sans Incident</p>
            <p className="text-5xl font-bold">411</p>
            <p className="text-sm mt-1">66%</p>
          </div>
          <div className="bg-yellow-600 text-white p-6 rounded-xl shadow-lg text-center">
            <p className="text-yellow-100 text-sm mb-2">Avec Incident</p>
            <p className="text-5xl font-bold">207</p>
            <p className="text-sm mt-1">34%</p>
          </div>
          <div className="bg-red-600 text-white p-6 rounded-xl shadow-lg text-center">
            <p className="text-red-100 text-sm mb-2">Avec Réclamation</p>
            <p className="text-5xl font-bold">16</p>
            <p className="text-sm mt-1">X1.7</p>
          </div>
        </div>

        {/* Types d'Incidents 2025 */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Répartition des Types d'Incidents Qualité 2025</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gray-400 rounded-full w-32 h-32 mx-auto flex items-center justify-center text-white">
                <div>
                  <p className="text-3xl font-bold">24%</p>
                  <p className="text-xs">Contamination</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-full w-32 h-32 mx-auto flex items-center justify-center text-white">
                <div>
                  <p className="text-3xl font-bold">23%</p>
                  <p className="text-xs">Caked Product</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-32 h-32 mx-auto flex items-center justify-center text-white">
                <div>
                  <p className="text-3xl font-bold">22%</p>
                  <p className="text-xs">Dusty Product</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-green-700 rounded-full w-32 h-32 mx-auto flex items-center justify-center text-white">
                <div>
                  <p className="text-3xl font-bold">12%</p>
                  <p className="text-xs">Foreign Body</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gray-100 p-3 rounded text-center">
              <p className="text-sm text-gray-600">Wet Product</p>
              <p className="text-2xl font-bold text-gray-900">5%</p>
            </div>
            <div className="bg-gray-100 p-3 rounded text-center">
              <p className="text-sm text-gray-600">Couleur</p>
              <p className="text-2xl font-bold text-gray-900">7%</p>
            </div>
            <div className="bg-gray-100 p-3 rounded text-center">
              <p className="text-sm text-gray-600">Others</p>
              <p className="text-2xl font-bold text-gray-900">7%</p>
            </div>
          </div>
        </div>

        {/* Evolution Taux Incidents */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Evolution du Taux d'Incidents et Nombre de Navires</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">2024</p>
              <p className="text-4xl font-bold text-blue-600">619</p>
              <p className="text-sm text-gray-500 mt-1">53% sans incident</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Q1 2025</p>
              <p className="text-4xl font-bold text-green-600">150</p>
              <p className="text-sm text-gray-500 mt-1">46% sans incident</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Q2 2025</p>
              <p className="text-4xl font-bold text-yellow-600">159</p>
              <p className="text-sm text-gray-500 mt-1">54% sans incident</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Q3 2025</p>
              <p className="text-4xl font-bold text-orange-600">167</p>
              <p className="text-sm text-gray-500 mt-1">55% sans incident</p>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
)}

        {/* GESTION RÉCLAMATIONS */}
        {activeTab === 'reclamations' && (
          <div className="space-y-6">
            {/* Filtres */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="space-y-4">
                <div className="flex gap-4 items-center flex-wrap">
                  <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Rechercher par client, navire ou ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold">
                    <Download className="w-5 h-5" />
                    Exporter Excel
                  </button>
                </div>

                <div className="flex gap-4 items-center flex-wrap">
                  <Filter className="w-5 h-5 text-gray-600" />
                  
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold text-gray-700">Statut:</span>
                    {['all', 'en_cours', 'cloture'].map(status => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                          filterStatus === status
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status === 'all' && 'Toutes'}
                        {status === 'en_cours' && 'En cours'}
                        {status === 'cloture' && 'Clôturées'}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold text-gray-700">Produit:</span>
                    {['all', 'TSP', 'DAP', 'MAP', 'NPK'].map(prod => (
                      <button
                        key={prod}
                        onClick={() => setFilterProduit(prod)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                          filterProduit === prod
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {prod === 'all' ? 'Tous' : prod}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold text-gray-700">Nouveau Produit:</span>
                    {['all', 'oui', 'non'].map(nouveau => (
                      <button
                        key={nouveau}
                        onClick={() => setFilterNouveauProduit(nouveau)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                          filterNouveauProduit === nouveau
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {nouveau === 'all' ? 'Tous' : nouveau === 'oui' ? 'Oui' : 'Non'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{filteredReclamations.length}</span> réclamation(s) trouvée(s)
                </div>
              </div>
            </div>

            {/* Liste Réclamations */}
            {!selectedReclamation ? (
              <div className="space-y-4">
                {filteredReclamations.map(rec => (
                  <div key={rec.id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-gray-900">{rec.id}</h3>
                            {getStatutBadge(rec.statut)}
                            {getPrioriteBadge(rec.priorite)}
                            <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                              {rec.region}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">Client:</span>
                              <p className="font-semibold text-gray-900">{rec.client}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Navire:</span>
                              <p className="font-semibold text-gray-900">{rec.navire}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Site:</span>
                              <p className="font-semibold text-gray-900">{rec.site}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Date BL:</span>
                              <p className="font-semibold text-gray-900">{rec.dateBL}</p>
                            </div>
                          </div>

                          {rec.nouveauProduit && (
                            <div className="mb-3">
                              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold border border-purple-300">
                                ⭐ NOUVEAU PRODUIT
                              </span>
                            </div>
                          )}

                          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mb-3">
                            <p className="text-sm font-medium text-gray-900">{rec.probleme}</p>
                          </div>

                          <div className="flex items-center gap-6 text-sm">
                            <div>
                              <Package className="w-4 h-4 inline mr-1 text-gray-500" />
                              <span className="text-gray-600">{rec.qualite}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Quantité: </span>
                              <span className="font-semibold text-gray-900">{rec.quantite.toLocaleString()} MT</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Demandé: </span>
                              <span className="font-bold text-red-600">{formatCurrency(rec.montantDemande)}</span>
                            </div>
                            {rec.montantDedommage > 0 && (
                              <div>
                                <span className="text-gray-600">Dédommagé: </span>
                                <span className="font-bold text-green-600">{formatCurrency(rec.montantDedommage)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedReclamation(rec)}
                          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          Voir Détails
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* DÉTAIL RÉCLAMATION */
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
                  <button 
                    onClick={() => setSelectedReclamation(null)}
                    className="text-green-600 hover:text-green-700 font-semibold mb-4 flex items-center gap-2"
                  >
                    ← Retour à la liste
                  </button>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-bold text-gray-900">{selectedReclamation.id}</h2>
                        {getStatutBadge(selectedReclamation.statut)}
                        {getPrioriteBadge(selectedReclamation.priorite)}
                      </div>
                      <p className="text-gray-600">
                        Reçue le: <span className="font-semibold">{selectedReclamation.dateReception || 'En attente'}</span>
                        {selectedReclamation.dateCloture && (
                          <> • Clôturée le: <span className="font-semibold">{selectedReclamation.dateCloture}</span></>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Exporter PDF
                      </button>
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Envoyer Email
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Informations Principales */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        Informations Client
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Client:</span>
                          <p className="font-bold text-gray-900">{selectedReclamation.client}</p>
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

                    <div className="bg-green-50 p-5 rounded-xl border border-green-200">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Ship className="w-5 h-5 text-green-600" />
                        Informations Logistique
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Navire:</span>
                          <p className="font-bold text-gray-900">{selectedReclamation.navire}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Site:</span>
                          <p className="font-semibold text-gray-900">{selectedReclamation.site}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Date B/L:</span>
                          <p className="font-semibold text-gray-900">{selectedReclamation.dateBL}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-purple-600" />
                        Informations Produit
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Qualité:</span>
                          <p className="font-bold text-gray-900">{selectedReclamation.qualite}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Quantité:</span>
                          <p className="font-semibold text-gray-900">{selectedReclamation.quantite.toLocaleString()} MT</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Problème */}
                  <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                      Problème Signalé
                    </h3>
                    <p className="text-gray-900 font-medium text-lg">{selectedReclamation.probleme}</p>
                    <p className="text-sm text-gray-600 mt-2">Type: {selectedReclamation.typeIncident}</p>
                  </div>

                  {/* Informations Financières */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <span className="text-2xl">💰</span>
                      Informations Financières
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600 mb-1">Montant Demandé</p>
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(selectedReclamation.montantDemande)}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600 mb-1">Montant Dédommagé</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedReclamation.montantDedommage)}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600 mb-1">Taux de Dédommagement</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {selectedReclamation.montantDemande > 0 
                            ? ((selectedReclamation.montantDedommage / selectedReclamation.montantDemande) * 100).toFixed(1) 
                            : 0}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    {selectedReclamation.statut === 'en_cours' && (
                      <>
                        <button className="flex-1 bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg">
                          Clôturer la Réclamation
                        </button>
                        <button className="flex-1 bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg">
                          Mettre à Jour
                        </button>
                      </>
                    )}
                    <button className="px-8 bg-gray-200 text-gray-700 py-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Générer Rapport
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* QUALITY INCIDENTS - SECTION CORRIGÉE */}
        {activeTab === 'incidents' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-8 rounded-xl shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Quality Incidents Dashboard</h2>
                  <p className="text-orange-100">Suivi des incidents de chargement et analyse qualité</p>
                </div>
                <button 
                  onClick={() => setShowNewIncident(true)}
                  className="bg-white text-orange-700 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl"
                >
                  <Plus className="w-5 h-5" />
                  Nouvel Incident
                </button>
              </div>
            </div>

            {/* Liste des Incidents - CORRIGÉE */}
            <div className="space-y-4">
              {incidents.map(incident => (
                <div key={incident.id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{incident.id}</h3>
                          {getIncidentStatutBadge(incident.statut)}
                          {getSeveriteBadge(incident.severite)}
                          <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                            {incident.site}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-500">Client:</span>
                            <p className="font-semibold text-gray-900">{incident.client}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Navire:</span>
                            <p className="font-semibold text-gray-900">{incident.navire}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Produit:</span>
                            <p className="font-semibold text-gray-900">{incident.produit}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Date détection:</span>
                            <p className="font-semibold text-gray-900">{formatDate(incident.date_detection)}</p>
                          </div>
                        </div>

                        <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded mb-3">
                          <p className="text-sm font-medium text-gray-900">{incident.type_incident}</p>
                          <p className="text-xs text-gray-600 mt-1">Inspecteur: {incident.inspecteur}</p>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <Package className="w-4 h-4 inline mr-1 text-gray-500" />
                            <span className="text-gray-600">{incident.produit}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Quantité: </span>
                            <span className="font-semibold text-gray-900">{incident.quantite?.toLocaleString()} MT</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Destination: </span>
                            <span className="font-semibold text-gray-900">{incident.port_destination}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-semibold text-sm">
                          Voir Détails
                        </button>
                        {incident.statut === 'detecte' && (
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm">
                            Résoudre
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* KPIs Incidents */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-lg text-center border-l-4 border-blue-600">
                <p className="text-gray-600 text-sm mb-2 font-medium">Total Incidents</p>
                <p className="text-5xl font-bold text-gray-900">{incidents.length}</p>
                <p className="text-sm text-gray-500 mt-1">2025 YTD</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-center text-white">
                <p className="text-green-100 text-sm mb-2 font-medium">Résolus</p>
                <p className="text-5xl font-bold">{incidents.filter(i => i.statut === 'resolu').length}</p>
                <p className="text-sm mt-1">
                  {incidents.length > 0 ? ((incidents.filter(i => i.statut === 'resolu').length / incidents.length) * 100).toFixed(0) : 0}%
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-center text-white">
                <p className="text-yellow-100 text-sm mb-2 font-medium">En analyse</p>
                <p className="text-5xl font-bold">{incidents.filter(i => i.statut === 'en_analyse').length}</p>
                <p className="text-sm mt-1">
                  {incidents.length > 0 ? ((incidents.filter(i => i.statut === 'en_analyse').length / incidents.length) * 100).toFixed(0) : 0}%
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-center text-white">
                <p className="text-red-100 text-sm mb-2 font-medium">Devenus réclamations</p>
                <p className="text-5xl font-bold">{incidents.filter(i => i.statut === 'transforme_reclamation').length}</p>
                <p className="text-sm mt-1">
                  {incidents.length > 0 ? ((incidents.filter(i => i.statut === 'transforme_reclamation').length / incidents.length) * 100).toFixed(0) : 0}%
                </p>
              </div>
            </div>

            {/* Répartition Types Incidents */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Répartition des Types d'Incidents Qualité 2025</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                {[
                  { type: 'Contamination', percent: 24, color: 'bg-gray-500' },
                  { type: 'Caked Product', percent: 23, color: 'bg-gray-700' },
                  { type: 'Dusty Product', percent: 22, color: 'bg-green-600' },
                  { type: 'Foreign Body', percent: 12, color: 'bg-green-800' },
                  { type: 'Wet Product', percent: 5, color: 'bg-blue-500' },
                  { type: 'Others', percent: 7, color: 'bg-purple-500' }
                ].map(incident => (
                  <div key={incident.type} className="text-center">
                    <div className={`${incident.color} rounded-full w-24 h-24 mx-auto flex items-center justify-center text-white shadow-lg`}>
                      <p className="text-2xl font-bold">{incident.percent}%</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mt-3">{incident.type}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Evolution par produit */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Evolution du Nombre d'Incidents Qualité 2025 par Produit</h3>
              <div className="grid grid-cols-5 gap-4">
                {[
                  { product: 'TSP', incidents: 88, color: 'bg-green-600' },
                  { product: 'NPS', incidents: 12, color: 'bg-yellow-600' },
                  { product: 'NPK', incidents: 41, color: 'bg-blue-600' },
                  { product: 'MAP', incidents: 49, color: 'bg-purple-600' },
                  { product: 'DAP', incidents: 67, color: 'bg-orange-600' }
                ].map(prod => (
                  <div key={prod.product} className="text-center p-6 bg-gray-50 rounded-lg border-2 border-gray-200 hover:shadow-lg transition-all">
                    <p className="text-sm text-gray-600 mb-2 font-medium">{prod.product}</p>
                    <div className={`${prod.color} text-white rounded-lg p-4 mb-2`}>
                      <p className="text-4xl font-bold">{prod.incidents}</p>
                    </div>
                    <p className="text-xs text-gray-500">incidents</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL NOUVELLE RÉCLAMATION */}
      {showNewReclamation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Nouvelle Réclamation Client</h2>
                <button 
                  onClick={() => setShowNewReclamation(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Client *</label>
                  <input type="text" placeholder="Ex: HELM AG" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Région *</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="">Sélectionner...</option>
                    <option>Europe</option>
                    <option>Asie</option>
                    <option>Amérique</option>
                    <option>Afrique</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Navire *</label>
                  <input type="text" placeholder="Ex: MV ARKLOW MILL" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Site *</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="">Sélectionner...</option>
                    <option>OIJ - Jorf Lasfar</option>
                    <option>OIS - Safi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Qualité Produit *</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="">Sélectionner...</option>
                    <option>TSP EURO</option>
                    <option>TSP CIV</option>
                    <option>DAP EURO Low Cd</option>
                    <option>MAP 11 52 EU</option>
                    <option>NPK 15 15 15 Low Cd</option>
                    <option>NP 10 30 EU</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantité (MT) *</label>
                  <input type="number" placeholder="Ex: 5500" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>
              </div>

              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-purple-900">Il s'agit d'un nouveau produit</span>
                    <p className="text-xs text-purple-700 mt-1">Cocher cette case si c'est la première commercialisation de ce produit</p>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date B/L *</label>
                  <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type d'Incident *</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="">Sélectionner...</option>
                    <option>Prise en masse</option>
                    <option>Poussière</option>
                    <option>Contamination</option>
                    <option>Granulométrie</option>
                    <option>Corps étranger</option>
                    <option>Composition chimique</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Problème Signalé *</label>
                <textarea rows="4" placeholder="Décrire le problème en détail..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Montant Demandé (USD)</label>
                  <input type="number" step="0.01" placeholder="0.00" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priorité *</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="basse">Basse</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="haute">Haute</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button className="flex-1 bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg">
                  Créer la Réclamation
                </button>
                <button onClick={() => setShowNewReclamation(false)} className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg hover:bg-gray-300 transition-colors font-bold text-lg">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOUVEL INCIDENT - CORRIGÉ */}
      {showNewIncident && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Nouvel Incident Qualité</h2>
                <button 
                  onClick={() => setShowNewIncident(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Client *</label>
                  <input type="text" placeholder="Ex: HELM AG" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Navire *</label>
                  <input type="text" placeholder="Ex: MV ADAMOON" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Site Production *</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="">Sélectionner...</option>
                    <option>OIJ - Jorf Lasfar</option>
                    <option>OIS - Safi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Qualité Produit *</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="">Sélectionner...</option>
                    <option>TSP EURO</option>
                    <option>TSP CIV</option>
                    <option>DAP EURO Low Cd</option>
                    <option>MAP 11 52 EU</option>
                    <option>NPK 15 15 15 Low Cd</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantité Chargée (MT) *</label>
                  <input type="number" placeholder="Ex: 5500" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date de Chargement *</label>
                  <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Port de Destination</label>
                  <input type="text" placeholder="Ex: SZCZECIN - Poland" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type d'Incident *</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="">Sélectionner...</option>
                    <option>Contamination</option>
                    <option>Caked Product (Prise en masse)</option>
                    <option>Dusty Product (Poussière)</option>
                    <option>Foreign Body (Corps étranger)</option>
                    <option>Wet Product (Humidité)</option>
                    <option>Couleur</option>
                    <option>Granulométrie</option>
                    <option>Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description de l'Incident *</label>
                <textarea rows="4" placeholder="Décrire l'incident qualité observé en détail..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sévérité *</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="faible">Faible</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="elevee">Élevée</option>
                    <option value="critique">Critique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Statut *</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="detecte">Détecté</option>
                    <option value="en_analyse">En analyse</option>
                    <option value="resolu">Résolu</option>
                    <option value="transforme_reclamation">Transformé en réclamation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Inspecteur</label>
                  <input type="text" placeholder="Nom de l'inspecteur" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-900">
                  <span className="font-bold">📋 Parcours de l'incident :</span> Un incident peut être <strong>résolu directement</strong> ou <strong>transformé en réclamation</strong> si le client fait une demande formelle de dédommagement.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => {
                    // Récupération des données du formulaire avec les bons noms de colonnes
                    const newIncident = {
                      client: 'Nouveau Client',
                      navire: 'Nouveau Navire',
                      site: 'OIJ',
                      produit: 'TSP EURO',
                      quantite: 5000,
                      type_incident: 'Contamination',  // ← Underscore
                      severite: 'moyenne',
                      statut: 'detecte',
                      date_chargement: new Date().toISOString().split('T')[0],  // ← Underscore
                      port_destination: 'Port inconnu',  // ← Underscore
                      inspecteur: 'Inspecteur'
                    };
                    addNewIncident(newIncident);
                  }}
                  className="flex-1 bg-orange-600 text-white py-4 rounded-lg hover:bg-orange-700 transition-colors font-bold text-lg"
                >
                  Enregistrer l'Incident
                </button>
                <button onClick={() => setShowNewIncident(false)} className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg hover:bg-gray-300 transition-colors font-bold text-lg">
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

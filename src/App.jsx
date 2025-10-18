import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, FileText, Ship, Package, Users, Calendar, Mail, Filter, Search, Plus, Download, TrendingUp, TrendingDown, BarChart3, PieChart, X, MapPin, Factory, Droplet, Wind, Circle, Edit, Save, Trash2 } from 'lucide-react';
import { supabase } from './lib/supabase';

export default function NutricropsQualityExcellence() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterProduit, setFilterProduit] = useState('all');
  const [filterNouveauProduit, setFilterNouveauProduit] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewReclamation, setShowNewReclamation] = useState(false);
  const [showNewIncident, setShowNewIncident] = useState(false);
  const [dashboardView, setDashboardView] = useState('overview');
  const [editingIncident, setEditingIncident] = useState(null);
  const [loading, setLoading] = useState(false);

  // États pour les données
  const [reclamations, setReclamations] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [produitStats, setProduitStats] = useState([]);
  const [regionStats, setRegionStats] = useState([]);
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [topClients, setTopClients] = useState([]);

  // Charger toutes les données depuis Supabase
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadReclamations(),
      loadIncidents(),
      loadDashboardStats(),
      loadProduitStats(),
      loadRegionStats(),
      loadIncidentTypes(),
      loadTopClients()
    ]);
    setLoading(false);
  };

  const loadReclamations = async () => {
    const { data, error } = await supabase
      .from('reclamations')
      .select('*')
      .order('date_reception', { ascending: false });
    
    if (!error) {
      setReclamations(data || []);
    }
  };

  const loadIncidents = async () => {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('date_detection', { ascending: false });
    
    if (!error) {
      setIncidents(data || []);
    }
  };

  const loadDashboardStats = async () => {
    // Stats pour les réclamations
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    const { data: currentYearData } = await supabase
      .from('reclamations')
      .select('id')
      .gte('date_reception', `${currentYear}-01-01`)
      .lte('date_reception', `${currentYear}-12-31`);

    const { data: lastYearData } = await supabase
      .from('reclamations')
      .select('id')
      .gte('date_reception', `${lastYear}-01-01`)
      .lte('date_reception', `${lastYear}-12-31`);

    const { data: enCoursData } = await supabase
      .from('reclamations')
      .select('id')
      .eq('statut', 'en_cours');

    const { data: clotureesData } = await supabase
      .from('reclamations')
      .select('id')
      .eq('statut', 'cloture');

    const { data: montantsData } = await supabase
      .from('reclamations')
      .select('montant_demande, montant_dedommage');

    const totalDemande = montantsData?.reduce((sum, r) => sum + (r.montant_demande || 0), 0) || 0;
    const totalDedommage = montantsData?.reduce((sum, r) => sum + (r.montant_dedommage || 0), 0) || 0;

    setDashboardStats({
      total2024: lastYearData?.length || 0,
      total2025: currentYearData?.length || 0,
      enCours: enCoursData?.length || 0,
      cloturees: clotureesData?.length || 0,
      montantTotalDemande: totalDemande,
      montantTotalDedommage: totalDedommage,
      claimsRate2024: lastYearData ? ((lastYearData.length / 1000) * 100).toFixed(1) : 0,
      claimsRate2025: currentYearData ? ((currentYearData.length / 1000) * 100).toFixed(1) : 0
    });
  };

  const loadProduitStats = async () => {
    const { data, error } = await supabase
      .from('reclamations')
      .select('qualite');

    if (!error && data) {
      const produitCounts = data.reduce((acc, item) => {
        acc[item.qualite] = (acc[item.qualite] || 0) + 1;
        return acc;
      }, {});

      const stats = Object.entries(produitCounts).map(([produit, count]) => ({
        produit,
        count,
        color: getRandomColor()
      }));

      setProduitStats(stats);
    }
  };

  const loadRegionStats = async () => {
    const { data, error } = await supabase
      .from('reclamations')
      .select('region');

    if (!error && data) {
      const regionCounts = data.reduce((acc, item) => {
        acc[item.region] = (acc[item.region] || 0) + 1;
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
  };

  const loadIncidentTypes = async () => {
    const { data, error } = await supabase
      .from('reclamations')
      .select('type_incident');

    if (!error && data) {
      const typeCounts = data.reduce((acc, item) => {
        acc[item.type_incident] = (acc[item.type_incident] || 0) + 1;
        return acc;
      }, {});

      const stats = Object.entries(typeCounts).map(([type, count]) => ({
        type,
        count,
        color: getRandomColor()
      }));

      setIncidentTypes(stats);
    }
  };

  const loadTopClients = async () => {
    const { data, error } = await supabase
      .from('reclamations')
      .select('client');

    if (!error && data) {
      const clientCounts = data.reduce((acc, item) => {
        acc[item.client] = (acc[item.client] || 0) + 1;
        return acc;
      }, {});

      const topClients = Object.entries(clientCounts)
        .map(([client, claims]) => ({ client, claims }))
        .sort((a, b) => b.claims - a.claims)
        .slice(0, 5);

      setTopClients(topClients);
    }
  };

  const getRandomColor = () => {
    const colors = [
      'bg-green-600', 'bg-yellow-600', 'bg-blue-600', 'bg-teal-600', 
      'bg-black', 'bg-gray-600', 'bg-red-600', 'bg-orange-600'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Fonction pour ajouter un nouvel incident
  const addNewIncident = async (formData) => {
    setLoading(true);
    
    const newIncident = {
      client: formData.client,
      navire: formData.navire,
      site: formData.site,
      produit: formData.produit,
      quantite: parseInt(formData.quantite),
      type_incident: formData.type_incident,
      severite: formData.severite,
      statut: formData.statut,
      date_chargement: formData.date_chargement,
      port_destination: formData.port_destination,
      inspecteur: formData.inspecteur,
      date_detection: new Date().toISOString().split('T')[0]
    };

    const { data, error } = await supabase
      .from('incidents')
      .insert([newIncident])
      .select();
    
    if (!error) {
      setIncidents([data[0], ...incidents]);
      setShowNewIncident(false);
      // Réinitialiser le formulaire
      document.querySelectorAll('input, select, textarea').forEach(element => {
        if (element.type !== 'button' && element.type !== 'submit') {
          element.value = '';
        }
      });
    }
    setLoading(false);
  };

  // Fonction pour mettre à jour un incident
  const updateIncident = async (id, updates) => {
    setLoading(true);
    const { error } = await supabase
      .from('incidents')
      .update(updates)
      .eq('id', id);
    
    if (!error) {
      setIncidents(incidents.map(inc => 
        inc.id === id ? { ...inc, ...updates } : inc
      ));
      setEditingIncident(null);
    }
    setLoading(false);
  };

  // Fonction pour supprimer un incident
  const deleteIncident = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet incident ?')) {
      setLoading(true);
      const { error } = await supabase
        .from('incidents')
        .delete()
        .eq('id', id);
      
      if (!error) {
        setIncidents(incidents.filter(inc => inc.id !== id));
      }
      setLoading(false);
    }
  };

  // Formatage des données
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
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

  // Filtrage des réclamations
  let filteredReclamations = reclamations;
  if (filterStatus !== 'all') filteredReclamations = filteredReclamations.filter(r => r.statut === filterStatus);
  if (filterRegion !== 'all') filteredReclamations = filteredReclamations.filter(r => r.region === filterRegion);
  if (filterProduit !== 'all') filteredReclamations = filteredReclamations.filter(r => r.qualite.includes(filterProduit));
  if (filterNouveauProduit !== 'all') {
    filteredReclamations = filteredReclamations.filter(r => 
      filterNouveauProduit === 'oui' ? r.nouveau_produit === true : r.nouveau_produit === false
    );
  }
  if (searchTerm) {
    filteredReclamations = filteredReclamations.filter(r => 
      r.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.navire.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase())
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
                <p className="text-green-200 text-xs sm:text-sm hidden sm:block">Plateforme de Gestion des Réclamations Clients</p>
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
              { id: 'incidents', icon: AlertCircle, label: 'Incidents', fullLabel: 'Gestion des Incidents' }
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
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center mb-6">
            <p className="text-blue-700 font-semibold">Chargement des données...</p>
          </div>
        )}

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
                        <p className="text-gray-600 text-xs sm:text-sm font-medium">Réclamations {new Date().getFullYear() - 1}</p>
                        <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">{dashboardStats.total2024}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Claims Rate: {dashboardStats.claimsRate2024}%</p>
                      </div>
                      <TrendingDown className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-xs sm:text-sm font-medium">Réclamations {new Date().getFullYear()}</p>
                        <p className="text-3xl sm:text-4xl font-bold mt-2">{dashboardStats.total2025}</p>
                        <p className="text-xs sm:text-sm text-green-100 mt-1">Claims Rate: {dashboardStats.claimsRate2025}%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 text-green-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100 text-xs sm:text-sm font-medium">En Cours</p>
                        <p className="text-3xl sm:text-4xl font-bold mt-2">{dashboardStats.enCours}</p>
                      </div>
                      <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-xs sm:text-sm font-medium">Clôturées</p>
                        <p className="text-3xl sm:text-4xl font-bold mt-2">{dashboardStats.cloturees}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-200" />
                    </div>
                  </div>
                </div>

                {/* Graphiques côte à côte */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Répartition par Famille Engrais */}
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <PieChart className="w-6 h-6 text-green-600" />
                      Répartition par Famille Engrais {new Date().getFullYear()}
                    </h3>
                    <div className="space-y-3">
                      {produitStats.map(prod => {
                        const percentage = dashboardStats.total2025 > 0 ? 
                          ((prod.count / dashboardStats.total2025) * 100).toFixed(0) : 0;
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
                      Répartition par Régions {new Date().getFullYear()}
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
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Répartition par Type d'Incident</h3>
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
                {/* Evolution des réclamations */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Evolution du Nombre de Réclamations</h3>
                  <div className="flex items-end justify-around gap-8 h-80">
                    <div className="flex flex-col items-center">
                      <div className="bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg w-24 transition-all hover:shadow-xl" 
                           style={{ height: `${Math.max(50, (dashboardStats.total2024 / Math.max(dashboardStats.total2024, dashboardStats.total2025)) * 300)}px` }}>
                        <div className="text-white font-bold text-3xl mt-4 text-center">{dashboardStats.total2024}</div>
                      </div>
                      <p className="mt-3 font-bold text-gray-700">{new Date().getFullYear() - 1}</p>
                      <p className="text-sm text-gray-500">({dashboardStats.claimsRate2024}%)</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t-lg w-24 transition-all hover:shadow-xl" 
                           style={{ height: `${Math.max(50, (dashboardStats.total2025 / Math.max(dashboardStats.total2024, dashboardStats.total2025)) * 300)}px` }}>
                        <div className="text-white font-bold text-3xl mt-4 text-center">{dashboardStats.total2025}</div>
                      </div>
                      <p className="mt-3 font-bold text-gray-700">{new Date().getFullYear()}</p>
                      <p className="text-sm text-gray-500">({dashboardStats.claimsRate2025}%)</p>
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
                    <p className="text-gray-600 text-sm mb-2">Total Incidents</p>
                    <p className="text-5xl font-bold text-gray-900">{incidents.length}</p>
                  </div>
                  <div className="bg-green-600 text-white p-6 rounded-xl shadow-lg text-center">
                    <p className="text-green-100 text-sm mb-2">Résolus</p>
                    <p className="text-5xl font-bold">
                      {incidents.filter(i => i.statut === 'resolu').length}
                    </p>
                    <p className="text-sm mt-1">
                      {incidents.length > 0 ? 
                        ((incidents.filter(i => i.statut === 'resolu').length / incidents.length) * 100).toFixed(0) 
                        : 0}%
                    </p>
                  </div>
                  <div className="bg-yellow-600 text-white p-6 rounded-xl shadow-lg text-center">
                    <p className="text-yellow-100 text-sm mb-2">En analyse</p>
                    <p className="text-5xl font-bold">
                      {incidents.filter(i => i.statut === 'en_analyse').length}
                    </p>
                    <p className="text-sm mt-1">
                      {incidents.length > 0 ? 
                        ((incidents.filter(i => i.statut === 'en_analyse').length / incidents.length) * 100).toFixed(0) 
                        : 0}%
                    </p>
                  </div>
                  <div className="bg-red-600 text-white p-6 rounded-xl shadow-lg text-center">
                    <p className="text-red-100 text-sm mb-2">Devenus réclamations</p>
                    <p className="text-5xl font-bold">
                      {incidents.filter(i => i.statut === 'transforme_reclamation').length}
                    </p>
                    <p className="text-sm mt-1">
                      {incidents.length > 0 ? 
                        ((incidents.filter(i => i.statut === 'transforme_reclamation').length / incidents.length) * 100).toFixed(0) 
                        : 0}%
                    </p>
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
                    {['all', ...new Set(reclamations.map(r => r.qualite))].filter(Boolean).map(prod => (
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
                              <p className="font-semibold text-gray-900">{formatDate(rec.date_bl)}</p>
                            </div>
                          </div>

                          {rec.nouveau_produit && (
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
                              <span className="font-semibold text-gray-900">{rec.quantite?.toLocaleString()} MT</span>
                            </div>
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
                        Reçue le: <span className="font-semibold">{formatDate(selectedReclamation.date_reception) || 'En attente'}</span>
                        {selectedReclamation.date_cloture && (
                          <> • Clôturée le: <span className="font-semibold">{formatDate(selectedReclamation.date_cloture)}</span></>
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
                          <p className="font-semibold text-gray-900">{formatDate(selectedReclamation.date_bl)}</p>
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
                          <p className="font-semibold text-gray-900">{selectedReclamation.quantite?.toLocaleString()} MT</p>
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
                    <p className="text-sm text-gray-600 mt-2">Type: {selectedReclamation.type_incident}</p>
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
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(selectedReclamation.montant_demande)}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600 mb-1">Montant Dédommagé</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedReclamation.montant_dedommage)}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600 mb-1">Taux de Dédommagement</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {selectedReclamation.montant_demande > 0 
                            ? ((selectedReclamation.montant_dedommage / selectedReclamation.montant_demande) * 100).toFixed(1) 
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

        {/* GESTION DES INCIDENTS */}
        {activeTab === 'incidents' && (
          <div className="space-y-6">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-8 rounded-xl shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Gestion des Incidents Qualité</h2>
                  <p className="text-orange-100">Suivi et gestion des incidents de chargement et analyse qualité</p>
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

            {/* Liste des Incidents */}
            <div className="space-y-4">
              {incidents.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun incident trouvé</h3>
                  <p className="text-gray-500">Commencez par créer votre premier incident qualité.</p>
                </div>
              ) : (
                incidents.map(incident => (
                  <div key={incident.id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-gray-900">{incident.id}</h3>
                            {editingIncident?.id === incident.id ? (
                              <select
                                value={editingIncident.statut}
                                onChange={(e) => setEditingIncident({
                                  ...editingIncident,
                                  statut: e.target.value
                                })}
                                className="px-3 py-1 rounded-full text-xs font-semibold border border-blue-300 bg-blue-50"
                              >
                                <option value="detecte">Détecté</option>
                                <option value="en_analyse">En analyse</option>
                                <option value="resolu">Résolu</option>
                                <option value="transforme_reclamation">Réclamation</option>
                              </select>
                            ) : (
                              getIncidentStatutBadge(incident.statut)
                            )}
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
                              <p className="font-semibold text-gray-900">
                                {formatDate(incident.date_detection)}
                              </p>
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
                          {editingIncident?.id === incident.id ? (
                            <>
                              <button 
                                onClick={() => updateIncident(incident.id, {
                                  statut: editingIncident.statut
                                })}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm flex items-center gap-2"
                              >
                                <Save className="w-4 h-4" />
                                Sauvegarder
                              </button>
                              <button 
                                onClick={() => setEditingIncident(null)}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold text-sm"
                              >
                                Annuler
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => setEditingIncident(incident)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm flex items-center gap-2"
                              >
                                <Edit className="w-4 h-4" />
                                Modifier
                              </button>
                              <button 
                                onClick={() => deleteIncident(incident.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Supprimer
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* KPIs Incidents */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-lg text-center border-l-4 border-blue-600">
                <p className="text-gray-600 text-sm mb-2 font-medium">Total Incidents</p>
                <p className="text-5xl font-bold text-gray-900">{incidents.length}</p>
                <p className="text-sm text-gray-500 mt-1">2025 YTD</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-center text-white">
                <p className="text-green-100 text-sm mb-2 font-medium">Résolus</p>
                <p className="text-5xl font-bold">
                  {incidents.filter(i => i.statut === 'resolu').length}
                </p>
                <p className="text-sm mt-1">
                  {incidents.length > 0 ? 
                    ((incidents.filter(i => i.statut === 'resolu').length / incidents.length) * 100).toFixed(0) 
                    : 0}%
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-center text-white">
                <p className="text-yellow-100 text-sm mb-2 font-medium">En analyse</p>
                <p className="text-5xl font-bold">
                  {incidents.filter(i => i.statut === 'en_analyse').length}
                </p>
                <p className="text-sm mt-1">
                  {incidents.length > 0 ? 
                    ((incidents.filter(i => i.statut === 'en_analyse').length / incidents.length) * 100).toFixed(0) 
                    : 0}%
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-center text-white">
                <p className="text-red-100 text-sm mb-2 font-medium">Devenus réclamations</p>
                <p className="text-5xl font-bold">
                  {incidents.filter(i => i.statut === 'transforme_reclamation').length}
                </p>
                <p className="text-sm mt-1">
                  {incidents.length > 0 ? 
                    ((incidents.filter(i => i.statut === 'transforme_reclamation').length / incidents.length) * 100).toFixed(0) 
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL NOUVEL INCIDENT */}
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
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                addNewIncident(data);
              }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Client *</label>
                    <input 
                      name="client"
                      type="text" 
                      placeholder="Ex: HELM AG" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Navire *</label>
                    <input 
                      name="navire"
                      type="text" 
                      placeholder="Ex: MV ADAMOON" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Site Production *</label>
                    <select 
                      name="site"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner...</option>
                      <option value="OIJ">OIJ - Jorf Lasfar</option>
                      <option value="OIS">OIS - Safi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Produit *</label>
                    <select 
                      name="produit"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner...</option>
                      <option value="TSP EURO">TSP EURO</option>
                      <option value="TSP CIV">TSP CIV</option>
                      <option value="DAP EURO Low Cd">DAP EURO Low Cd</option>
                      <option value="MAP 11 52 EU">MAP 11 52 EU</option>
                      <option value="NPK 15 15 15 Low Cd">NPK 15 15 15 Low Cd</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quantité (MT) *</label>
                    <input 
                      name="quantite"
                      type="number" 
                      placeholder="Ex: 5500" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type d'Incident *</label>
                    <select 
                      name="type_incident"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Contamination">Contamination</option>
                      <option value="Prise en masse">Prise en masse</option>
                      <option value="Poussière">Poussière</option>
                      <option value="Corps étranger">Corps étranger</option>
                      <option value="Humidité">Humidité</option>
                      <option value="Couleur">Couleur</option>
                      <option value="Granulométrie">Granulométrie</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date de Chargement *</label>
                    <input 
                      name="date_chargement"
                      type="date" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Port de Destination</label>
                    <input 
                      name="port_destination"
                      type="text" 
                      placeholder="Ex: SZCZECIN - Poland" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sévérité *</label>
                    <select 
                      name="severite"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="faible">Faible</option>
                      <option value="moyenne">Moyenne</option>
                      <option value="elevee">Élevée</option>
                      <option value="critique">Critique</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Statut *</label>
                    <select 
                      name="statut"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="detecte">Détecté</option>
                      <option value="en_analyse">En analyse</option>
                      <option value="resolu">Résolu</option>
                      <option value="transforme_reclamation">Transformé en réclamation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Inspecteur</label>
                  <input 
                    name="inspecteur"
                    type="text" 
                    placeholder="Nom de l'inspecteur" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-orange-600 text-white py-4 rounded-lg hover:bg-orange-700 transition-colors font-bold text-lg"
                  >
                    {loading ? 'Enregistrement...' : 'Enregistrer l\'Incident'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowNewIncident(false)} 
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg hover:bg-gray-300 transition-colors font-bold text-lg"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

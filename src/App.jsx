import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, FileText, Ship, Package, Users, Calendar, Mail, Filter, Search, Plus, Download, TrendingUp, TrendingDown, BarChart3, PieChart, X, MapPin, Edit, Save, Trash2 } from 'lucide-react';
import { supabase } from './lib/supabase';

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
  const [editingIncident, setEditingIncident] = useState(null);
  const [loading, setLoading] = useState(false);

  // États pour les données
  const [reclamations, setReclamations] = useState([]);
  const [incidents, setIncidents] = useState([]);

  // Charger les données depuis Supabase
  useEffect(() => {
    loadReclamations();
    loadIncidents();
  }, []);

  const loadReclamations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reclamations')
      .select('*')
      .order('date_reception', { ascending: false });
    
    if (error) {
      console.error('Error loading reclamations:', error);
    } else {
      setReclamations(data || []);
    }
    setLoading(false);
  };

  const loadIncidents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('date_detection', { ascending: false });
    
    if (error) {
      console.error('Error loading incidents:', error);
    } else {
      setIncidents(data || []);
    }
    setLoading(false);
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
    
    if (error) {
      console.error('Error adding incident:', error);
      alert('Erreur lors de l\'ajout de l\'incident');
    } else {
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
    
    if (error) {
      console.error('Error updating incident:', error);
      alert('Erreur lors de la mise à jour de l\'incident');
    } else {
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
      
      if (error) {
        console.error('Error deleting incident:', error);
        alert('Erreur lors de la suppression de l\'incident');
      } else {
        setIncidents(incidents.filter(inc => inc.id !== id));
      }
      setLoading(false);
    }
  };

  // Formatage des dates pour l'affichage
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
      {/* Header */}
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

            {loading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-blue-700 font-semibold">Chargement des données...</p>
              </div>
            )}

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
                              <span className="font-semibold text-gray-900">
                                {incident.quantite?.toLocaleString()} MT
                              </span>
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

            {/* Statistiques des Incidents */}
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

        {/* Autres onglets (Dashboard et Réclamations) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold text-gray-700">Dashboard Quality Excellence</h2>
              <p className="text-gray-600">Vue d'ensemble des indicateurs qualité</p>
            </div>
          </div>
        )}

        {activeTab === 'reclamations' && (
          <div className="space-y-6">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold text-gray-700">Gestion des Réclamations</h2>
              <p className="text-gray-600">Interface de gestion des réclamations clients</p>
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
              <form id="incident-form" onSubmit={(e) => {
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Qualité Produit *</label>
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quantité Chargée (MT) *</label>
                    <input 
                      name="quantite"
                      type="number" 
                      placeholder="Ex: 5500" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date de Chargement *</label>
                    <input 
                      name="date_chargement"
                      type="date" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Port de Destination</label>
                    <input 
                      name="port_destination"
                      type="text" 
                      placeholder="Ex: SZCZECIN - Poland" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
                      <option value="Caked Product">Caked Product (Prise en masse)</option>
                      <option value="Dusty Product">Dusty Product (Poussière)</option>
                      <option value="Foreign Body">Foreign Body (Corps étranger)</option>
                      <option value="Wet Product">Wet Product (Humidité)</option>
                      <option value="Couleur">Couleur</option>
                      <option value="Granulométrie">Granulométrie</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description de l'Incident *</label>
                  <textarea 
                    name="description"
                    rows="4" 
                    placeholder="Décrire l'incident qualité observé en détail..." 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Inspecteur</label>
                    <input 
                      name="inspecteur"
                      type="text" 
                      placeholder="Nom de l'inspecteur" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  </div>
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

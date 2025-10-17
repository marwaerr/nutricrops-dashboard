import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, FileText, Ship, Package, Users, Calendar, Mail, Filter, Search, Plus, Download, TrendingUp, TrendingDown, BarChart3, PieChart, X, MapPin, Factory, Droplet, Wind, Circle } from 'lucide-react';

export default function NutricropsQualityExcellence() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterProduit, setFilterProduit] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewReclamation, setShowNewReclamation] = useState(false);
  const [dashboardView, setDashboardView] = useState('overview');

  // Données réelles enrichies
  const reclamations = [
    {
      id: 'REC-2024-001', region: 'Europe', pays: 'France', client: 'Interore', navire: 'MV MUROS',
      dateBL: '28/01/2024', dateReception: '06/02/2024', statut: 'cloture', site: 'OIS',
      qualite: 'TSP', quantite: 3300, probleme: 'Prise en masse', typeIncident: 'Aspects Physiques',
      priorite: 'haute', montantDemande: 25000, montantDedommage: 25000
    },
    {
      id: 'REC-2024-002', region: 'Amérique', pays: 'Brésil', client: 'OCP fertilizantes', navire: 'MV DODO',
      dateBL: '27/05/2024', dateReception: '19/06/2024', statut: 'cloture', site: 'OIJ',
      qualite: 'TSP', quantite: 5500, probleme: 'Poussière excessive', typeIncident: 'Aspects Physiques',
      priorite: 'haute', montantDemande: 42000, montantDedommage: 42000
    },
    {
      id: 'REC-2025-003', region: 'Europe', pays: 'Germany', client: 'HELM AG', navire: 'MV ADAMOON',
      dateBL: '12/06/2025', dateReception: '10/07/2025', statut: 'en_cours', site: 'OIJ',
      qualite: 'TSP EURO', quantite: 5500, probleme: 'Présence de poussière excessive', typeIncident: 'Aspects Physiques',
      priorite: 'haute', montantDemande: 27994.45, montantDedommage: 0,
      portDechargement: 'SZCZECIN - Poland'
    },
    {
      id: 'REC-2025-004', region: 'Europe', pays: 'Germany', client: 'HELM AG', navire: 'MV TOMINI LEVANT',
      dateBL: '12/05/2025', dateReception: '17/07/2025', statut: 'en_cours', site: 'OIJ',
      qualite: 'TSP EURO', quantite: 5500, probleme: 'Problème qualité majeur TSP', typeIncident: 'Aspects Physiques',
      priorite: 'haute', montantDemande: 435248.29, montantDedommage: 0,
      portDechargement: 'KLAIPEDA - Lithuania'
    },
    {
      id: 'REC-2025-005', region: 'Asie', pays: 'Inde', client: 'NFL', navire: 'MV ANAFI',
      dateBL: '01/06/2025', dateReception: '12/09/2025', statut: 'en_cours', site: 'OIJ',
      qualite: 'TSP CIV', quantite: 16500, probleme: 'Prise en masse', typeIncident: 'Aspects Physiques',
      priorite: 'haute', montantDemande: 42350.12, montantDedommage: 0
    },
    {
      id: 'REC-2025-006', region: 'Asie', pays: 'Inde', client: 'NFL', navire: 'MV PROPEL FORTUNE',
      dateBL: '27/06/2025', dateReception: '12/09/2025', statut: 'en_cours', site: 'OIJ',
      qualite: 'TSP CIV', quantite: 22000, probleme: 'Prise en masse', typeIncident: 'Aspects Physiques',
      priorite: 'haute', montantDemande: 90122.92, montantDedommage: 0
    },
    {
      id: 'REC-2025-007', region: 'Amérique', pays: 'Brésil', client: 'OCP Brazil', navire: 'MV SOLANA',
      dateBL: '01/06/2025', dateReception: '01/07/2025', statut: 'en_cours', site: 'OIJ',
      qualite: 'TSP Special', quantite: 8000, probleme: 'Prise en masse + Poussière', typeIncident: 'Aspects Physiques',
      priorite: 'moyenne', montantDemande: 35000, montantDedommage: 0
    },
    {
      id: 'REC-2024-008', region: 'Europe', pays: 'Germany', client: 'HELM AG', navire: 'MV SUPRA',
      dateBL: '23/03/2025', dateReception: '28/05/2025', statut: 'cloture', site: 'OIJ',
      qualite: 'DAP EURO Low Cd', quantite: 16118, probleme: 'Non-conformité qualité', typeIncident: 'Chimique',
      priorite: 'haute', montantDemande: 33776.84, montantDedommage: 33776.84,
      dateCloture: '15/09/2025'
    },
    {
      id: 'REC-2025-009', region: 'Eastern Europe', pays: 'Roumanie', client: 'SEEFCO', navire: 'MV BASIC ISLAND',
      dateBL: '21/02/2025', dateReception: '17/03/2025', statut: 'cloture', site: 'OIJ',
      qualite: 'NP 10 30 EU', quantite: 9320, probleme: 'Contamination', typeIncident: 'Aspects Physiques',
      priorite: 'haute', montantDemande: 80430.60, montantDedommage: 80430.60,
      dateCloture: '26/08/2025'
    },
    {
      id: 'REC-2025-010', region: 'Asie', pays: 'Inde', client: 'PPL', navire: 'MV GENCO ENTERPRISE',
      dateBL: '09/05/2025', dateReception: '24/06/2025', statut: 'en_cours', site: 'OIJ',
      qualite: 'TSP CIV', quantite: 4500, probleme: 'Poussière', typeIncident: 'Aspects Physiques',
      priorite: 'moyenne', montantDemande: 18000, montantDedommage: 0
    },
    {
      id: 'REC-2024-011', region: 'Amérique', pays: 'Brésil', client: 'OCP fertilizantes', navire: 'MV ENTERPRISE',
      dateBL: '20/05/2024', dateReception: '19/06/2024', statut: 'cloture', site: 'OIJ',
      qualite: 'TSP', quantite: 6200, probleme: 'Granulométrie', typeIncident: 'Aspects Physiques',
      priorite: 'moyenne', montantDemande: 28000, montantDedommage: 28000,
      dateCloture: '15/08/2024'
    },
    {
      id: 'REC-2024-012', region: 'Europe', pays: 'France', client: 'Timac', navire: 'MV ARTEAGA',
      dateBL: '04/07/2024', dateReception: '05/08/2024', statut: 'cloture', site: 'OIS',
      qualite: 'MAP 11 52 EU', quantite: 3800, probleme: 'Composition chimique', typeIncident: 'Chimique',
      priorite: 'basse', montantDemande: 15000, montantDedommage: 15000,
      dateCloture: '30/09/2024'
    }
  ];

  // Statistiques calculées
  const stats = {
    total2024: 46,
    total2025: 30,
    q1_2024: 8,
    q2_2024: 11,
    q3_2024: 14,
    q4_2024: 13,
    q1_2025: 8,
    q2_2025: 7,
    q3_2025: 15,
    q4_2025: null, // En cours
    enCours: reclamations.filter(r => r.statut === 'en_cours').length,
    cloturees: reclamations.filter(r => r.statut === 'cloture').length,
    claimsRate2024: 2.6,
    claimsRate2025: 2.0,
    montantTotalDemande: reclamations.reduce((sum, r) => sum + r.montantDemande, 0),
    montantTotalDedommage: reclamations.reduce((sum, r) => sum + r.montantDedommage, 0)
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
        {priorite.charAt(0).toUpperCase() + priorite.slice(1)}
      </span>
    );
  };

  // Filtrage
  let filteredReclamations = reclamations;
  if (filterStatus !== 'all') filteredReclamations = filteredReclamations.filter(r => r.statut === filterStatus);
  if (filterRegion !== 'all') filteredReclamations = filteredReclamations.filter(r => r.region === filterRegion);
  if (filterProduit !== 'all') filteredReclamations = filteredReclamations.filter(r => r.qualite.includes(filterProduit));
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
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border-2 border-white/30">
                <Package className="w-10 h-10" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-4xl font-bold">OCP</h1>
                  <span className="text-2xl font-light">|</span>
                  <h2 className="text-3xl font-semibold">NUTRICROPS</h2>
                </div>
                <p className="text-green-100 text-lg font-medium">Quality Excellence Dashboard</p>
                <p className="text-green-200 text-sm">Plateforme de Gestion des Réclamations Clients</p>
              </div>
            </div>
            <button 
              onClick={() => setShowNewReclamation(true)}
              className="bg-white text-green-700 px-8 py-4 rounded-xl font-bold hover:bg-green-50 transition-all flex items-center gap-3 shadow-xl hover:shadow-2xl text-lg"
            >
              <Plus className="w-6 h-6" />
              Nouvelle Réclamation
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b-2 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard Quality Excellence' },
              { id: 'reclamations', icon: FileText, label: 'Gestion Réclamations' },
              { id: 'incidents', icon: AlertCircle, label: 'Quality Incidents' },
              { id: 'nouveaux_produits', icon: Package, label: 'Nouveaux Produits' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 font-bold transition-all relative flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'text-green-700 bg-green-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* DASHBOARD QUALITY EXCELLENCE */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Sous-navigation Dashboard */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
              <div className="flex gap-3">
                {['overview', 'claims', 'incidents', 'products'].map(view => (
                  <button
                    key={view}
                    onClick={() => setDashboardView(view)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      dashboardView === view
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {view === 'overview' && 'Vue d\'ensemble'}
                    {view === 'claims' && 'Quality Claims'}
                    {view === 'incidents' && 'Quality Incidents'}
                    {view === 'products' && 'Nouveaux Produits'}
                  </button>
                ))}
              </div>
            </div>

            {/* Vue Overview */}
            {dashboardView === 'overview' && (
              <div className="space-y-6">
                {/* KPIs Principaux */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Réclamations 2024</p>
                        <p className="text-4xl font-bold text-gray-900 mt-2">{stats.total2024}</p>
                        <p className="text-sm text-gray-500 mt-1">Claims Rate: {stats.claimsRate2024}%</p>
                      </div>
                      <TrendingDown className="w-12 h-12 text-blue-500" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">Réclamations 2025</p>
                        <p className="text-4xl font-bold mt-2">{stats.total2025}</p>
                        <p className="text-sm text-green-100 mt-1">Claims Rate: {stats.claimsRate2025}%</p>
                      </div>
                      <TrendingUp className="w-12 h-12 text-green-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100 text-sm font-medium">En Cours</p>
                        <p className="text-4xl font-bold mt-2">{stats.enCours}</p>
                      </div>
                      <Clock className="w-12 h-12 text-yellow-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm font-medium">Clôturées</p>
                        <p className="text-4xl font-bold mt-2">{stats.cloturees}</p>
                      </div>
                      <CheckCircle className="w-12 h-12 text-emerald-200" />
                    </div>
                  </div>
                </div>

                {/* Evolution Claims Rate */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evolution du Claims Rate</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-green-100">
                          <th className="px-4 py-3 text-left font-bold text-gray-700">Fertilisers</th>
                          <th className="px-4 py-3 text-center font-bold text-gray-700">2022</th>
                          <th className="px-4 py-3 text-center font-bold text-gray-700">2023</th>
                          <th className="px-4 py-3 text-center font-bold text-gray-700">2024</th>
                          <th className="px-4 py-3 text-center font-bold text-gray-700">2025</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-4 font-semibold">Claims Rate</td>
                          <td className="px-4 py-4 text-center text-lg font-bold text-red-600">2.58%</td>
                          <td className="px-4 py-4 text-center text-lg font-bold text-orange-600">2.74%</td>
                          <td className="px-4 py-4 text-center text-lg font-bold text-yellow-600">2.6%</td>
                          <td className="px-4 py-4 text-center text-lg font-bold text-green-600">2.0%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-800 font-semibold flex items-center gap-2">
                      <TrendingDown className="w-5 h-5" />
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

            {/* Vue Nouveaux Produits */}
            {dashboardView === 'products' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Package className="w-7 h-7 text-purple-600" />
                    Répartition des Nouveaux Produits par An
                  </h3>
                  <div className="flex items-end justify-around gap-8 h-96">
                    <div className="flex flex-col items-center">
                      <div className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg w-32" style={{ height: '300px' }}>
                        <div className="text-white font-bold text-5xl mt-6 text-center">36</div>
                      </div>
                      <p className="mt-4 font-bold text-xl text-gray-700">Total</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg w-32" style={{ height: '200px' }}>
                        <div className="text-white font-bold text-5xl mt-6 text-center">20</div>
                      </div>
                      <p className="mt-4 font-bold text-xl text-gray-700">2024</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t-lg w-32" style={{ height: '160px' }}>
                        <div className="text-white font-bold text-5xl mt-6 text-center">16</div>
                      </div>
                      <p className="mt-4 font-bold text-xl text-gray-700">2025</p>
                    </div>
                  </div>
                </div>

                {/* Liste produits avec réclamations */}
                <div className="bg-red-50 p-6 rounded-xl shadow-lg border-2 border-red-300">
                  <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6" />
                    Nouveaux Produits avec Réclamations
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                      <span className="font-semibold text-gray-900">TSP Ofas - India</span>
                      <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">YES</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                      <span className="font-semibold text-gray-900">TSP Poudre - Brazil</span>
                      <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">YES</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                      <span className="font-semibold text-gray-900">NP 10 30 EU - Romania</span>
                      <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">YES</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                      <span className="font-semibold text-gray-900">TSP 4 42 Low Cd - Europe</span>
                      <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">YES</span>
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

        {/* QUALITY INCIDENTS */}
        {activeTab === 'incidents' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-8 rounded-xl shadow-2xl">
              <h2 className="text-3xl font-bold mb-2">Quality Incidents Dashboard</h2>
              <p className="text-orange-100">Suivi des incidents de chargement et analyse qualité</p>
            </div>

            {/* KPIs Incidents */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-lg text-center border-l-4 border-blue-600">
                <p className="text-gray-600 text-sm mb-2 font-medium">Cargaisons Inspectées</p>
                <p className="text-5xl font-bold text-gray-900">619</p>
                <p className="text-sm text-gray-500 mt-1">2024-2025</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-center text-white">
                <p className="text-green-100 text-sm mb-2 font-medium">Sans Incident</p>
                <p className="text-5xl font-bold">411</p>
                <p className="text-sm mt-1">66%</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-center text-white">
                <p className="text-yellow-100 text-sm mb-2 font-medium">Avec Incident</p>
                <p className="text-5xl font-bold">207</p>
                <p className="text-sm mt-1">34%</p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-center text-white">
                <p className="text-red-100 text-sm mb-2 font-medium">Facteur Multiplication</p>
                <p className="text-5xl font-bold">X1.7</p>
                <p className="text-sm mt-1">Incident → Réclamation</p>
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

        {/* NOUVEAUX PRODUITS */}
        {activeTab === 'nouveaux_produits' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-8 rounded-xl shadow-2xl">
              <h2 className="text-3xl font-bold mb-2">Nouveaux Produits</h2>
              <p className="text-purple-100">Suivi des lancements et réclamations associées</p>
            </div>

            {/* Stats Nouveaux Produits */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 rounded-xl shadow-lg text-white text-center">
                <p className="text-purple-100 mb-2 font-medium">Total Nouveaux Produits</p>
                <p className="text-6xl font-bold">36</p>
                <p className="text-sm mt-2 text-purple-100">2024-2025</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 rounded-xl shadow-lg text-white text-center">
                <p className="text-green-100 mb-2 font-medium">Lancés en 2024</p>
                <p className="text-6xl font-bold">20</p>
                <p className="text-sm mt-2 text-green-100">56%</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-8 rounded-xl shadow-lg text-white text-center">
                <p className="text-yellow-100 mb-2 font-medium">Lancés en 2025</p>
                <p className="text-6xl font-bold">16</p>
                <p className="text-sm mt-2 text-yellow-100">44%</p>
              </div>
            </div>

            {/* Produits avec réclamations */}
            <div className="bg-red-50 p-6 rounded-xl shadow-lg border-2 border-red-300">
              <h3 className="text-2xl font-bold text-red-800 mb-4 flex items-center gap-2">
                <AlertCircle className="w-7 h-7" />
                Nouveaux Produits avec Réclamations (4 produits)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { product: 'TSP Ofas', destination: 'India', date: '04/02/2024', site: 'Jorf lasfar' },
                  { product: 'TSP Poudre', destination: 'Brazil', date: '10/18/2024', site: 'Jorf lasfar' },
                  { product: 'NP 10 30 EU', destination: 'Romania', date: '11/27/2024', site: 'Jorf lasfar' },
                  { product: 'TSP 4 42 Low Cd', destination: 'Europe', date: '6/17/2025', site: 'Jorf lasfar' }
                ].map((prod, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-lg shadow-md border-l-4 border-red-600">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900 text-lg">{prod.product}</h4>
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">CLAIM</span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-semibold">Destination:</span> {prod.destination}</p>
                      <p><span className="font-semibold">Date clôture:</span> {prod.date}</p>
                      <p><span className="font-semibold">Site:</span> {prod.site}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Liste complète */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Liste des Nouveaux Produits 2025</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold">Produit</th>
                      <th className="px-4 py-3 text-left font-bold">Destination</th>
                      <th className="px-4 py-3 text-left font-bold">Date Clôture</th>
                      <th className="px-4 py-3 text-left font-bold">Site</th>
                      <th className="px-4 py-3 text-center font-bold">Claim</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { product: 'TSP S', destination: 'Spain, Chili, India', date: '03/03/2025', site: 'Safi', claim: false },
                      { product: 'TSP 5 40 Blendable', destination: 'Brazil, Argentina, Mali, Zambia', date: '03/10/2025', site: 'Jorf lasfar', claim: false },
                      { product: 'NPS 1 30 9S', destination: 'Brazil', date: '3/26/2025', site: 'Jorf lasfar', claim: false },
                      { product: 'TSP Euro', destination: 'Spain', date: '4/17/2025', site: 'Jorf lasfar', claim: false },
                      { product: 'TSP Pakistan', destination: 'Pakistan', date: '4/24/2025', site: 'Jorf lasfar', claim: false },
                      { product: 'TSP 4 42 Low Cd', destination: 'Europe', date: '6/17/2025', site: 'Jorf lasfar', claim: true },
                      { product: 'TSP 2Zn Low Cd', destination: 'Europe', date: '07/10/2025', site: 'Jorf lasfar', claim: false },
                      { product: 'TSP Bangladech-Safi', destination: 'Bangladesh', date: '08/04/2025', site: 'Safi', claim: false }
                    ].map((item, idx) => (
                      <tr key={idx} className={`hover:bg-gray-50 ${item.claim ? 'bg-red-50' : ''}`}>
                        <td className="px-4 py-3 font-semibold text-gray-900">{item.product}</td>
                        <td className="px-4 py-3 text-gray-600">{item.destination}</td>
                        <td className="px-4 py-3 text-gray-600">{item.date}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.site === 'Jorf lasfar' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {item.site}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.claim ? (
                            <span className="bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold">YES</span>
                          ) : (
                            <span className="bg-gray-200 text-gray-600 px-4 py-1 rounded-full text-xs font-bold">NO</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
    </div>
  );
}
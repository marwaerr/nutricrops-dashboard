import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, FileText, Ship, Package, Users, Calendar, Mail, Filter, Search, Plus, Download, TrendingUp, TrendingDown, BarChart3, PieChart, X, MapPin, Edit, Save, Trash2 } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function NutricropsQualityExcellence() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterProduit, setFilterProduit] = useState('all');
  const [filterNouveauProduit, setFilterNouveauProduit] = useState('all');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewReclamation, setShowNewReclamation] = useState(false);
  const [showNewIncident, setShowNewIncident] = useState(false);
  const [dashboardView, setDashboardView] = useState('overview');
  const [editingIncident, setEditingIncident] = useState(null);
  const [editingReclamation, setEditingReclamation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteReclamationConfirm, setDeleteReclamationConfirm] = useState(null);
  const [editingFinances, setEditingFinances] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [evolutionData, setEvolutionData] = useState([]);

  // États pour les filtres incidents
  const [filterIncidentStatus, setFilterIncidentStatus] = useState('all');
  const [filterIncidentSeverite, setFilterIncidentSeverite] = useState('all');
  const [filterIncidentProduit, setFilterIncidentProduit] = useState('all');
  const [filterIncidentYear, setFilterIncidentYear] = useState(new Date().getFullYear());
  const [searchIncidentTerm, setSearchIncidentTerm] = useState('');

  // États pour les données
  const [reclamations, setReclamations] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalIncidents: 0,
    totalReclamations: 0,
    facteurMultiplication: '0.0',
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

  // Données pour les régions et pays
  const [regionsData, setRegionsData] = useState({
    Europe: [
      'France', 'Allemagne', 'Espagne', 'Italie', 'Royaume-Uni', 'Pays-Bas', 'Belgique', 
      'Pologne', 'Portugal', 'Suède', 'Danemark', 'Finlande', 'Norvège', 'Suisse', 'Autriche'
    ],
    Asie: [
      'Chine', 'Japon', 'Corée du Sud', 'Inde', 'Vietnam', 'Thaïlande', 'Malaisie', 
      'Indonésie', 'Philippines', 'Bangladesh', 'Pakistan', 'Sri Lanka', 'Taiwan'
    ],
    Amérique: [
      'États-Unis', 'Canada', 'Brésil', 'Mexique', 'Argentine', 'Chili', 'Colombie', 
      'Pérou', 'Uruguay', 'Équateur', 'Venezuela'
    ],
    Afrique: [
      'Maroc', 'Algérie', 'Tunisie', 'Égypte', 'Sénégal', 'Côte d\'Ivoire', 'Nigeria', 
      'Ghana', 'Kenya', 'Afrique du Sud', 'Éthiopie', 'Tanzanie'
    ]
  });

  // Données pour les produits et sous-produits
  const [produitsData, setProduitsData] = useState({
    'TSP EURO': ['TSP Standard', 'TSP Premium', 'TSP Low Cd'],
    'TSP CIV': ['TSP CIV Standard', 'TSP CIV Premium'],
    'DAP EURO Low Cd': ['DAP 18-46-0', 'DAP Premium', 'DAP Low Cadmium'],
    'MAP 11 52 EU': ['MAP Standard', 'MAP Premium', 'MAP Soluble'],
    'NPK 15 15 15 Low Cd': ['NPK 15-15-15', 'NPK 12-12-17', 'NPK 20-10-10'],
    'NP 10 30 EU': ['NP 10-30-0', 'NP 12-32-0']
  });

  // États pour le formulaire de réclamation
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProduit, setSelectedProduit] = useState('');
  const [searchPays, setSearchPays] = useState('');
  const [showPaysSuggestions, setShowPaysSuggestions] = useState(false);

  // États pour le formulaire d'incident
  const [selectedRegionIncident, setSelectedRegionIncident] = useState('');
  const [selectedProduitIncident, setSelectedProduitIncident] = useState('');
  const [searchPaysIncident, setSearchPaysIncident] = useState('');
  const [showPaysSuggestionsIncident, setShowPaysSuggestionsIncident] = useState(false);

  // Charger toutes les données depuis Supabase
  useEffect(() => {
    loadAllData();
  }, [selectedYear]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadReclamations(),
        loadIncidents()
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

  const loadIncidents = async () => {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading incidents:', error);
      } else {
        setIncidents(data || []);
      }
    } catch (error) {
      console.error('Error in loadIncidents:', error);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const currentYear = selectedYear;
      const previousYear = currentYear - 1;

      // Compter les réclamations par année
      const { data: currentYearReclamations } = await supabase
        .from('reclamations')
        .select('id')
        .gte('created_at', `${currentYear}-01-01`)
        .lte('created_at', `${currentYear}-12-31`);

      const { data: previousYearReclamations } = await supabase
        .from('reclamations')
        .select('id')
        .gte('created_at', `${previousYear}-01-01`)
        .lte('created_at', `${previousYear}-12-31`);

      // Compter les incidents par année
      const { data: currentYearIncidents } = await supabase
        .from('incidents')
        .select('id')
        .gte('created_at', `${currentYear}-01-01`)
        .lte('created_at', `${currentYear}-12-31`);

      // Compter les réclamations clôturées de l'année sélectionnée
      const { data: clotureesData } = await supabase
        .from('reclamations')
        .select('id')
        .eq('statut', 'cloture')
        .gte('created_at', `${currentYear}-01-01`)
        .lte('created_at', `${currentYear}-12-31`);

      // Calculer les montants pour l'année sélectionnée
      const { data: montantsData } = await supabase
        .from('reclamations')
        .select('montant_demande, montant_dedommage')
        .gte('created_at', `${currentYear}-01-01`)
        .lte('created_at', `${currentYear}-12-31`);

      const totalDemande = montantsData?.reduce((sum, r) => sum + (r.montant_demande || 0), 0) || 0;
      const totalDedommage = montantsData?.reduce((sum, r) => sum + (r.montant_dedommage || 0), 0) || 0;

      // Calculer le facteur de multiplication (Incidents → Réclamations)
      const totalIncidents = currentYearIncidents?.length || 0;
      const totalReclamations = currentYearReclamations?.length || 0;
      const facteurMultiplication = totalIncidents > 0 ? (totalReclamations / totalIncidents).toFixed(1) : '0.0';

      // Calculer le pourcentage d'évolution
      const evolutionPercentage = previousYearReclamations?.length > 0 ? 
        (((currentYearReclamations?.length || 0) - previousYearReclamations.length) / previousYearReclamations.length * 100).toFixed(1) : '0.0';

      setDashboardStats({
        totalIncidents: totalIncidents,
        totalReclamations: totalReclamations,
        facteurMultiplication: facteurMultiplication,
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
          .select('id')
          .gte('created_at', `${year}-01-01`)
          .lte('created_at', `${year}-12-31`);

        const { data: incidentsData } = await supabase
          .from('incidents')
          .select('id')
          .gte('created_at', `${year}-01-01`)
          .lte('created_at', `${year}-12-31`);

        return {
          year,
          reclamations: reclamationsData?.length || 0,
          incidents: incidentsData?.length || 0
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
        .select('qualite, created_at')
        .gte('created_at', `${selectedYear}-01-01`)
        .lte('created_at', `${selectedYear}-12-31`);

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
        .select('region, created_at')
        .gte('created_at', `${selectedYear}-01-01`)
        .lte('created_at', `${selectedYear}-12-31`);

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
        .select('type_incident, created_at')
        .gte('created_at', `${selectedYear}-01-01`)
        .lte('created_at', `${selectedYear}-12-31`);

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
        .select('client, created_at')
        .gte('created_at', `${selectedYear}-01-01`)
        .lte('created_at', `${selectedYear}-12-31`);

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

  // Fonction pour ajouter une nouvelle réclamation
  const addNewReclamation = async (formData) => {
    setLoading(true);
    
    try {
      const readableId = generateReadableId(
        'REC', 
        formData.date_reception || new Date(), 
        formData.qualite, 
        formData.client
      );

      const newReclamation = {
        client: formData.client,
        navire: formData.navire,
        site: formData.site,
        qualite: formData.qualite,
        sous_produit: formData.sous_produit || null,
        quantite: parseInt(formData.quantite) || 0,
        type_incident: formData.type_incident,
        probleme: formData.probleme,
        statut: 'nouveau',
        priorite: formData.priorite,
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

  // Fonction pour transformer un incident en réclamation
  const transformIncidentToReclamation = async (incident) => {
    setLoading(true);
    try {
      const readableId = generateReadableId(
        'REC', 
        new Date(), 
        incident.produit, 
        incident.client
      );

      const newReclamation = {
        // Reprendre tous les champs de l'incident
        region: incident.region,
        pays: incident.pays,
        client: incident.client,
        navire: incident.navire,
        site: incident.site,
        qualite: incident.produit,
        sous_produit: incident.sous_produit,
        quantite: incident.quantite || 0,
        type_incident: incident.type_incident,
        probleme: incident.probleme || `Incident transformé: ${incident.type_incident}`,
        statut: 'nouveau',
        priorite: incident.priorite || (incident.severite === 'critique' ? 'haute' : 'moyenne'),
        date_bl: incident.date_bl,
        date_reception: incident.date_reception || new Date().toISOString().split('T')[0],
        montant_demande: incident.montant_demande || 0,
        montant_dedommage: 0,
        nouveau_produit: incident.nouveau_produit || false,
        readable_id: readableId
      };

      const { data, error } = await supabase
        .from('reclamations')
        .insert([newReclamation])
        .select();

      if (error) {
        console.error('Error transforming incident to reclamation:', error);
        alert(`Erreur lors de la transformation: ${error.message}`);
        return false;
      } else {
        // Mettre à jour le statut de l'incident
        const { error: updateError } = await supabase
          .from('incidents')
          .update({ 
            statut: 'transforme_reclamation',
            date_cloture: new Date().toISOString().split('T')[0]
          })
          .eq('id', incident.id);

        if (updateError) {
          console.error('Error updating incident status:', updateError);
          alert(`Erreur lors de la mise à jour de l'incident: ${updateError.message}`);
          return false;
        } else {
          // Mettre à jour les états locaux
          setIncidents(incidents.map(inc => 
            inc.id === incident.id ? { 
              ...inc, 
              statut: 'transforme_reclamation',
              date_cloture: new Date().toISOString().split('T')[0]
            } : inc
          ));
          setReclamations([data[0], ...reclamations]);
          setEditingIncident(null);
          await loadDashboardStats();
          alert('Incident transformé en réclamation avec succès!');
          return true;
        }
      }
    } catch (error) {
      console.error('Error in transformIncidentToReclamation:', error);
      alert('Erreur lors de la transformation de l\'incident');
      return false;
    }
    setLoading(false);
  };

  // Fonction pour ajouter un nouvel incident - MIS À JOUR
  const addNewIncident = async (formData) => {
    setLoading(true);
    
    try {
      const readableId = generateReadableId(
        'INC', 
        formData.date_reception || new Date(), 
        formData.produit, 
        formData.client
      );

      const newIncident = {
        // Informations client (nouveaux champs)
        region: formData.region,
        pays: formData.pays,
        client: formData.client,
        
        // Informations logistiques (étendues)
        navire: formData.navire,
        site: formData.site,
        date_bl: formData.date_bl,
        date_reception: formData.date_reception || new Date().toISOString().split('T')[0],
        port_destination: formData.port_destination,
        port_dechargement: formData.port_dechargement,
        
        // Informations produit (étendues)
        produit: formData.produit,
        sous_produit: formData.sous_produit || null,
        quantite: parseInt(formData.quantite) || 0,
        nouveau_produit: formData.nouveau_produit === 'true',
        
        // Détails de l'incident
        type_incident: formData.type_incident,
        probleme: formData.probleme,
        severite: formData.severite,
        statut: formData.statut,
        
        // Informations financières (nouvelles)
        priorite: formData.priorite,
        montant_demande: parseFloat(formData.montant_demande) || 0,
        montant_dedommage: 0,
        
        // Métadonnées
        inspecteur: formData.inspecteur,
        date_chargement: formData.date_chargement,
        date_detection: new Date().toISOString().split('T')[0],
        readable_id: readableId
      };

      const { data, error } = await supabase
        .from('incidents')
        .insert([newIncident])
        .select();
      
      if (error) {
        console.error('Error adding incident:', error);
        alert(`Erreur lors de l'ajout de l'incident: ${error.message}`);
      } else {
        setIncidents([data[0], ...incidents]);
        setShowNewIncident(false);
        // Réinitialiser les états du formulaire
        setSelectedRegionIncident('');
        setSelectedProduitIncident('');
        setSearchPaysIncident('');
        alert('Incident créé avec succès!');
      }
    } catch (error) {
      console.error('Error in addNewIncident:', error);
      alert('Erreur lors de l\'ajout de l\'incident');
    }
    setLoading(false);
  };

  // Fonction pour mettre à jour le statut d'un incident
  const updateIncidentStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('incidents')
        .update({ statut: newStatus })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating incident:', error);
        alert(`Erreur lors de la mise à jour: ${error.message}`);
        return false;
      } else {
        // Mettre à jour l'état local
        setIncidents(incidents.map(inc => 
          inc.id === id ? { ...inc, statut: newStatus } : inc
        ));
        
        // Si le statut est "transforme_reclamation", créer une réclamation
        if (newStatus === 'transforme_reclamation') {
          const incident = incidents.find(inc => inc.id === id);
          if (incident) {
            await transformIncidentToReclamation(incident);
          }
        } else {
          alert('Statut de l\'incident mis à jour avec succès!');
        }
        setEditingIncident(null);
        return true;
      }
    } catch (error) {
      console.error('Error in updateIncidentStatus:', error);
      alert('Erreur lors de la mise à jour du statut de l\'incident');
      return false;
    }
    setLoading(false);
  };

  // Fonction pour supprimer un incident
  const deleteIncident = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('incidents')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting incident:', error);
        alert(`Erreur lors de la suppression: ${error.message}`);
      } else {
        setIncidents(incidents.filter(inc => inc.id !== id));
        setDeleteConfirm(null);
        alert('Incident supprimé avec succès!');
      }
    } catch (error) {
      console.error('Error in deleteIncident:', error);
      alert('Erreur lors de la suppression de l\'incident');
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

  const getSeveriteBadge = (severite) => {
    const styles = {
      faible: 'bg-green-100 text-green-800 border-green-200',
      moyenne: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      elevee: 'bg-orange-100 text-orange-800 border-orange-200',
      critique: 'bg-red-100 text-red-800 border-red-200'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold border ${styles[severite] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {severite?.charAt(0)?.toUpperCase() + severite?.slice(1) || 'Non définie'}
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
      transforme_reclamation: 'Devenu réclamation'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[statut] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {labels[statut] || statut}
      </span>
    );
  };

  // Filtrage des réclamations
  let filteredReclamations = reclamations;

  // Filtre par année
  if (filterYear !== 'all') {
    filteredReclamations = filteredReclamations.filter(rec => {
      const reclamationYear = new Date(rec.created_at).getFullYear();
      return reclamationYear === filterYear;
    });
  }

  if (filterStatus !== 'all') filteredReclamations = filteredReclamations.filter(r => r.statut === filterStatus);
  if (filterRegion !== 'all') filteredReclamations = filteredReclamations.filter(r => r.region === filterRegion);
  if (filterProduit !== 'all') filteredReclamations = filteredReclamations.filter(r => r.qualite && r.qualite.includes(filterProduit));
  if (filterNouveauProduit !== 'all') {
    filteredReclamations = filteredReclamations.filter(r => 
      filterNouveauProduit === 'oui' ? r.nouveau_produit === true : r.nouveau_produit === false
    );
  }
  if (searchTerm) {
    filteredReclamations = filteredReclamations.filter(r => 
      (r.client && r.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.navire && r.navire.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.readable_id && r.readable_id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  // Filtrage des incidents
  let filteredIncidents = incidents;

  // Filtre par année
  if (filterIncidentYear !== 'all') {
    filteredIncidents = filteredIncidents.filter(inc => {
      const incidentYear = new Date(inc.created_at).getFullYear();
      return incidentYear === filterIncidentYear;
    });
  }

  // Filtre par statut
  if (filterIncidentStatus !== 'all') {
    filteredIncidents = filteredIncidents.filter(inc => inc.statut === filterIncidentStatus);
  }

  // Filtre par sévérité
  if (filterIncidentSeverite !== 'all') {
    filteredIncidents = filteredIncidents.filter(inc => inc.severite === filterIncidentSeverite);
  }

  // Filtre par produit
  if (filterIncidentProduit !== 'all') {
    filteredIncidents = filteredIncidents.filter(inc => inc.produit && inc.produit.includes(filterIncidentProduit));
  }

  // Filtre par recherche
  if (searchIncidentTerm) {
    filteredIncidents = filteredIncidents.filter(inc => 
      (inc.client && inc.client.toLowerCase().includes(searchIncidentTerm.toLowerCase())) ||
      (inc.navire && inc.navire.toLowerCase().includes(searchIncidentTerm.toLowerCase())) ||
      (inc.readable_id && inc.readable_id.toLowerCase().includes(searchIncidentTerm.toLowerCase()))
    );
  }

  // Filtrer les pays basé sur la région sélectionnée et la recherche
  const filteredPays = selectedRegion && regionsData[selectedRegion] 
    ? regionsData[selectedRegion].filter(pays => 
        pays.toLowerCase().includes(searchPays.toLowerCase())
      )
    : [];

  // Filtrer les pays pour les incidents
  const filteredPaysIncident = selectedRegionIncident && regionsData[selectedRegionIncident] 
    ? regionsData[selectedRegionIncident].filter(pays => 
        pays.toLowerCase().includes(searchPaysIncident.toLowerCase())
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
              <button 
                onClick={() => setShowNewIncident(true)}
                className="bg-orange-500 text-white px-4 sm:px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl text-sm justify-center"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Nouvel Incident</span>
                <span className="sm:hidden">Incident</span>
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
            {/* Sélecteur d'année */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Quality Excellence</h2>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-semibold text-gray-700">Année:</label>
                  <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {[2021, 2022, 2023, 2024, 2025].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Vue Overview */}
            {dashboardView === 'overview' && (
              <div className="space-y-6">
                {/* KPIs Principaux */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Incidents de l'année sélectionnée */}
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-xs sm:text-sm font-medium">Incidents {selectedYear}</p>
                        <p className="text-3xl sm:text-4xl font-bold mt-2">{dashboardStats.totalIncidents}</p>
                        <p className="text-xs sm:text-sm text-blue-100 mt-1">Total incidents qualité</p>
                      </div>
                      <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-blue-200" />
                    </div>
                  </div>

                  {/* Réclamations de l'année sélectionnée */}
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-xs sm:text-sm font-medium">Réclamations {selectedYear}</p>
                        <p className="text-3xl sm:text-4xl font-bold mt-2">{dashboardStats.totalReclamations}</p>
                        <p className="text-xs sm:text-sm text-green-100 mt-1">
                          {dashboardStats.evolutionPercentage >= 0 ? '+' : ''}{dashboardStats.evolutionPercentage}% vs {selectedYear - 1}
                        </p>
                      </div>
                      <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-green-200" />
                    </div>
                  </div>

                  {/* Facteur de Multiplication */}
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-xs sm:text-sm font-medium">Facteur Multiplication</p>
                        <p className="text-3xl sm:text-4xl font-bold mt-2">X{dashboardStats.facteurMultiplication}</p>
                        <p className="text-xs sm:text-sm text-purple-100 mt-1">Incident → Réclamation</p>
                      </div>
                      <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 text-purple-200" />
                    </div>
                  </div>

                  {/* Réclamations Clôturées */}
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-xs sm:text-sm font-medium">Clôturées {selectedYear}</p>
                        <p className="text-3xl sm:text-4xl font-bold mt-2">{dashboardStats.cloturees}</p>
                        <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                          Taux: {dashboardStats.totalReclamations > 0 ? 
                            ((dashboardStats.cloturees / dashboardStats.totalReclamations) * 100).toFixed(0) 
                            : 0}%
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-200" />
                    </div>
                  </div>
                </div>

                {/* Montants Totaux - année sélectionnée */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100 text-sm font-medium">Montant Total Demandé {selectedYear}</p>
                        <p className="text-3xl font-bold mt-2">{formatCurrency(dashboardStats.montantTotalDemande)}</p>
                        <p className="text-red-100 text-sm mt-1">Réclamations {selectedYear}</p>
                      </div>
                      <TrendingUp className="w-12 h-12 text-red-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">Montant Total Dédommagé {selectedYear}</p>
                        <p className="text-3xl font-bold mt-2">{formatCurrency(dashboardStats.montantTotalDedommage)}</p>
                        <p className="text-green-100 text-sm mt-1">
                          Taux: {dashboardStats.montantTotalDemande > 0 ? 
                            ((dashboardStats.montantTotalDedommage / dashboardStats.montantTotalDemande) * 100).toFixed(1) 
                            : 0}%
                        </p>
                      </div>
                      <TrendingDown className="w-12 h-12 text-green-200" />
                    </div>
                  </div>
                </div>

                {/* Graphiques côte à côte */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Répartition par Famille Engrais */}
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <PieChart className="w-6 h-6 text-green-600" />
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
                        })
                      ) : (
                        <p className="text-gray-500 text-center py-4">Aucune donnée disponible pour {selectedYear}</p>
                      )}
                    </div>
                  </div>

                  {/* Répartition Géographique */}
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-blue-600" />
                      Répartition par Régions {selectedYear}
                    </h3>
                    <div className="space-y-3">
                      {regionStats.length > 0 ? (
                        regionStats.map(region => (
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
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">Aucune donnée disponible pour {selectedYear}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Répartition par Type */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Répartition par Type d'Incident {selectedYear}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {incidentTypes.length > 0 ? (
                      incidentTypes.map(incident => (
                        <div key={incident.type} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-700">{incident.type}</span>
                            <span className={`${incident.color} text-white px-3 py-1 rounded-full font-bold`}>
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
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg border-2 border-green-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Users className="w-8 h-8 text-green-600" />
                    TOP 5 Clients / Claims {selectedYear}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {topClients.length > 0 ? (
                      topClients.map((client, idx) => (
                        <div key={client.client} className="bg-white p-6 rounded-xl shadow-md text-center border-2 border-green-300">
                          <div className="text-4xl font-bold text-green-600 mb-2">#{idx + 1}</div>
                          <p className="font-bold text-gray-900 text-lg mb-2">{client.client}</p>
                          <p className="text-3xl font-bold text-green-700">{client.claims}</p>
                          <p className="text-sm text-gray-600 mt-1">réclamations</p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-5 text-center py-8 text-gray-500">
                        Aucun client avec réclamations pour {selectedYear}
                      </div>
                    )}
                  </div>
                </div>

                {/* Graphique d'évolution - CORRIGÉ */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Évolution du Nombre de Réclamations par Année</h3>
                  <div className="h-80">
                    {evolutionData.length > 0 ? (
                      <div className="flex items-end justify-between h-64 gap-2">
                        {evolutionData.map((item, index) => {
                          // Trouver le maximum pour l'échelle
                          const maxReclamations = Math.max(...evolutionData.map(d => d.reclamations));
                          // Calculer la hauteur proportionnelle (minimum 20px pour 0 réclamations)
                          const heightPercentage = maxReclamations > 0 
                            ? Math.max((item.reclamations / maxReclamations) * 100, 5) // Minimum 5% pour être visible
                            : 5;
                          
                          return (
                            <div key={item.year} className="flex-1 flex flex-col items-center">
                              <div className="text-center mb-2">
                                <p className="text-sm font-semibold text-gray-700">{item.year}</p>
                                <p className="text-xs text-gray-500">{item.reclamations} réclamations</p>
                              </div>
                              <div 
                                className="w-full bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg transition-all duration-500 hover:from-green-600 hover:to-green-700 relative group"
                                style={{ 
                                  height: `${heightPercentage}%`,
                                  minHeight: '20px'
                                }}
                              >
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  {item.reclamations} réclamations
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500">Chargement des données d'évolution...</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                    {evolutionData.map(item => (
                      <div key={item.year} className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-gray-900">{item.year}</p>
                        <p className="text-2xl font-bold text-green-600">{item.reclamations}</p>
                        <p className="text-sm text-gray-600">réclamations</p>
                        <p className="text-xs text-gray-500">{item.incidents} incidents</p>
                      </div>
                    ))}
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
                  
                  {/* Filtre Année */}
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold text-gray-700">Année:</span>
                    <select 
                      value={filterYear}
                      onChange={(e) => setFilterYear(parseInt(e.target.value))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {[2021, 2022, 2023, 2024, 2025].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold text-gray-700">Statut:</span>
                    {['all', 'nouveau', 'en_cours', 'cloture'].map(status => (
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
                        {status === 'nouveau' && 'Nouveau'}
                        {status === 'en_cours' && 'En cours'}
                        {status === 'cloture' && 'Clôturées'}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold text-gray-700">Produit:</span>
                    {['all', ...new Set(reclamations.map(r => r.qualite).filter(Boolean))].map(prod => (
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
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-xl font-bold text-gray-900">
                                {rec.readable_id || `REC-${rec.id.substring(0, 8)}`}
                              </h3>
                              {getStatutBadge(rec.statut)}
                              {getPrioriteBadge(rec.priorite)}
                              {rec.region && (
                                <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                                  {rec.region}
                                </span>
                              )}
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
                                <span className="text-gray-500">Date réception:</span>
                                <p className="font-semibold text-gray-900">{formatDate(rec.date_reception)}</p>
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
                          <div className="flex flex-col gap-2">
                            <button 
                              onClick={() => setSelectedReclamation(rec)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
                            >
                              Voir Détails
                            </button>
                            <button 
                              onClick={() => setDeleteReclamationConfirm(rec)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm flex items-center gap-2"
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
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune réclamation trouvée</h3>
                    <p className="text-gray-500">Aucune réclamation ne correspond aux critères de recherche.</p>
                  </div>
                )}
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
                        <h2 className="text-3xl font-bold text-gray-900">
                          {selectedReclamation.readable_id || `REC-${selectedReclamation.id.substring(0, 8)}`}
                        </h2>
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
                        {selectedReclamation.nouveau_produit && (
                          <div>
                            <span className="text-gray-600">Statut:</span>
                            <p className="font-semibold text-purple-600">⭐ NOUVEAU PRODUIT</p>
                          </div>
                        )}
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
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                        <span className="text-2xl">💰</span>
                        Informations Financières
                      </h3>
                      {!editingFinances && selectedReclamation.statut !== 'cloture' && (
                        <button 
                          onClick={() => startEditingFinances(selectedReclamation)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Modifier
                        </button>
                      )}
                    </div>
                    
                    {editingFinances && editingFinances.id === selectedReclamation.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={saveFinances}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            Sauvegarder
                          </button>
                          <button 
                            onClick={() => setEditingFinances(null)}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
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
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-6 border-t border-gray-200 flex-wrap">
                    {selectedReclamation.statut !== 'cloture' && (
                      <>
                        <button 
                          onClick={() => closeReclamation(selectedReclamation.id)}
                          className="flex-1 bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg min-w-[200px]"
                        >
                          Clôturer la Réclamation
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => setDeleteReclamationConfirm(selectedReclamation)}
                      className="flex-1 bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg min-w-[200px] flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Supprimer la Réclamation
                    </button>
                    <button className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-lg min-w-[200px] flex items-center justify-center gap-2">
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
              <div>
                <h2 className="text-3xl font-bold mb-2">Gestion des Incidents Qualité</h2>
                <p className="text-orange-100">Suivi et gestion des incidents de chargement et analyse qualité</p>
              </div>
            </div>

            {/* Filtres Incidents */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="space-y-4">
                <div className="flex gap-4 items-center flex-wrap">
                  <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Rechercher par client, navire ou ID..."
                        value={searchIncidentTerm}
                        onChange={(e) => setSearchIncidentTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 font-semibold">
                    <Download className="w-5 h-5" />
                    Exporter Excel
                  </button>
                </div>

                <div className="flex gap-4 items-center flex-wrap">
                  <Filter className="w-5 h-5 text-gray-600" />
                  
                  {/* Filtre Année */}
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold text-gray-700">Année:</span>
                    <select 
                      value={filterIncidentYear}
                      onChange={(e) => setFilterIncidentYear(parseInt(e.target.value))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {[2021, 2022, 2023, 2024, 2025].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filtre Statut */}
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold text-gray-700">Statut:</span>
                    {['all', 'detecte', 'en_analyse', 'resolu', 'transforme_reclamation'].map(status => (
                      <button
                        key={status}
                        onClick={() => setFilterIncidentStatus(status)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                          filterIncidentStatus === status
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status === 'all' && 'Tous'}
                        {status === 'detecte' && 'Détecté'}
                        {status === 'en_analyse' && 'En analyse'}
                        {status === 'resolu' && 'Résolu'}
                        {status === 'transforme_reclamation' && 'Devenu réclamation'}
                      </button>
                    ))}
                  </div>

                  {/* Filtre Sévérité */}
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold text-gray-700">Sévérité:</span>
                    {['all', 'faible', 'moyenne', 'elevee', 'critique'].map(severite => (
                      <button
                        key={severite}
                        onClick={() => setFilterIncidentSeverite(severite)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                          filterIncidentSeverite === severite
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {severite === 'all' ? 'Toutes' : severite.charAt(0).toUpperCase() + severite.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Filtre Produit */}
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold text-gray-700">Produit:</span>
                    {['all', ...new Set(incidents.map(i => i.produit).filter(Boolean))].map(prod => (
                      <button
                        key={prod}
                        onClick={() => setFilterIncidentProduit(prod)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                          filterIncidentProduit === prod
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
                  <span className="font-semibold">{filteredIncidents.length}</span> incident(s) trouvé(s) pour {filterIncidentYear}
                </div>
              </div>
            </div>

            {/* Liste des Incidents */}
            <div className="space-y-4">
              {filteredIncidents.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun incident trouvé</h3>
                  <p className="text-gray-500">Aucun incident ne correspond aux critères de recherche.</p>
                </div>
              ) : (
                filteredIncidents.map(incident => (
                  <div key={incident.id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-gray-900">
                              {incident.readable_id || `INC-${incident.id.substring(0, 8)}`}
                            </h3>
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
                                <option value="transforme_reclamation">Devenir réclamation</option>
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

                          {incident.nouveau_produit && (
                            <div className="mb-3">
                              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold border border-purple-300">
                                ⭐ NOUVEAU PRODUIT
                              </span>
                            </div>
                          )}

                          <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded mb-3">
                            <p className="text-sm font-medium text-gray-900">{incident.type_incident}</p>
                            {incident.inspecteur && (
                              <p className="text-xs text-gray-600 mt-1">Inspecteur: {incident.inspecteur}</p>
                            )}
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
                                onClick={() => updateIncidentStatus(incident.id, editingIncident.statut)}
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
                                Modifier Statut
                              </button>
                              <button 
                                onClick={() => setDeleteConfirm(incident.id)}
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
                <p className="text-5xl font-bold text-gray-900">{filteredIncidents.length}</p>
                <p className="text-sm text-gray-500 mt-1">Filtrés</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-center text-white">
                <p className="text-green-100 text-sm mb-2 font-medium">Résolus</p>
                <p className="text-5xl font-bold">
                  {filteredIncidents.filter(i => i.statut === 'resolu').length}
                </p>
                <p className="text-sm mt-1">
                  {filteredIncidents.length > 0 ? 
                    ((filteredIncidents.filter(i => i.statut === 'resolu').length / filteredIncidents.length) * 100).toFixed(0) 
                    : 0}%
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-center text-white">
                <p className="text-yellow-100 text-sm mb-2 font-medium">En analyse</p>
                <p className="text-5xl font-bold">
                  {filteredIncidents.filter(i => i.statut === 'en_analyse').length}
                </p>
                <p className="text-sm mt-1">
                  {filteredIncidents.length > 0 ? 
                    ((filteredIncidents.filter(i => i.statut === 'en_analyse').length / filteredIncidents.length) * 100).toFixed(0) 
                    : 0}%
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-center text-white">
                <p className="text-red-100 text-sm mb-2 font-medium">Devenus réclamations</p>
                <p className="text-5xl font-bold">
                  {filteredIncidents.filter(i => i.statut === 'transforme_reclamation').length}
                </p>
                <p className="text-sm mt-1">
                  {filteredIncidents.length > 0 ? 
                    ((filteredIncidents.filter(i => i.statut === 'transforme_reclamation').length / filteredIncidents.length) * 100).toFixed(0) 
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL NOUVELLE RÉCLAMATION - MIS À JOUR */}
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
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                addNewReclamation(data);
              }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Client *</label>
                    <input 
                      name="client"
                      type="text" 
                      placeholder="Ex: HELM AG" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                      required
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner...</option>
                      <option>Europe</option>
                      <option>Asie</option>
                      <option>Amérique</option>
                      <option>Afrique</option>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                      {showPaysSuggestions && filteredPays.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredPays.map((pays) => (
                            <div
                              key={pays}
                              className="px-4 py-2 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0"
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Navire *</label>
                    <input 
                      name="navire"
                      type="text" 
                      placeholder="Ex: MV ARKLOW MILL" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Site *</label>
                    <select 
                      name="site"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner...</option>
                      <option>OIJ - Jorf Lasfar</option>
                      <option>OIS - Safi</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Qualité Produit *</label>
                    <select 
                      name="qualite"
                      value={selectedProduit}
                      onChange={(e) => setSelectedProduit(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sous-Produit</label>
                    <select 
                      name="sous_produit"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner un sous-produit...</option>
                      {selectedProduit && produitsData[selectedProduit]?.map((sousProduit) => (
                        <option key={sousProduit} value={sousProduit}>{sousProduit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quantité (MT) *</label>
                    <input 
                      name="quantite"
                      type="number" 
                      placeholder="Ex: 5500" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date B/L *</label>
                    <input 
                      name="date_bl"
                      type="date" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    required
                  />
                </div>

                <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      name="nouveau_produit"
                      type="checkbox" 
                      value="true"
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <div>
                      <span className="text-sm font-bold text-purple-900">Il s'agit d'un nouveau produit</span>
                      <p className="text-xs text-purple-700 mt-1">Cocher cette case si c'est la première commercialisation de ce produit</p>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type d'Incident *</label>
                  <select 
                    name="type_incident"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner...</option>
                    <option>Prise en masse</option>
                    <option>Poussière</option>
                    <option>Contamination</option>
                    <option>Granulométrie</option>
                    <option>Corps étranger</option>
                    <option>Composition chimique</option>
                    <option>Odeur</option>
                    <option>Humidité</option>
                    <option>Particules noires</option>
                    <option>Couleur</option>
                    <option>Produit huileux</option>
                    <option>Sous enrobage</option>
                    <option>Température élevée</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Problème Signalé *</label>
                  <textarea 
                    name="probleme"
                    rows="4" 
                    placeholder="Décrire le problème en détail..." 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Montant Demandé (MAD)</label>
                    <input 
                      name="montant_demande"
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priorité *</label>
                    <select 
                      name="priorite"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="basse">Basse</option>
                      <option value="moyenne">Moyenne</option>
                      <option value="haute">Haute</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg"
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
                    }} 
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

      {/* MODAL NOUVEL INCIDENT - COMPLÈTEMENT MIS À JOUR */}
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
                <div className="grid grid-cols-2 gap-4">
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Région *</label>
                    <select 
                      name="region"
                      value={selectedRegionIncident}
                      onChange={(e) => {
                        setSelectedRegionIncident(e.target.value);
                        setSearchPaysIncident(''); // Réinitialiser la recherche pays
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner...</option>
                      <option>Europe</option>
                      <option>Asie</option>
                      <option>Amérique</option>
                      <option>Afrique</option>
                    </select>
                  </div>
                </div>

                {/* Pays avec autocomplete pour incident */}
                {selectedRegionIncident && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pays *</label>
                    <div className="relative">
                      <input 
                        name="pays"
                        type="text" 
                        placeholder={`Rechercher un pays en ${selectedRegionIncident}...`}
                        value={searchPaysIncident}
                        onChange={(e) => {
                          setSearchPaysIncident(e.target.value);
                          setShowPaysSuggestionsIncident(true);
                        }}
                        onFocus={() => setShowPaysSuggestionsIncident(true)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                      {showPaysSuggestionsIncident && filteredPaysIncident.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredPaysIncident.map((pays) => (
                            <div
                              key={pays}
                              className="px-4 py-2 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => {
                                setSearchPaysIncident(pays);
                                setShowPaysSuggestionsIncident(false);
                              }}
                            >
                              {pays}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {filteredPaysIncident.length} pays disponible(s) pour {selectedRegionIncident}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Site *</label>
                    <select 
                      name="site"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner...</option>
                      <option>OIJ - Jorf Lasfar</option>
                      <option>OIS - Safi</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Produit *</label>
                    <select 
                      name="produit"
                      value={selectedProduitIncident}
                      onChange={(e) => setSelectedProduitIncident(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sous-Produit</label>
                    <select 
                      name="sous_produit"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner un sous-produit...</option>
                      {selectedProduitIncident && produitsData[selectedProduitIncident]?.map((sousProduit) => (
                        <option key={sousProduit} value={sousProduit}>{sousProduit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date B/L</label>
                    <input 
                      name="date_bl"
                      type="date" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date de Réception</label>
                    <input 
                      name="date_reception"
                      type="date" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Port de Déchargement</label>
                    <input 
                      name="port_dechargement"
                      type="text" 
                      placeholder="Ex: ROTTERDAM" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  </div>
                </div>

                <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      name="nouveau_produit"
                      type="checkbox" 
                      value="true"
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <div>
                      <span className="text-sm font-bold text-purple-900">Il s'agit d'un nouveau produit</span>
                      <p className="text-xs text-purple-700 mt-1">Cocher cette case si c'est la première commercialisation de ce produit</p>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type d'Incident *</label>
                  <select 
                    name="type_incident"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner...</option>
                    <option>Contamination</option>
                    <option>Caked Product (Prise en masse)</option>
                    <option>Dusty Product (Poussière)</option>
                    <option>Foreign Body (Corps étranger)</option>
                    <option>Wet Product (Humidité)</option>
                    <option>Couleur</option>
                    <option>Granulométrie</option>
                    <option>Odeur</option>
                    <option>Particules noires</option>
                    <option>Produit huileux</option>
                    <option>Sous enrobage</option>
                    <option>Température élevée</option>
                    <option>Composition chimique</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description de l'Incident *</label>
                  <textarea 
                    name="probleme"
                    rows="4" 
                    placeholder="Décrire l'incident qualité observé en détail..." 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Montant Demandé (MAD)</label>
                    <input 
                      name="montant_demande"
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priorité *</label>
                    <select 
                      name="priorite"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="basse">Basse</option>
                      <option value="moyenne">Moyenne</option>
                      <option value="haute">Haute</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-blue-900">
                    <span className="font-bold">📋 Parcours de l'incident :</span> Un incident peut être <strong>résolu directement</strong> ou <strong>transformé en réclamation</strong> si le client fait une demande formelle de dédommagement.
                  </p>
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
                    onClick={() => {
                      setShowNewIncident(false);
                      setSelectedRegionIncident('');
                      setSelectedProduitIncident('');
                      setSearchPaysIncident('');
                    }} 
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

      {/* MODAL DE CONFIRMATION DE SUPPRESSION */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Confirmer la suppression</h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Êtes-vous sûr de vouloir supprimer cet incident ? Cette action est irréversible.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => deleteIncident(deleteConfirm)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  {loading ? 'Suppression...' : 'Supprimer'}
                </button>
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Confirmer la suppression</h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Êtes-vous sûr de vouloir supprimer la réclamation <strong>{deleteReclamationConfirm.readable_id}</strong> ?
              </p>
              <p className="text-sm text-red-600 mb-6">
                ⚠️ Cette action est irréversible et supprimera définitivement toutes les données de cette réclamation.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => deleteReclamation(deleteReclamationConfirm.id)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  {loading ? 'Suppression...' : 'Supprimer'}
                </button>
                <button 
                  onClick={() => setDeleteReclamationConfirm(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
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

// components/GeographicView.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, FileText, TrendingUp, AlertCircle } from 'lucide-react';

// Fix pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Coordonnées des pays
const countryCoordinates = {
  'France': [46.603354, 1.888334],
  'Allemagne': [51.165691, 10.451526],
  'Espagne': [40.463667, -3.74922],
  'Italie': [41.87194, 12.56738],
  'Royaume-Uni': [55.378051, -3.435973],
  'Pays-Bas': [52.132633, 5.291266],
  'Belgique': [50.503887, 4.469936],
  'Pologne': [51.919438, 19.145136],
  'Portugal': [39.399872, -8.224454],
  'Suède': [60.128161, 18.643501],
  'Danemark': [56.26392, 9.501785],
  'Finlande': [61.92411, 25.748151],
  'Norvège': [60.472024, 8.468946],
  'Suisse': [46.818188, 8.227512],
  'Autriche': [47.516231, 14.550072],
  'Ukraine': [48.379433, 31.16558],
  'Bulgarie': [42.733883, 25.48583],
  'Irlande': [53.41291, -8.24389],
  'Lettonie': [56.879635, 24.603189],
  'Lituanie': [55.169438, 23.881275],
  'Roumanie': [45.943161, 24.96676],
  'Grèce': [39.074208, 21.824312],
  'République Tchèque': [49.817492, 15.472962],
  'Hongrie': [47.162494, 19.503304],
  'Slovaquie': [48.669026, 19.699024],
  'Croatie': [45.1, 15.2],
  'Slovénie': [46.151241, 14.995463],
  'Estonie': [58.595272, 25.013607],
  'Latvia': [56.879635, 24.603189],
  'Chine': [35.86166, 104.195397],
  'Japon': [36.204824, 138.252924],
  'Corée du Sud': [35.907757, 127.766922],
  'Inde': [20.593684, 78.96288],
  'Vietnam': [14.058324, 108.277199],
  'Thaïlande': [15.870032, 100.992541],
  'Malaisie': [4.210484, 101.975766],
  'Indonésie': [-0.789275, 113.921327],
  'Philippines': [12.879721, 121.774017],
  'Bangladesh': [23.684994, 90.356331],
  'Pakistan': [30.375321, 69.345116],
  'Sri Lanka': [7.873054, 80.771797],
  'Taiwan': [23.69781, 120.960515],
  'Liban': [33.854721, 35.862285],
  'Arabie Saoudite': [23.885942, 45.079162],
  'Émirats Arabes Unis': [23.424076, 53.847818],
  'Qatar': [25.354826, 51.183884],
  'Koweït': [29.31166, 47.481766],
  'Oman': [21.512583, 55.923255],
  'Israël': [31.046051, 34.851612],
  'Turquie': [38.963745, 35.243322],
  'Singapour': [1.352083, 103.819836],
  'Corée du Nord': [40.339852, 127.510093],
  'Birmanie': [21.916221, 95.955974],
  'Cambodge': [12.565679, 104.990963],
  'Laos': [19.85627, 102.495496],
  'États-Unis': [37.09024, -95.712891],
  'Canada': [56.130366, -106.346771],
  'Brésil': [-14.235004, -51.92528],
  'Mexique': [23.634501, -102.552784],
  'Argentine': [-38.416097, -63.616672],
  'Chili': [-35.675147, -71.542969],
  'Colombie': [4.570868, -74.297333],
  'Pérou': [-9.189967, -75.015152],
  'Uruguay': [-32.522779, -55.765835],
  'Équateur': [-1.831239, -78.183406],
  'Venezuela': [6.42375, -66.58973],
  'El Salvador': [13.794185, -88.89653],
  'Guatemala': [15.783471, -90.230759],
  'Costa Rica': [9.748917, -83.753428],
  'Panama': [8.537981, -80.782127],
  'République Dominicaine': [18.735693, -70.162651],
  'Cuba': [21.521757, -77.781167],
  'Honduras': [15.199999, -86.241905],
  'Nicaragua': [12.865416, -85.207229],
  'Paraguay': [-23.442503, -58.443832],
  'Bolivie': [-16.290154, -63.588653],
  'Maroc': [31.791702, -7.09262],
  'Algérie': [28.033886, 1.659626],
  'Tunisie': [33.886917, 9.537499],
  'Égypte': [26.820553, 30.802498],
  'Sénégal': [14.497401, -14.452362],
  'Côte d\'Ivoire': [7.539989, -5.54708],
  'Nigeria': [9.081999, 8.675277],
  'Ghana': [7.946527, -1.023194],
  'Kenya': [-0.023559, 37.906193],
  'Afrique du Sud': [-30.559482, 22.937506],
  'Éthiopie': [9.145, 40.489673],
  'Tanzanie': [-6.369028, 34.888822],
  'Bénin': [9.30769, 2.315834],
  'Rwanda': [-1.940278, 29.873888],
  'Cameroun': [7.369722, 12.354722],
  'Mali': [17.570692, -3.996166],
  'Burkina Faso': [12.238333, -1.561593],
  'République Démocratique du Congo': [-4.038333, 21.758664],
  'Congo': [-0.228021, 15.827659],
  'Gabon': [-0.803689, 11.609444],
  'Madagascar': [-18.766947, 46.869107],
  'Ouganda': [1.373333, 32.290275],
  'Zambie': [-13.133897, 27.849332],
  'Zimbabwe': [-19.015438, 29.154857],
  'Soudan': [12.862807, 30.217636],
  'Angola': [-11.202692, 17.873887],
  'Australie': [-25.274398, 133.775136],
  'Nouvelle-Zélande': [-40.900557, 174.885971]
};

// Composant pour créer des marqueurs personnalisés
const createCustomIcon = (count, maxCount) => {
  const size = Math.max(20, Math.min(50, (count / maxCount) * 50 + 20));
  const intensity = Math.min(1, count / maxCount);
  
  const red = Math.floor(200 + intensity * 55);
  const green = Math.floor(200 - intensity * 200);
  const blue = Math.floor(200 - intensity * 200);
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: rgba(${red}, ${green}, ${blue}, 0.8);
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: ${Math.max(10, size / 3)}px;
      ">${count}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const GeographicView = ({ reclamations, selectedYear }) => {
  const [viewMode, setViewMode] = useState('markers');
  
  // Agrégation des données par pays
  const countryData = useMemo(() => {
    const data = {};
    
    reclamations.forEach(rec => {
      if (rec.pays && rec.date_reception) {
        const reclamationYear = new Date(rec.date_reception).getFullYear();
        if (reclamationYear === selectedYear) {
          const country = rec.pays;
          if (!data[country]) {
            data[country] = {
              count: 0,
              totalDemande: 0,
              totalDedommage: 0,
              produits: new Set()
            };
          }
          
          data[country].count += 1;
          data[country].totalDemande += rec.montant_demande || 0;
          data[country].totalDedommage += rec.montant_dedommage || 0;
          if (rec.qualite) {
            data[country].produits.add(rec.qualite);
          }
        }
      }
    });
    
    Object.keys(data).forEach(country => {
      data[country].topProduits = Array.from(data[country].produits).slice(0, 5);
      delete data[country].produits;
    });
    
    console.log('🗺️ Pays avec données:', Object.keys(data));
    
    return data;
  }, [reclamations, selectedYear]);
  
  // Calcul des KPIs
  const kpis = useMemo(() => {
    const countriesWithClaims = Object.values(countryData).filter(data => data.count > 0);
    const totalReclamations = countriesWithClaims.reduce((sum, data) => sum + data.count, 0);
    const totalDemande = countriesWithClaims.reduce((sum, data) => sum + data.totalDemande, 0);
    const totalDedommage = countriesWithClaims.reduce((sum, data) => sum + data.totalDedommage, 0);
    
    let mostAffectedCountry = null;
    let maxClaims = 0;
    
    Object.entries(countryData).forEach(([country, data]) => {
      if (data.count > maxClaims) {
        maxClaims = data.count;
        mostAffectedCountry = country;
      }
    });
    
    return {
      totalCountries: countriesWithClaims.length,
      totalReclamations,
      totalDemande,
      totalDedommage,
      mostAffectedCountry,
      maxClaims
    };
  }, [countryData]);
  
  const maxCount = Math.max(...Object.values(countryData).map(data => data.count), 1);
  
  return (
    <div className="space-y-6">
      {/* KPIs Géographiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Pays Concernés</p>
              <p className="text-2xl sm:text-3xl font-bold mt-2">{kpis.totalCountries}</p>
              <p className="text-sm text-blue-100 mt-1">Avec réclamations</p>
            </div>
            <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Réclamations</p>
              <p className="text-2xl sm:text-3xl font-bold mt-2">{kpis.totalReclamations}</p>
              <p className="text-sm text-green-100 mt-1">Sur la carte</p>
            </div>
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Montant Demandé</p>
              <p className="text-xl sm:text-2xl font-bold mt-2">
                {kpis.totalDemande.toLocaleString()} MAD
              </p>
              <p className="text-sm text-red-100 mt-1">Total carte</p>
            </div>
            <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-red-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 sm:p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Pays Plus Touché</p>
              <p className="text-lg sm:text-xl font-bold mt-2 truncate">
                {kpis.mostAffectedCountry || 'Aucun'}
              </p>
              <p className="text-sm text-purple-100 mt-1">
                {kpis.maxClaims} réclamation{kpis.maxClaims > 1 ? 's' : ''}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-purple-200" />
          </div>
        </div>
      </div>
      
      {/* Carte */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-green-600" />
            Vue Géographique des Réclamations {selectedYear}
          </h2>
        </div>
        
        <div style={{ height: '500px', width: '100%' }}>
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            
            {Object.entries(countryData).map(([country, data]) => {
              const coordinates = countryCoordinates[country];
              if (!coordinates || data.count === 0) return null;
              
              return (
                <Marker
                  key={country}
                  position={coordinates}
                  icon={createCustomIcon(data.count, maxCount)}
                >
                  <Popup>
                    <div className="min-w-[250px] p-3">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{country}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Réclamations:</span>
                          <span className="font-bold text-blue-600">{data.count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Montant demandé:</span>
                          <span className="font-bold text-red-600">{data.totalDemande.toLocaleString()} MAD</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Montant dédommagé:</span>
                          <span className="font-bold text-green-600">{data.totalDedommage.toLocaleString()} MAD</span>
                        </div>
                        {data.topProduits.length > 0 && (
                          <div>
                            <span className="text-gray-600">Produits principaux:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {data.topProduits.slice(0, 3).map(prod => (
                                <span key={prod} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                  {prod}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="pt-2 border-t">
                          <span className="text-gray-600">Taux dédommagement:</span>
                          <span className="font-bold text-purple-600 ml-2">
                            {data.totalDemande > 0 ? 
                              ((data.totalDedommage / data.totalDemande) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                  <Tooltip direction="top" offset={[0, -10]} opacity={0.9} permanent={false}>
                    <div className="font-semibold">
                      {country}: {data.count} réclamation{data.count > 1 ? 's' : ''}
                    </div>
                  </Tooltip>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
        
        {/* Résumé */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{kpis.totalCountries}</p>
              <p className="text-sm text-gray-600">Pays concernés</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{kpis.totalReclamations}</p>
              <p className="text-sm text-gray-600">Réclamations totales</p>
            </div>
            <div>
              <p className="text-xl font-bold text-red-600">
                {(kpis.totalDemande / 1000000).toFixed(1)}M MAD
              </p>
              <p className="text-sm text-gray-600">Montant demandé</p>
            </div>
            <div>
              <p className="text-xl font-bold text-purple-600">
                {kpis.totalDemande > 0 ? 
                  ((kpis.totalDedommage / kpis.totalDemande) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-sm text-gray-600">Taux dédommagement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographicView;

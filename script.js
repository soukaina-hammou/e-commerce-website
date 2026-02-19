    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary:    '#0E7C7B',
            primaryDk:  '#065656',
            accent:     '#F4A261',
            accentDk:   '#E76F51',
            sand:       '#FEFAE0',
            sandDk:     '#DDA15E',
            ocean:      '#264653',
            oceanLight: '#2A9D8F',
            sky:        '#E9F5F5',
            darkBg:     '#0F172A',
            darkCard:   '#1E293B',
            darkBorder: '#334155',
          },
          fontFamily: {
            sans:    ['Inter', 'system-ui', 'sans-serif'],
            display: ['"Playfair Display"', 'Georgia', 'serif'],
          },
          animation: {
            'fade-up':      'fadeUp 0.6s ease both',
            'fade-in':      'fadeIn 0.5s ease both',
            'slide-right':  'slideRight 0.5s ease both',
            'bounce-slow':  'bounce 2s infinite',
            'spin-slow':    'spin 2s linear infinite',
            'pulse-dot':    'pulseDot 1.4s ease-in-out infinite',
          },
          keyframes: {
            fadeUp:     { '0%': { opacity: 0, transform: 'translateY(24px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
            fadeIn:     { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
            slideRight: { '0%': { opacity: 0, transform: 'translateX(-30px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
            pulseDot:   { '0%,80%,100%': { transform: 'scale(0)' }, '40%': { transform: 'scale(1)' } },
          },
        },
      },
    };

/**
 * Wanderlust — Smart Travel Planner
 * ──────────────────────────────────
 * script.js
 *
 * Responsibilities:
 *  - City/attraction/restaurant mock database
 *  - Interest & budget filtering
 *  - Daily itinerary generation
 *  - Dynamic results rendering
 *  - Destination showcase cards
 *  - Dark mode toggle
 *  - Mobile nav
 *  - Toast notifications
 *  - Back-to-top button
 */

'use strict';

/* ============================================================
   INTEREST CATEGORIES
============================================================ */
const INTERESTS = [
  { id: 'nature',    label: '🌿 Nature',    icon: '🌿' },
  { id: 'history',   label: '🏛️ History',   icon: '🏛️' },
  { id: 'food',      label: '🍜 Food',      icon: '🍜' },
  { id: 'adventure', label: '🧗 Adventure', icon: '🧗' },
  { id: 'culture',   label: '🎭 Culture',   icon: '🎭' },
  { id: 'nightlife', label: '🌙 Nightlife', icon: '🌙' },
  { id: 'shopping',  label: '🛍️ Shopping',  icon: '🛍️' },
  { id: 'art',       label: '🎨 Art',       icon: '🎨' },
  { id: 'beach',     label: '🏖️ Beach',     icon: '🏖️' },
  { id: 'wellness',  label: '🧘 Wellness',  icon: '🧘' },
];


/* ============================================================
   CITY DATABASE
   Each city has:
   - name, country, emoji, image (Unsplash), description
   - attractions[] with categories and time slots
   - restaurants[] with name, type, price level, rating
============================================================ */
const cities = [
  // ─── 1. PARIS ───
  {
    name: 'Paris',
    country: 'France',
    emoji: '🗼',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&fit=crop',
    description: 'The City of Light — art, romance, and world-class cuisine.',
    attractions: [
      { name: 'Eiffel Tower',            categories: ['culture', 'history'],           time: 'morning',   duration: 2, description: 'Iconic iron lattice tower with panoramic city views.' },
      { name: 'Louvre Museum',            categories: ['art', 'history', 'culture'],    time: 'morning',   duration: 3, description: 'World\'s largest art museum — home to the Mona Lisa.' },
      { name: 'Musée d\'Orsay',           categories: ['art', 'culture'],               time: 'afternoon', duration: 2, description: 'Impressionist masterpieces in a stunning former railway station.' },
      { name: 'Montmartre & Sacré-Cœur',  categories: ['culture', 'art', 'history'],    time: 'morning',   duration: 2, description: 'Bohemian hilltop neighborhood with stunning basilica views.' },
      { name: 'Seine River Cruise',       categories: ['nature', 'culture'],            time: 'evening',   duration: 1, description: 'Glide past illuminated landmarks on the Seine.' },
      { name: 'Le Marais Walk',           categories: ['shopping', 'culture', 'food'],  time: 'afternoon', duration: 2, description: 'Trendy district with boutiques, galleries, and falafel shops.' },
      { name: 'Luxembourg Gardens',       categories: ['nature', 'wellness'],           time: 'morning',   duration: 1, description: 'Serene French formal garden perfect for a morning stroll.' },
      { name: 'Champs-Élysées',           categories: ['shopping', 'culture'],          time: 'afternoon', duration: 2, description: 'Iconic boulevard lined with luxury shops and cafés.' },
      { name: 'Moulin Rouge Show',        categories: ['nightlife', 'culture'],         time: 'evening',   duration: 2, description: 'Legendary cabaret with dazzling performances.' },
      { name: 'Catacombs of Paris',       categories: ['history', 'adventure'],         time: 'afternoon', duration: 1, description: 'Underground ossuaries holding remains of over 6 million people.' },
      { name: 'Palace of Versailles',     categories: ['history', 'culture', 'nature'], time: 'morning',   duration: 4, description: 'Opulent royal château with magnificent gardens.' },
      { name: 'Tuileries Garden',         categories: ['nature', 'wellness'],           time: 'afternoon', duration: 1, description: 'Historic garden between the Louvre and Place de la Concorde.' },
      { name: 'Latin Quarter Stroll',     categories: ['culture', 'food', 'history'],   time: 'evening',   duration: 1, description: 'Vibrant student quarter with charming streets and bistros.' },
      { name: 'Centre Pompidou',          categories: ['art', 'culture'],               time: 'afternoon', duration: 2, description: 'Modern art museum in a radical high-tech architecture.' },
      { name: 'Bois de Boulogne Cycling', categories: ['nature', 'adventure', 'wellness'], time: 'morning', duration: 2, description: 'Vast park with lakes, gardens, and cycling paths.' },
    ],
    restaurants: [
      { name: 'Le Petit Cler',          type: 'French Bistro',      price: 'low',    rating: 4.5 },
      { name: 'Breizh Café',            type: 'Crêperie',          price: 'low',    rating: 4.6 },
      { name: 'Chez Janou',             type: 'Traditional French', price: 'medium', rating: 4.7 },
      { name: 'Le Bouillon Chartier',   type: 'Classic Parisian',   price: 'low',    rating: 4.4 },
      { name: 'Pink Mamma',             type: 'Italian',            price: 'medium', rating: 4.5 },
      { name: 'Le Cinq',                type: 'Fine Dining',        price: 'high',   rating: 4.9 },
      { name: 'L\'Ambroisie',           type: 'Haute Cuisine',      price: 'high',   rating: 4.9 },
      { name: 'Café de Flore',          type: 'Café / Brasserie',   price: 'medium', rating: 4.3 },
    ],
  },

  // ─── 2. TOKYO ───
  {
    name: 'Tokyo',
    country: 'Japan',
    emoji: '🏯',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&fit=crop',
    description: 'A neon-lit metropolis where ancient tradition meets futuristic innovation.',
    attractions: [
      { name: 'Senso-ji Temple',         categories: ['history', 'culture'],             time: 'morning',   duration: 1, description: 'Tokyo\'s oldest Buddhist temple in Asakusa.' },
      { name: 'Meiji Shrine',            categories: ['history', 'nature', 'culture'],   time: 'morning',   duration: 1, description: 'Serene Shinto shrine surrounded by a forested park.' },
      { name: 'Shibuya Crossing',        categories: ['culture'],                        time: 'afternoon', duration: 1, description: 'The world\'s busiest pedestrian crossing.' },
      { name: 'Tsukiji Outer Market',    categories: ['food', 'culture'],                time: 'morning',   duration: 2, description: 'Street food paradise with the freshest sushi.' },
      { name: 'Akihabara Electric Town', categories: ['shopping', 'culture'],            time: 'afternoon', duration: 2, description: 'Otaku mecca — anime, manga, and electronics.' },
      { name: 'Shinjuku Gyoen',          categories: ['nature', 'wellness'],             time: 'morning',   duration: 2, description: 'Peaceful national garden with Japanese, French, and English sections.' },
      { name: 'TeamLab Borderless',      categories: ['art', 'culture'],                 time: 'afternoon', duration: 2, description: 'Immersive digital art museum with no boundaries.' },
      { name: 'Harajuku & Takeshita St', categories: ['shopping', 'culture'],            time: 'afternoon', duration: 2, description: 'Youth fashion capital with quirky shops and crêpes.' },
      { name: 'Golden Gai',              categories: ['nightlife', 'culture', 'food'],   time: 'evening',   duration: 2, description: 'Tiny alley of 200+ themed micro-bars in Shinjuku.' },
      { name: 'Tokyo Skytree',           categories: ['culture', 'adventure'],           time: 'evening',   duration: 1, description: 'Tallest tower in Japan with stunning night views.' },
      { name: 'Imperial Palace Gardens', categories: ['history', 'nature'],              time: 'morning',   duration: 1, description: 'Beautiful gardens around the Emperor\'s residence.' },
      { name: 'Odaiba Island',           categories: ['shopping', 'beach', 'adventure'], time: 'afternoon', duration: 3, description: 'Futuristic entertainment island on Tokyo Bay.' },
      { name: 'Robot Restaurant Show',   categories: ['nightlife', 'culture'],           time: 'evening',   duration: 2, description: 'Wild neon robot cabaret experience in Shinjuku.' },
      { name: 'Mount Takao Hike',        categories: ['nature', 'adventure', 'wellness'], time: 'morning',  duration: 4, description: 'Sacred mountain with hiking trails and panoramic views.' },
      { name: 'Roppongi Art Triangle',   categories: ['art', 'culture'],                 time: 'afternoon', duration: 2, description: 'Three world-class art museums in one neighborhood.' },
    ],
    restaurants: [
      { name: 'Ichiran Ramen',          type: 'Ramen',            price: 'low',    rating: 4.6 },
      { name: 'Genki Sushi',            type: 'Conveyor Sushi',   price: 'low',    rating: 4.3 },
      { name: 'Tonkatsu Maisen',        type: 'Tonkatsu',         price: 'medium', rating: 4.7 },
      { name: 'Afuri Ramen',            type: 'Yuzu Ramen',       price: 'low',    rating: 4.5 },
      { name: 'Gonpachi Nishi-Azabu',   type: 'Izakaya',          price: 'medium', rating: 4.4 },
      { name: 'Sushi Saito',            type: 'Omakase Sushi',    price: 'high',   rating: 4.9 },
      { name: 'Den',                    type: 'Creative Japanese', price: 'high',   rating: 4.8 },
      { name: 'Tsuta Ramen',            type: 'Michelin Ramen',   price: 'medium', rating: 4.6 },
    ],
  },

  // ─── 3. NEW YORK ───
  {
    name: 'New York',
    country: 'USA',
    emoji: '🗽',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&fit=crop',
    description: 'The city that never sleeps — culture, food, and endless energy.',
    attractions: [
      { name: 'Central Park',              categories: ['nature', 'wellness'],             time: 'morning',   duration: 2, description: 'Sprawling urban oasis in the heart of Manhattan.' },
      { name: 'Statue of Liberty',          categories: ['history', 'culture'],             time: 'morning',   duration: 3, description: 'Iconic symbol of freedom on Liberty Island.' },
      { name: 'Metropolitan Museum of Art', categories: ['art', 'history', 'culture'],      time: 'morning',   duration: 3, description: 'One of the world\'s largest and finest art collections.' },
      { name: 'Times Square',               categories: ['culture', 'nightlife', 'shopping'], time: 'evening', duration: 1, description: 'Neon-lit crossroads of the world.' },
      { name: 'Brooklyn Bridge Walk',       categories: ['nature', 'history', 'adventure'], time: 'afternoon', duration: 1, description: 'Historic bridge with stunning skyline views.' },
      { name: 'Broadway Show',              categories: ['culture', 'nightlife'],           time: 'evening',   duration: 3, description: 'World-famous theater district performances.' },
      { name: 'High Line',                  categories: ['nature', 'art', 'wellness'],      time: 'afternoon', duration: 1, description: 'Elevated park built on a former rail line.' },
      { name: 'MoMA',                       categories: ['art', 'culture'],                 time: 'afternoon', duration: 2, description: 'Modern art powerhouse — Warhol, Picasso, Van Gogh.' },
      { name: 'Chinatown & Little Italy',   categories: ['food', 'culture'],                time: 'afternoon', duration: 2, description: 'Vibrant neighborhoods with incredible street food.' },
      { name: 'Greenwich Village',          categories: ['culture', 'food', 'nightlife'],   time: 'evening',   duration: 2, description: 'Jazz clubs, comedy cellars, and cozy cafés.' },
      { name: 'Top of the Rock',            categories: ['culture', 'adventure'],           time: 'evening',   duration: 1, description: 'Breathtaking views from Rockefeller Center.' },
      { name: 'SoHo Shopping',              categories: ['shopping', 'culture'],            time: 'afternoon', duration: 2, description: 'Cast-iron architecture meets designer boutiques.' },
      { name: '9/11 Memorial',              categories: ['history', 'culture'],             time: 'morning',   duration: 2, description: 'Powerful tribute to the lives lost on September 11.' },
      { name: 'Chelsea Market',             categories: ['food', 'shopping'],               time: 'afternoon', duration: 1, description: 'Gourmet food hall in a former factory.' },
      { name: 'Hudson Yards',               categories: ['shopping', 'culture', 'art'],     time: 'afternoon', duration: 2, description: 'Modern complex with The Vessel and luxury shops.' },
    ],
    restaurants: [
      { name: 'Joe\'s Pizza',           type: 'New York Pizza',     price: 'low',    rating: 4.5 },
      { name: 'Xi\'an Famous Foods',    type: 'Chinese Noodles',    price: 'low',    rating: 4.6 },
      { name: 'The Spotted Pig',        type: 'Gastropub',          price: 'medium', rating: 4.4 },
      { name: 'Shake Shack',            type: 'Burgers',            price: 'low',    rating: 4.3 },
      { name: 'Peter Luger Steak',      type: 'Steakhouse',         price: 'high',   rating: 4.7 },
      { name: 'Le Bernardin',           type: 'French Seafood',     price: 'high',   rating: 4.9 },
      { name: 'Balthazar',              type: 'French Brasserie',   price: 'medium', rating: 4.5 },
      { name: 'Los Tacos No.1',         type: 'Mexican Tacos',      price: 'low',    rating: 4.7 },
    ],
  },

  // ─── 4. ROME ───
  {
    name: 'Rome',
    country: 'Italy',
    emoji: '🏛️',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&fit=crop',
    description: 'The Eternal City — ancient ruins, Renaissance art, and la dolce vita.',
    attractions: [
      { name: 'Colosseum',                categories: ['history', 'culture'],             time: 'morning',   duration: 2, description: 'Iconic ancient amphitheater from gladiatorial days.' },
      { name: 'Vatican Museums & Sistine', categories: ['art', 'history', 'culture'],     time: 'morning',   duration: 3, description: 'Michelangelo\'s Sistine Chapel ceiling and vast papal collections.' },
      { name: 'Pantheon',                 categories: ['history', 'culture'],              time: 'afternoon', duration: 1, description: 'Perfectly preserved 2,000-year-old temple.' },
      { name: 'Trevi Fountain',           categories: ['culture', 'history'],              time: 'evening',   duration: 1, description: 'Baroque masterpiece — toss a coin and make a wish.' },
      { name: 'Roman Forum',              categories: ['history'],                         time: 'morning',   duration: 2, description: 'Ruins of the center of Roman public life.' },
      { name: 'Trastevere Walk',          categories: ['food', 'culture', 'nightlife'],    time: 'evening',   duration: 2, description: 'Charming medieval neighborhood with amazing trattorias.' },
      { name: 'Borghese Gallery',         categories: ['art', 'culture'],                  time: 'afternoon', duration: 2, description: 'Bernini and Caravaggio in a beautiful villa setting.' },
      { name: 'Spanish Steps',            categories: ['culture', 'shopping'],             time: 'afternoon', duration: 1, description: 'Monumental stairway surrounded by luxury brands.' },
      { name: 'Villa Borghese Gardens',   categories: ['nature', 'wellness'],              time: 'morning',   duration: 2, description: 'Rome\'s Central Park with lake, zoo, and galleries.' },
      { name: 'Appian Way Cycling',       categories: ['nature', 'history', 'adventure'],  time: 'morning',   duration: 3, description: 'Ancient road with catacombs and countryside views.' },
      { name: 'Campo de\' Fiori Market',  categories: ['food', 'culture', 'shopping'],     time: 'morning',   duration: 1, description: 'Lively open-air market with fresh produce and flowers.' },
      { name: 'Piazza Navona',            categories: ['culture', 'art'],                  time: 'evening',   duration: 1, description: 'Baroque square with Bernini\'s Fountain of the Four Rivers.' },
      { name: 'Testaccio Food Tour',      categories: ['food', 'culture'],                 time: 'afternoon', duration: 2, description: 'Rome\'s original food neighborhood — carbonara, supplì, gelato.' },
      { name: 'Aventine Keyhole',         categories: ['culture', 'history'],              time: 'afternoon', duration: 1, description: 'Peek through a keyhole for a perfectly framed St. Peter\'s view.' },
    ],
    restaurants: [
      { name: 'Pizzeria da Baffetto',   type: 'Roman Pizza',        price: 'low',    rating: 4.4 },
      { name: 'Trapizzino',             type: 'Street Food',        price: 'low',    rating: 4.5 },
      { name: 'Roscioli',               type: 'Italian Deli',       price: 'medium', rating: 4.7 },
      { name: 'Felice a Testaccio',     type: 'Roman Trattoria',    price: 'medium', rating: 4.6 },
      { name: 'La Pergola',             type: 'Fine Dining',        price: 'high',   rating: 4.9 },
      { name: 'Il Pagliaccio',          type: 'Creative Italian',   price: 'high',   rating: 4.8 },
      { name: 'Suppli Roma',            type: 'Roman Street Food',  price: 'low',    rating: 4.3 },
    ],
  },

  // ─── 5. BARCELONA ───
  {
    name: 'Barcelona',
    country: 'Spain',
    emoji: '🏖️',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&fit=crop',
    description: 'Mediterranean gem — Gaudí architecture, tapas, and stunning beaches.',
    attractions: [
      { name: 'La Sagrada Família',       categories: ['culture', 'art', 'history'],      time: 'morning',   duration: 2, description: 'Gaudí\'s unfinished masterpiece basilica.' },
      { name: 'Park Güell',               categories: ['art', 'nature', 'culture'],       time: 'morning',   duration: 2, description: 'Mosaic-tiled park with city panoramas.' },
      { name: 'La Rambla',                categories: ['culture', 'food', 'shopping'],    time: 'afternoon', duration: 2, description: 'Iconic tree-lined pedestrian boulevard.' },
      { name: 'Gothic Quarter',           categories: ['history', 'culture', 'shopping'], time: 'afternoon', duration: 2, description: 'Medieval labyrinth of narrow streets and plazas.' },
      { name: 'Barceloneta Beach',        categories: ['beach', 'wellness', 'nature'],    time: 'morning',   duration: 2, description: 'Sandy city beach with seafood chiringuitos.' },
      { name: 'La Boqueria Market',       categories: ['food', 'culture'],                time: 'morning',   duration: 1, description: 'Vibrant food market with fresh juices and jamón.' },
      { name: 'Casa Batlló',              categories: ['art', 'culture', 'history'],      time: 'afternoon', duration: 1, description: 'Gaudí\'s dragon-inspired modernisme masterpiece.' },
      { name: 'Montjuïc Castle & Park',   categories: ['nature', 'history', 'adventure'], time: 'morning',   duration: 3, description: 'Hilltop fortress with gardens and city views.' },
      { name: 'Camp Nou Tour',            categories: ['culture', 'adventure'],           time: 'afternoon', duration: 2, description: 'FC Barcelona\'s legendary stadium.' },
      { name: 'El Born & Picasso Museum', categories: ['art', 'culture', 'history'],      time: 'afternoon', duration: 2, description: 'Trendy neighborhood housing Picasso\'s early works.' },
      { name: 'Magic Fountain Show',      categories: ['nightlife', 'culture'],           time: 'evening',   duration: 1, description: 'Spectacular light and water show at Montjuïc.' },
      { name: 'Bunkers del Carmel',       categories: ['nature', 'adventure', 'culture'], time: 'evening',   duration: 1, description: 'Secret hilltop viewpoint — best sunset in Barcelona.' },
      { name: 'Flamenco Show',            categories: ['culture', 'nightlife'],           time: 'evening',   duration: 2, description: 'Passionate traditional dance performance.' },
    ],
    restaurants: [
      { name: 'Bar Cañete',             type: 'Tapas Bar',          price: 'medium', rating: 4.6 },
      { name: 'La Pepita',              type: 'Gourmet Sandwiches', price: 'low',    rating: 4.5 },
      { name: 'Cal Pep',                type: 'Seafood Tapas',      price: 'medium', rating: 4.7 },
      { name: 'Cervecería Catalana',    type: 'Spanish Tapas',      price: 'medium', rating: 4.5 },
      { name: 'Tickets',                type: 'Creative Tapas',     price: 'high',   rating: 4.8 },
      { name: 'Disfrutar',              type: 'Avant-garde',        price: 'high',   rating: 4.9 },
      { name: 'La Boqueria Stalls',     type: 'Market Food',        price: 'low',    rating: 4.4 },
    ],
  },

  // ─── 6. MARRAKECH ───
  {
    name: 'Marrakech',
    country: 'Morocco',
    emoji: '🕌',
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&fit=crop',
    description: 'Vibrant souks, exotic gardens, and rich Berber culture.',
    attractions: [
      { name: 'Jemaa el-Fnaa',            categories: ['culture', 'food', 'nightlife'],    time: 'evening',   duration: 2, description: 'Iconic main square with storytellers, food stalls, and snake charmers.' },
      { name: 'Bahia Palace',             categories: ['history', 'culture', 'art'],       time: 'morning',   duration: 2, description: 'Stunning 19th-century palace with zellige tile work.' },
      { name: 'Majorelle Garden',         categories: ['nature', 'art', 'culture'],        time: 'morning',   duration: 1, description: 'Vibrant blue garden created by Jacques Majorelle.' },
      { name: 'Medina Souks',             categories: ['shopping', 'culture'],             time: 'afternoon', duration: 3, description: 'Labyrinthine market streets with artisan crafts.' },
      { name: 'Saadian Tombs',            categories: ['history', 'culture'],              time: 'morning',   duration: 1, description: 'Ornate 16th-century royal tombs.' },
      { name: 'Atlas Mountains Day Trip', categories: ['nature', 'adventure'],             time: 'morning',   duration: 6, description: 'Dramatic mountain scenery, Berber villages, and waterfalls.' },
      { name: 'Hammam Spa Experience',    categories: ['wellness', 'culture'],             time: 'afternoon', duration: 2, description: 'Traditional Moroccan steam bath and massage.' },
      { name: 'Koutoubia Mosque',         categories: ['history', 'culture'],              time: 'afternoon', duration: 1, description: 'Marrakech\'s largest mosque with stunning minaret.' },
      { name: 'Maison de la Photographie', categories: ['art', 'history', 'culture'],      time: 'afternoon', duration: 1, description: 'Gallery of historical Moroccan photography.' },
      { name: 'Desert Camel Ride',        categories: ['adventure', 'nature'],             time: 'morning',   duration: 3, description: 'Camel trek through Agafay Desert at sunrise.' },
      { name: 'El Badi Palace Ruins',     categories: ['history'],                         time: 'afternoon', duration: 1, description: 'Atmospheric ruins of a once-magnificent palace.' },
      { name: 'Rooftop Sunset Drinks',    categories: ['nightlife', 'food'],               time: 'evening',   duration: 2, description: 'Watch the sun set over the medina from a rooftop terrace.' },
    ],
    restaurants: [
      { name: 'Café Clock',             type: 'Moroccan Fusion',    price: 'low',    rating: 4.4 },
      { name: 'Jemaa Food Stalls',      type: 'Street Food',        price: 'low',    rating: 4.3 },
      { name: 'Nomad',                  type: 'Modern Moroccan',    price: 'medium', rating: 4.6 },
      { name: 'Le Jardin',              type: 'Garden Restaurant',  price: 'medium', rating: 4.5 },
      { name: 'La Mamounia',            type: 'Fine Dining',        price: 'high',   rating: 4.8 },
      { name: 'Al Fassia',              type: 'Traditional Moroccan', price: 'medium', rating: 4.7 },
      { name: 'Dar Yacout',             type: 'Riad Dining',        price: 'high',   rating: 4.7 },
    ],
  },

  // ─── 7. BALI ───
  {
    name: 'Bali',
    country: 'Indonesia',
    emoji: '🌺',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&fit=crop',
    description: 'Island of the Gods — temples, rice terraces, and surf breaks.',
    attractions: [
      { name: 'Tegallalang Rice Terraces', categories: ['nature', 'culture'],             time: 'morning',   duration: 2, description: 'Iconic layered rice paddies near Ubud.' },
      { name: 'Uluwatu Temple Sunset',      categories: ['culture', 'history', 'nature'],  time: 'evening',   duration: 2, description: 'Clifftop temple with kecak fire dance at sunset.' },
      { name: 'Ubud Art Market',            categories: ['shopping', 'art', 'culture'],    time: 'morning',   duration: 2, description: 'Traditional Balinese crafts and paintings.' },
      { name: 'Mount Batur Sunrise Trek',   categories: ['adventure', 'nature'],           time: 'morning',   duration: 4, description: 'Pre-dawn volcano hike with breathtaking sunrise.' },
      { name: 'Seminyak Beach Club',        categories: ['beach', 'nightlife'],            time: 'afternoon', duration: 3, description: 'Trendy beachfront pools with DJ sets.' },
      { name: 'Sacred Monkey Forest',       categories: ['nature', 'culture'],             time: 'afternoon', duration: 2, description: 'Ancient temple in a forest full of playful macaques.' },
      { name: 'Tirta Empul Water Temple',   categories: ['culture', 'wellness', 'history'], time: 'morning',  duration: 2, description: 'Sacred purification springs for spiritual cleansing.' },
      { name: 'Nusa Penida Island Day Trip', categories: ['beach', 'nature', 'adventure'], time: 'morning',   duration: 6, description: 'Dramatic cliffs, Kelingking beach, and manta rays.' },
      { name: 'Balinese Cooking Class',     categories: ['food', 'culture'],               time: 'morning',   duration: 3, description: 'Learn to cook authentic Balinese dishes from scratch.' },
      { name: 'Canggu Surf Lesson',         categories: ['adventure', 'beach'],            time: 'morning',   duration: 2, description: 'Catch waves at Bali\'s hippest surf spot.' },
      { name: 'Yoga Retreat Session',        categories: ['wellness', 'nature'],            time: 'morning',   duration: 2, description: 'Open-air yoga overlooking the jungle.' },
      { name: 'Kuta Night Market',           categories: ['food', 'nightlife', 'shopping'], time: 'evening',   duration: 2, description: 'Bustling night market with satay and fresh tropical fruit.' },
    ],
    restaurants: [
      { name: 'Warung Babi Guling',      type: 'Balinese Roast Pork', price: 'low',    rating: 4.6 },
      { name: 'Naughty Nuri\'s',         type: 'BBQ Ribs',            price: 'low',    rating: 4.5 },
      { name: 'Locavore',                type: 'Farm-to-Table',       price: 'high',   rating: 4.9 },
      { name: 'Mama San',                type: 'Asian Fusion',        price: 'medium', rating: 4.5 },
      { name: 'La Lucciola',             type: 'Italian Beachfront',  price: 'medium', rating: 4.4 },
      { name: 'Sardine',                 type: 'Seafood',             price: 'medium', rating: 4.6 },
      { name: 'Mozaic',                  type: 'Fine Dining',         price: 'high',   rating: 4.8 },
    ],
  },

  // ─── 8. LONDON ───
  {
    name: 'London',
    country: 'United Kingdom',
    emoji: '🎡',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&fit=crop',
    description: 'Royal palaces, world-class museums, and iconic landmarks on the Thames.',
    attractions: [
      { name: 'British Museum',           categories: ['history', 'art', 'culture'],      time: 'morning',   duration: 3, description: 'Rosetta Stone, Egyptian mummies, and 8 million artifacts.' },
      { name: 'Tower of London',          categories: ['history', 'culture'],              time: 'morning',   duration: 2, description: 'Medieval castle with Crown Jewels and Beefeater tours.' },
      { name: 'Buckingham Palace',        categories: ['history', 'culture'],              time: 'morning',   duration: 1, description: 'The King\'s official residence — catch the Changing of the Guard.' },
      { name: 'London Eye',               categories: ['culture', 'adventure'],            time: 'afternoon', duration: 1, description: 'Giant observation wheel with 360° city views.' },
      { name: 'Tate Modern',              categories: ['art', 'culture'],                  time: 'afternoon', duration: 2, description: 'Modern art in a converted power station on the Thames.' },
      { name: 'Borough Market',           categories: ['food', 'culture', 'shopping'],     time: 'morning',   duration: 2, description: 'London\'s oldest and finest food market.' },
      { name: 'Hyde Park & Kensington',   categories: ['nature', 'wellness'],              time: 'morning',   duration: 2, description: 'Royal park with Serpentine Lake and Diana memorial.' },
      { name: 'West End Theatre',         categories: ['culture', 'nightlife'],            time: 'evening',   duration: 3, description: 'World-class musicals and plays in Theatreland.' },
      { name: 'Camden Market',            categories: ['shopping', 'food', 'culture'],     time: 'afternoon', duration: 2, description: 'Alternative market with street food and vintage finds.' },
      { name: 'South Bank Walk',          categories: ['culture', 'nature'],               time: 'afternoon', duration: 2, description: 'Riverside walk past cultural venues and street performers.' },
      { name: 'Notting Hill & Portobello', categories: ['shopping', 'culture', 'food'],    time: 'afternoon', duration: 2, description: 'Pastel houses and the famous antiques market.' },
      { name: 'Soho Nightlife',           categories: ['nightlife', 'food', 'culture'],    time: 'evening',   duration: 2, description: 'Cocktail bars, jazz clubs, and diverse dining.' },
      { name: 'Greenwich Observatory',    categories: ['history', 'culture'],              time: 'afternoon', duration: 2, description: 'Stand on the Prime Meridian line with city panorama.' },
      { name: 'Hampstead Heath',          categories: ['nature', 'wellness', 'adventure'], time: 'morning',   duration: 2, description: 'Wild parkland with swimming ponds and Parliament Hill views.' },
    ],
    restaurants: [
      { name: 'Dishoom',                type: 'Indian Café',         price: 'medium', rating: 4.7 },
      { name: 'Padella',                type: 'Fresh Pasta',         price: 'low',    rating: 4.6 },
      { name: 'Flat Iron',              type: 'Steak',               price: 'low',    rating: 4.5 },
      { name: 'Borough Market Stalls',  type: 'Street Food',         price: 'low',    rating: 4.4 },
      { name: 'The Ivy',                type: 'British Brasserie',   price: 'medium', rating: 4.5 },
      { name: 'Sketch',                 type: 'Art-Gallery Dining',  price: 'high',   rating: 4.6 },
      { name: 'The Ledbury',            type: 'Fine Dining',         price: 'high',   rating: 4.8 },
      { name: 'Hawksmoor',              type: 'Steakhouse',          price: 'medium', rating: 4.7 },
    ],
  },

  // ─── 9. ISTANBUL ───
  {
    name: 'Istanbul',
    country: 'Turkey',
    emoji: '🕌',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&fit=crop',
    description: 'Where East meets West — Byzantine mosaics, Ottoman grandeur, and kebabs.',
    attractions: [
      { name: 'Hagia Sophia',             categories: ['history', 'culture', 'art'],      time: 'morning',   duration: 2, description: '1,500-year-old architectural marvel — cathedral, mosque, museum.' },
      { name: 'Blue Mosque',              categories: ['history', 'culture'],              time: 'morning',   duration: 1, description: 'Stunning mosque with 20,000 hand-painted blue tiles.' },
      { name: 'Grand Bazaar',             categories: ['shopping', 'culture'],             time: 'afternoon', duration: 3, description: 'One of the oldest and largest covered markets in the world.' },
      { name: 'Topkapi Palace',           categories: ['history', 'art', 'culture'],      time: 'morning',   duration: 2, description: 'Ottoman sultans\' lavish palace with Bosphorus views.' },
      { name: 'Bosphorus Cruise',         categories: ['nature', 'culture'],              time: 'afternoon', duration: 2, description: 'Sail between Europe and Asia with mosque-dotted skylines.' },
      { name: 'Spice Bazaar',             categories: ['food', 'shopping', 'culture'],    time: 'morning',   duration: 1, description: 'Aromatic market overflowing with spices, teas, and Turkish delight.' },
      { name: 'Basilica Cistern',         categories: ['history', 'culture'],              time: 'afternoon', duration: 1, description: 'Atmospheric underground Byzantine water reservoir.' },
      { name: 'Galata Tower',             categories: ['history', 'culture', 'adventure'], time: 'evening',  duration: 1, description: 'Medieval stone tower with 360° city panorama.' },
      { name: 'Turkish Bath (Hammam)',    categories: ['wellness', 'culture'],             time: 'afternoon', duration: 2, description: 'Traditional Ottoman bathing ritual.' },
      { name: 'Princes\' Islands',        categories: ['nature', 'beach', 'adventure'],   time: 'morning',   duration: 5, description: 'Car-free islands in the Sea of Marmara — bike and swim.' },
      { name: 'Istiklal Street & Taksim', categories: ['shopping', 'nightlife', 'culture'], time: 'evening', duration: 2, description: 'Bustling pedestrian avenue with bars, shops, and street music.' },
      { name: 'Kadikoy Food Tour',        categories: ['food', 'culture'],                time: 'afternoon', duration: 2, description: 'Asian-side market with the best street food in Istanbul.' },
    ],
    restaurants: [
      { name: 'Çiya Sofrası',           type: 'Anatolian Home Cooking', price: 'low',    rating: 4.7 },
      { name: 'Dürümzade',              type: 'Kebab Wrap',             price: 'low',    rating: 4.5 },
      { name: 'Karaköy Lokantası',      type: 'Turkish Seafood',        price: 'medium', rating: 4.6 },
      { name: 'Mikla',                  type: 'Modern Turkish',         price: 'high',   rating: 4.8 },
      { name: 'Nusr-Et Steakhouse',     type: 'Premium Steak',          price: 'high',   rating: 4.5 },
      { name: 'Hafiz Mustafa',          type: 'Desserts & Baklava',     price: 'low',    rating: 4.6 },
      { name: 'Asitane',                type: 'Ottoman Cuisine',        price: 'medium', rating: 4.5 },
    ],
  },

  // ─── 10. CAPE TOWN ───
  {
    name: 'Cape Town',
    country: 'South Africa',
    emoji: '🏔️',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&fit=crop',
    description: 'Where mountains meet the ocean — wine, wildlife, and breathtaking views.',
    attractions: [
      { name: 'Table Mountain Hike',       categories: ['nature', 'adventure'],           time: 'morning',   duration: 3, description: 'Iconic flat-topped mountain with panoramic city and ocean views.' },
      { name: 'Cape of Good Hope',         categories: ['nature', 'adventure', 'history'], time: 'morning',  duration: 4, description: 'Dramatic rocky headland at the southwestern tip of Africa.' },
      { name: 'Robben Island',             categories: ['history', 'culture'],             time: 'morning',   duration: 3, description: 'Former prison island where Nelson Mandela was held.' },
      { name: 'V&A Waterfront',            categories: ['shopping', 'food', 'culture'],    time: 'afternoon', duration: 2, description: 'Harbor-side complex with shops, restaurants, and aquarium.' },
      { name: 'Kirstenbosch Gardens',      categories: ['nature', 'wellness'],             time: 'morning',   duration: 2, description: 'World-renowned botanical garden on Table Mountain slopes.' },
      { name: 'Bo-Kaap Neighborhood',      categories: ['culture', 'history', 'food'],     time: 'afternoon', duration: 1, description: 'Colorful houses and Cape Malay cooking classes.' },
      { name: 'Stellenbosch Wine Tasting',  categories: ['food', 'nature', 'culture'],     time: 'morning',   duration: 4, description: 'World-class wineries among stunning mountain scenery.' },
      { name: 'Camps Bay Beach',           categories: ['beach', 'wellness', 'nature'],    time: 'afternoon', duration: 2, description: 'White sand beach framed by the Twelve Apostles mountains.' },
      { name: 'District Six Museum',       categories: ['history', 'culture'],             time: 'afternoon', duration: 1, description: 'Powerful museum about apartheid-era forced removals.' },
      { name: 'Chapman\'s Peak Drive',     categories: ['nature', 'adventure'],            time: 'afternoon', duration: 2, description: 'Stunning coastal road with ocean cliff views.' },
      { name: 'Long Street Nightlife',     categories: ['nightlife', 'food', 'culture'],   time: 'evening',   duration: 2, description: 'Vibrant strip of bars, restaurants, and live music.' },
      { name: 'Boulders Beach Penguins',   categories: ['nature', 'beach'],                time: 'afternoon', duration: 1, description: 'Colony of African penguins on a sheltered beach.' },
    ],
    restaurants: [
      { name: 'Mzansi',                 type: 'South African BBQ',    price: 'low',    rating: 4.4 },
      { name: 'Foodbarn',               type: 'Farm-to-Table',        price: 'medium', rating: 4.6 },
      { name: 'La Colombe',             type: 'Fine Dining',          price: 'high',   rating: 4.9 },
      { name: 'The Test Kitchen',       type: 'Avant-Garde',          price: 'high',   rating: 4.8 },
      { name: 'Kloof Street House',     type: 'Modern South African', price: 'medium', rating: 4.5 },
      { name: 'Old Biscuit Mill Market', type: 'Food Market',         price: 'low',    rating: 4.5 },
      { name: 'Harbour House',          type: 'Seafood',              price: 'medium', rating: 4.6 },
    ],
  },

  // ─── 11. SYDNEY ───
  {
    name: 'Sydney',
    country: 'Australia',
    emoji: '🦘',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&fit=crop',
    description: 'Harbor city — surf beaches, Opera House, and laid-back outdoor living.',
    attractions: [
      { name: 'Sydney Opera House',        categories: ['culture', 'art', 'history'],      time: 'morning',   duration: 2, description: 'Iconic UNESCO-listed performing arts venue.' },
      { name: 'Harbour Bridge Climb',      categories: ['adventure', 'culture'],           time: 'morning',   duration: 3, description: 'Climb the iconic bridge for 360° harbour views.' },
      { name: 'Bondi to Coogee Walk',      categories: ['nature', 'beach', 'wellness'],    time: 'morning',   duration: 2, description: 'Stunning coastal walk past cliffs and rock pools.' },
      { name: 'Bondi Beach',               categories: ['beach', 'adventure'],             time: 'afternoon', duration: 2, description: 'Australia\'s most famous beach — surf, swim, sunbathe.' },
      { name: 'The Rocks',                 categories: ['history', 'culture', 'shopping'],  time: 'afternoon', duration: 2, description: 'Sydney\'s oldest neighbourhood with cobblestone lanes.' },
      { name: 'Royal Botanic Garden',      categories: ['nature', 'wellness'],              time: 'morning',   duration: 2, description: 'Lush gardens with harbour views and flying foxes.' },
      { name: 'Taronga Zoo',               categories: ['nature', 'culture'],               time: 'morning',   duration: 3, description: 'Zoo with harbour views and native Australian animals.' },
      { name: 'Darling Harbour',           categories: ['culture', 'food', 'shopping'],    time: 'afternoon', duration: 2, description: 'Waterfront precinct with aquarium, museums, and dining.' },
      { name: 'Manly Beach Ferry',         categories: ['beach', 'nature'],                time: 'morning',   duration: 3, description: 'Scenic ferry ride to laid-back Manly Beach.' },
      { name: 'Blue Mountains Day Trip',   categories: ['nature', 'adventure'],            time: 'morning',   duration: 6, description: 'Dramatic cliffs, eucalyptus forests, and the Three Sisters.' },
      { name: 'Barangaroo Reserve',        categories: ['nature', 'culture', 'food'],      time: 'afternoon', duration: 1, description: 'Reclaimed urban park with trendy restaurants.' },
      { name: 'Kings Cross & Potts Point', categories: ['nightlife', 'food', 'culture'],   time: 'evening',   duration: 2, description: 'Trendy dining and cocktail bar scene.' },
    ],
    restaurants: [
      { name: 'Bourke Street Bakery',    type: 'Bakery & Café',       price: 'low',    rating: 4.5 },
      { name: 'Mary\'s Burgers',         type: 'Burgers',             price: 'low',    rating: 4.4 },
      { name: 'Mr Wong',                type: 'Cantonese',           price: 'medium', rating: 4.6 },
      { name: 'Firedoor',               type: 'Fire-Cooked',         price: 'high',   rating: 4.8 },
      { name: 'Quay',                   type: 'Fine Dining',         price: 'high',   rating: 4.9 },
      { name: 'Chat Thai',              type: 'Thai Street Food',    price: 'low',    rating: 4.5 },
      { name: 'Ester',                  type: 'Modern Australian',   price: 'medium', rating: 4.6 },
    ],
  },

  // ─── 12. MEXICO CITY ───
  {
    name: 'Mexico City',
    country: 'Mexico',
    emoji: '🌮',
    image: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=600&fit=crop',
    description: 'Aztec heritage, street tacos, and one of the world\'s greatest art scenes.',
    attractions: [
      { name: 'Zócalo & National Palace',   categories: ['history', 'culture'],             time: 'morning',   duration: 2, description: 'Grand main plaza with Diego Rivera murals.' },
      { name: 'Frida Kahlo Museum',          categories: ['art', 'culture', 'history'],      time: 'morning',   duration: 2, description: 'Blue House — the iconic artist\'s birthplace and home.' },
      { name: 'Teotihuacán Pyramids',        categories: ['history', 'adventure', 'culture'], time: 'morning',  duration: 5, description: 'Climb the pyramids of the Sun and Moon.' },
      { name: 'Chapultepec Park & Castle',   categories: ['nature', 'history', 'culture'],   time: 'morning',   duration: 3, description: 'Massive urban park with a hilltop castle museum.' },
      { name: 'Xochimilco Floating Gardens', categories: ['nature', 'culture', 'food'],      time: 'afternoon', duration: 3, description: 'Colorful trajinera boat ride on ancient canals.' },
      { name: 'Roma & Condesa Walk',         categories: ['culture', 'food', 'art'],         time: 'afternoon', duration: 2, description: 'Hipster neighborhoods with Art Deco architecture and cafés.' },
      { name: 'Coyoacán Market',             categories: ['food', 'culture', 'shopping'],    time: 'afternoon', duration: 2, description: 'Vibrant market with tostadas, churros, and artisan crafts.' },
      { name: 'Museum of Anthropology',      categories: ['history', 'art', 'culture'],      time: 'morning',   duration: 3, description: 'World-class museum of pre-Columbian civilizations.' },
      { name: 'Palacio de Bellas Artes',     categories: ['art', 'culture'],                 time: 'afternoon', duration: 2, description: 'Stunning Art Nouveau palace with murals by Rivera and Orozco.' },
      { name: 'Lucha Libre Wrestling',       categories: ['culture', 'nightlife', 'adventure'], time: 'evening', duration: 2, description: 'Masked wrestlers in a raucous arena — pure Mexican spectacle.' },
      { name: 'Street Art in Juárez',        categories: ['art', 'culture'],                 time: 'afternoon', duration: 1, description: 'Colorful murals and galleries in a revitalized neighborhood.' },
      { name: 'Mezcal Tasting Tour',         categories: ['food', 'nightlife', 'culture'],   time: 'evening',   duration: 2, description: 'Discover artisanal mezcal at curated tasting bars.' },
    ],
    restaurants: [
      { name: 'El Califa de León',       type: 'Taco Stand',          price: 'low',    rating: 4.7 },
      { name: 'Los Cocuyos',             type: 'Street Tacos',        price: 'low',    rating: 4.5 },
      { name: 'Pujol',                   type: 'Modern Mexican',      price: 'high',   rating: 4.9 },
      { name: 'Quintonil',               type: 'Contemporary Mexican', price: 'high',  rating: 4.8 },
      { name: 'Contramar',               type: 'Seafood',             price: 'medium', rating: 4.7 },
      { name: 'Mercado Roma',            type: 'Food Market',         price: 'medium', rating: 4.4 },
      { name: 'El Huequito',             type: 'Tacos al Pastor',     price: 'low',    rating: 4.6 },
    ],
  },
];


/* ============================================================
   STATE
============================================================ */
let currentDayIndex = 0;
let generatedPlan   = null;  // { city, days, interests, budget, itinerary[], restaurants[] }


/* ============================================================
   UTILITY FUNCTIONS
============================================================ */

/** Shuffle an array in place (Fisher-Yates) */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick N random items from an array */
function pickRandom(arr, n) {
  return shuffle(arr).slice(0, n);
}

/** Map budget label to a readable string */
function budgetLabel(budget) {
  return { low: '🪙 Budget', medium: '💵 Mid-range', high: '💎 Luxury' }[budget] || budget;
}

/** Map budget to price emoji */
function priceEmoji(price) {
  return { low: '$', medium: '$$', high: '$$$' }[price] || price;
}

/** Star rating string */
function starString(rating) {
  return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.3 ? '½' : '');
}

/** Time-of-day emoji */
function timeEmoji(time) {
  return { morning: '🌅', afternoon: '☀️', evening: '🌙' }[time] || '🕐';
}

/** Time-of-day label color class */
function timeColor(time) {
  return {
    morning:   'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    afternoon: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
    evening:   'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  }[time] || 'bg-gray-100 text-gray-800';
}


/* ============================================================
   DARK MODE
============================================================ */
function applyDarkMode(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  document.getElementById('sunIcon').classList.toggle('hidden', !isDark);
  document.getElementById('moonIcon').classList.toggle('hidden', isDark);
  localStorage.setItem('wl_dark', isDark ? '1' : '0');
}

function toggleDarkMode() {
  applyDarkMode(!document.documentElement.classList.contains('dark'));
}

// Init dark mode from saved preference or system
(function initDarkMode() {
  const saved = localStorage.getItem('wl_dark');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyDarkMode(saved !== null ? saved === '1' : prefersDark);
})();


/* ============================================================
   MOBILE MENU
============================================================ */
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const icon = document.getElementById('menuIcon');
  if (menu.style.maxHeight && menu.style.maxHeight !== '0px') {
    menu.style.maxHeight = '0px';
    icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
  } else {
    menu.style.maxHeight = menu.scrollHeight + 'px';
    icon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
  }
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const icon = document.getElementById('menuIcon');
  menu.style.maxHeight = '0px';
  icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
}


/* ============================================================
   TOAST NOTIFICATIONS
============================================================ */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const colors = {
    success: 'bg-primary dark:bg-oceanLight text-white',
    error:   'bg-red-600 text-white',
    info:    'bg-ocean text-white',
  };

  const toast = document.createElement('div');
  toast.className = `pointer-events-auto ${colors[type] || colors.info} px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 animate-fade-up`;
  toast.innerHTML = `<span>${message}</span>
    <button onclick="this.parentElement.remove()" class="ml-2 text-white/60 hover:text-white text-lg leading-none">&times;</button>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}


/* ============================================================
   SCROLL EFFECTS — navbar shadow, back-to-top
============================================================ */
window.addEventListener('scroll', () => {
  const navbar   = document.getElementById('navbar');
  const backBtn  = document.getElementById('backToTop');
  const y        = window.scrollY;

  // Navbar shadow
  if (y > 40) {
    navbar.classList.add('shadow-lg', 'shadow-black/5');
  } else {
    navbar.classList.remove('shadow-lg', 'shadow-black/5');
  }

  // Back-to-top visibility
  if (y > 500) {
    backBtn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    backBtn.classList.add('opacity-100', 'translate-y-0');
  } else {
    backBtn.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    backBtn.classList.remove('opacity-100', 'translate-y-0');
  }
}, { passive: true });


/* ============================================================
   POPULATE FORM ELEMENTS
============================================================ */

/** Build interest checkbox chips */
function buildInterestChips() {
  const grid = document.getElementById('interestsGrid');
  grid.innerHTML = INTERESTS.map(i => `
    <div class="inline-flex">
      <input type="checkbox" id="int_${i.id}" value="${i.id}" class="interest-check sr-only" />
      <label for="int_${i.id}"
        class="px-4 py-2 rounded-full border border-primary/15 dark:border-darkBorder text-sm font-medium text-ocean/70 dark:text-gray-400 cursor-pointer transition
               hover:border-primary/40 dark:hover:border-oceanLight/40 select-none">
        ${i.label}
      </label>
    </div>
  `).join('');
}

/** Populate destination dropdown */
function buildDestinationDropdown() {
  const select = document.getElementById('destination');
  cities.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = `${c.emoji} ${c.name}, ${c.country}`;
    select.appendChild(opt);
  });
}

/** Build destination showcase cards */
function buildDestinationCards() {
  const grid = document.getElementById('destinationGrid');
  grid.innerHTML = cities.map(c => `
    <article class="plan-card group rounded-2xl overflow-hidden bg-white dark:bg-darkCard border border-primary/5 dark:border-darkBorder cursor-pointer"
             onclick="quickPlan('${c.name}')">
      <div class="relative overflow-hidden aspect-[4/3]">
        <img src="${c.image}" alt="${c.name}" loading="lazy"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div class="absolute inset-0 bg-gradient-to-t from-ocean/80 to-transparent"></div>
        <div class="absolute bottom-3 left-3">
          <span class="text-2xl mr-1.5">${c.emoji}</span>
          <span class="text-white font-bold text-sm">${c.name}</span>
          <span class="text-white/60 text-xs ml-1">${c.country}</span>
        </div>
      </div>
      <div class="p-3">
        <p class="text-ocean/60 dark:text-gray-400 text-xs line-clamp-2 leading-relaxed">${c.description}</p>
        <div class="flex items-center gap-1.5 mt-2">
          <span class="text-primary dark:text-oceanLight text-[10px] font-bold uppercase tracking-wider">${c.attractions.length} attractions</span>
          <span class="text-ocean/30 dark:text-gray-600">•</span>
          <span class="text-primary dark:text-oceanLight text-[10px] font-bold uppercase tracking-wider">${c.restaurants.length} restaurants</span>
        </div>
      </div>
    </article>
  `).join('');
}


/* ============================================================
   QUICK PLAN — triggered from destination cards / footer links
============================================================ */
function quickPlan(cityName) {
  // Pre-fill the form and scroll to planner
  const destSelect = document.getElementById('destination');
  destSelect.value = cityName;
  document.getElementById('planner').scrollIntoView({ behavior: 'smooth', block: 'start' });
}


/* ============================================================
   RECOMMENDATION ENGINE
   ─────────────────────
   Core logic:
   1. Find city by name
   2. Filter attractions matching selected interests
   3. Group attractions by time-of-day (morning → afternoon → evening)
   4. Distribute across the requested number of days
   5. Filter restaurants by budget level
============================================================ */

/**
 * Filter attractions that match at least one of the user's selected interests.
 * @param {Array} attractions - City attractions array
 * @param {string[]} interests - Selected interest IDs
 * @returns {Array} Filtered & shuffled attractions
 */
function filterAttractions(attractions, interests) {
  const matched = attractions.filter(a =>
    a.categories.some(cat => interests.includes(cat))
  );
  return shuffle(matched);
}

/**
 * Filter restaurants that match the user's budget level.
 * Budget "medium" also includes "low"; "high" includes "medium" and "low".
 * @param {Array} restaurants - City restaurant array
 * @param {string} budget - 'low' | 'medium' | 'high'
 * @returns {Array} Filtered restaurants
 */
function filterRestaurants(restaurants, budget) {
  const tiers = { low: ['low'], medium: ['low', 'medium'], high: ['low', 'medium', 'high'] };
  const allowed = tiers[budget] || ['low', 'medium'];

  // Prioritize the exact budget tier, then fall back
  const exact   = restaurants.filter(r => r.price === budget);
  const others  = restaurants.filter(r => allowed.includes(r.price) && r.price !== budget);

  return [...shuffle(exact), ...shuffle(others)];
}

/**
 * Build a daily itinerary by distributing attractions across days.
 * Each day has morning, afternoon, and evening slots.
 * @param {Array} attractions - Filtered attractions
 * @param {number} numDays - Number of days (1–14)
 * @returns {Array<{ day: number, activities: Array }>}
 */
function buildItinerary(attractions, numDays) {
  // Sort by time-of-day: morning → afternoon → evening, then shuffle within groups
  const morning   = shuffle(attractions.filter(a => a.time === 'morning'));
  const afternoon = shuffle(attractions.filter(a => a.time === 'afternoon'));
  const evening   = shuffle(attractions.filter(a => a.time === 'evening'));

  // Interleave: for each day, pick from morning, afternoon, evening pools
  const days = [];
  let mIdx = 0, aIdx = 0, eIdx = 0;

  for (let d = 0; d < numDays; d++) {
    const activities = [];

    // Morning: 1–2 activities
    const mCount = morning.length > mIdx + 1 ? 2 : (morning.length > mIdx ? 1 : 0);
    for (let i = 0; i < mCount && mIdx < morning.length; i++) {
      activities.push({ ...morning[mIdx++], slot: 'morning' });
    }

    // Afternoon: 1–2 activities
    const aCount = afternoon.length > aIdx + 1 ? 2 : (afternoon.length > aIdx ? 1 : 0);
    for (let i = 0; i < aCount && aIdx < afternoon.length; i++) {
      activities.push({ ...afternoon[aIdx++], slot: 'afternoon' });
    }

    // Evening: 1 activity
    if (eIdx < evening.length) {
      activities.push({ ...evening[eIdx++], slot: 'evening' });
    }

    // If we have activities, add the day
    if (activities.length > 0) {
      days.push({ day: d + 1, activities });
    }
  }

  // If we have fewer days than requested (not enough attractions), that's fine
  // If we have leftover attractions, distribute them into existing days
  const leftover = [
    ...morning.slice(mIdx),
    ...afternoon.slice(aIdx),
    ...evening.slice(eIdx),
  ];

  leftover.forEach((a, i) => {
    if (days.length > 0) {
      const dayIdx = i % days.length;
      days[dayIdx].activities.push({ ...a, slot: a.time });
    }
  });

  // Ensure we have at least as many day entries as numDays (some may be empty)
  while (days.length < numDays && attractions.length > 0) {
    // Re-use random attractions for filler days
    const filler = pickRandom(attractions, Math.min(3, attractions.length));
    days.push({
      day: days.length + 1,
      activities: filler.map(a => ({ ...a, slot: a.time })),
    });
  }

  return days;
}

/**
 * Main generation function — orchestrates the recommendation engine.
 */
function generatePlan(cityName, numDays, interests, budget) {
  const city = cities.find(c => c.name === cityName);
  if (!city) return null;

  const filteredAttractions = filterAttractions(city.attractions, interests);
  const itinerary           = buildItinerary(filteredAttractions, numDays);
  const restaurants         = filterRestaurants(city.restaurants, budget);

  return {
    city,
    numDays,
    interests,
    budget,
    itinerary,
    restaurants,
  };
}


/* ============================================================
   FORM HANDLING
============================================================ */
function handleFormSubmit(e) {
  e.preventDefault();

  // Gather inputs
  const cityName  = document.getElementById('destination').value;
  const numDays   = parseInt(document.getElementById('numDays').value, 10);
  const interests = [...document.querySelectorAll('.interest-check:checked')].map(cb => cb.value);
  const budget    = document.querySelector('input[name="budget"]:checked')?.value || 'medium';

  // Validate
  let valid = true;

  if (!cityName) {
    document.getElementById('destError').classList.remove('hidden');
    valid = false;
  } else {
    document.getElementById('destError').classList.add('hidden');
  }

  if (interests.length === 0) {
    document.getElementById('interestError').classList.remove('hidden');
    valid = false;
  } else {
    document.getElementById('interestError').classList.add('hidden');
  }

  if (!valid) {
    showToast('⚠️ Please fill in all required fields.', 'error');
    return;
  }

  // Show loading overlay
  const loader = document.getElementById('loadingOverlay');
  loader.classList.remove('hidden');

  // Simulate processing delay (800–1500ms)
  const delay = 800 + Math.random() * 700;
  setTimeout(() => {
    generatedPlan = generatePlan(cityName, numDays, interests, budget);
    loader.classList.add('hidden');

    if (!generatedPlan) {
      showToast('❌ City not found. Please try again.', 'error');
      return;
    }

    renderResults();
    showToast('✅ Your itinerary is ready!', 'success');

    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, delay);
}


/* ============================================================
   RENDER RESULTS
============================================================ */

function renderResults() {
  if (!generatedPlan) return;

  const { city, numDays, interests, budget, itinerary, restaurants } = generatedPlan;
  const resultsSection = document.getElementById('results');
  resultsSection.classList.remove('hidden');

  // ── Header ──
  document.getElementById('resultsHeader').innerHTML = `
    <p class="text-primary dark:text-oceanLight text-xs font-bold uppercase tracking-widest mb-2">Your Itinerary</p>
    <h2 class="font-display text-3xl md:text-4xl font-bold text-ocean dark:text-white mb-3">
      ${city.emoji} ${numDays} Day${numDays > 1 ? 's' : ''} in ${city.name}
    </h2>
    <p class="text-ocean/60 dark:text-gray-400 text-sm max-w-xl mx-auto mb-4">${city.description}</p>
    <div class="flex flex-wrap items-center justify-center gap-2">
      ${interests.map(i => {
        const int = INTERESTS.find(x => x.id === i);
        return `<span class="px-3 py-1 rounded-full bg-primary/10 dark:bg-oceanLight/10 text-primary dark:text-oceanLight text-xs font-semibold">${int ? int.label : i}</span>`;
      }).join('')}
      <span class="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">${budgetLabel(budget)}</span>
    </div>
  `;

  // ── Day Tabs ──
  const tabsEl = document.getElementById('dayTabs');
  tabsEl.innerHTML = itinerary.map((d, idx) => `
    <button class="day-tab px-5 py-2.5 rounded-full border border-primary/15 dark:border-darkBorder text-sm font-semibold transition ${idx === 0 ? 'active' : 'text-ocean/60 dark:text-gray-400'}"
            onclick="switchDay(${idx})">
      Day ${d.day}
    </button>
  `).join('');

  // Render first day
  currentDayIndex = 0;
  renderDayContent(0);

  // ── Restaurants ──
  renderRestaurants(restaurants);
}

function switchDay(idx) {
  currentDayIndex = idx;
  // Update tab styles
  document.querySelectorAll('.day-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === idx);
    if (i !== idx) {
      tab.classList.add('text-ocean/60', 'dark:text-gray-400');
    } else {
      tab.classList.remove('text-ocean/60', 'dark:text-gray-400');
    }
  });
  renderDayContent(idx);
}

function renderDayContent(idx) {
  const contentEl = document.getElementById('dayContent');
  const day = generatedPlan.itinerary[idx];

  if (!day || day.activities.length === 0) {
    contentEl.innerHTML = `
      <div class="text-center py-16">
        <span class="text-5xl mb-4 block">🏖️</span>
        <p class="text-ocean/60 dark:text-gray-400 font-medium">Free day — relax, explore on your own!</p>
      </div>`;
    return;
  }

  const slotOrder = ['morning', 'afternoon', 'evening'];
  const grouped = {};
  day.activities.forEach(a => {
    if (!grouped[a.slot]) grouped[a.slot] = [];
    grouped[a.slot].push(a);
  });

  let html = '';

  slotOrder.forEach(slot => {
    if (!grouped[slot]) return;

    html += `
      <div class="mb-4">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-xl">${timeEmoji(slot)}</span>
          <h4 class="font-display font-bold text-lg text-ocean dark:text-white capitalize">${slot}</h4>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          ${grouped[slot].map((a, aIdx) => `
            <article class="plan-card animate-fade-up bg-sky dark:bg-darkBg rounded-2xl border border-primary/5 dark:border-darkBorder p-5 flex gap-4"
                     style="animation-delay:${(aIdx * 0.08).toFixed(2)}s">
              <div class="shrink-0 w-12 h-12 rounded-xl bg-primary/10 dark:bg-oceanLight/10 flex items-center justify-center">
                <span class="text-xl">${timeEmoji(slot)}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2 mb-1">
                  <h5 class="font-bold text-sm text-ocean dark:text-white">${a.name}</h5>
                  <span class="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${timeColor(slot)}">${a.duration}h</span>
                </div>
                <p class="text-ocean/50 dark:text-gray-500 text-xs leading-relaxed mb-2">${a.description}</p>
                <div class="flex flex-wrap gap-1">
                  ${a.categories.map(cat => `<span class="px-2 py-0.5 rounded-full bg-primary/5 dark:bg-oceanLight/10 text-primary dark:text-oceanLight text-[10px] font-semibold">${cat}</span>`).join('')}
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </div>`;
  });

  contentEl.innerHTML = html;
}

function renderRestaurants(restaurants) {
  const grid = document.getElementById('restaurantGrid');
  // Show up to 6 restaurants
  const shown = restaurants.slice(0, 6);

  grid.innerHTML = shown.map((r, idx) => `
    <article class="plan-card animate-fade-up bg-sky dark:bg-darkBg rounded-2xl border border-primary/5 dark:border-darkBorder p-5"
             style="animation-delay:${(idx * 0.08).toFixed(2)}s">
      <div class="flex items-center justify-between mb-3">
        <span class="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold">${priceEmoji(r.price)}</span>
        <span class="text-yellow-500 text-xs">${starString(r.rating)} <span class="text-ocean/40 dark:text-gray-500">${r.rating}</span></span>
      </div>
      <h5 class="font-bold text-sm text-ocean dark:text-white mb-1">${r.name}</h5>
      <p class="text-ocean/50 dark:text-gray-500 text-xs">${r.type}</p>
    </article>
  `).join('');
}


/* ============================================================
   RESET PLANNER
============================================================ */
function resetPlanner() {
  generatedPlan = null;
  document.getElementById('results').classList.add('hidden');
  document.getElementById('tripForm').reset();

  // Re-check medium budget by default
  document.getElementById('budgetMed').checked = true;

  // Clear interest checks
  document.querySelectorAll('.interest-check').forEach(cb => cb.checked = false);

  document.getElementById('planner').scrollIntoView({ behavior: 'smooth', block: 'start' });
}


/* ============================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileMenu();
    }
  });
});


/* ============================================================
   INITIALIZATION
============================================================ */
(function init() {
  buildInterestChips();
  buildDestinationDropdown();
  buildDestinationCards();
})();

-- Seed script for eco-tourism-platform-v2
-- Creates demo users, profiles, projects, and offers

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create missing tables (for modules not imported in AppModule)
CREATE TABLE IF NOT EXISTS guides (
  user_id UUID PRIMARY KEY,
  full_name VARCHAR NOT NULL,
  guide_type VARCHAR,
  bio TEXT,
  country VARCHAR,
  language VARCHAR,
  photo TEXT,
  cover_photo TEXT,
  zone VARCHAR,
  specialties TEXT[],
  languages_spoken TEXT[],
  years_experience INT,
  status VARCHAR DEFAULT 'pending',
  profile_completion INT DEFAULT 0,
  is_onboarded BOOLEAN DEFAULT false,
  sustainability_score INT,
  score_questionnaire INT,
  score_reservations INT DEFAULT 0,
  score_feedbacks INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_owners (
  user_id UUID PRIMARY KEY,
  full_name VARCHAR NOT NULL,
  bio TEXT,
  country VARCHAR,
  language VARCHAR,
  photo TEXT,
  cover_photo TEXT,
  organization VARCHAR,
  position VARCHAR,
  phone VARCHAR,
  profile_completion INT DEFAULT 0,
  is_onboarded BOOLEAN DEFAULT false,
  sustainability_score INT,
  score_questionnaire INT,
  score_reservations INT DEFAULT 0,
  score_feedbacks INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES project_owners(user_id),
  name VARCHAR NOT NULL,
  project_type TEXT[],
  description TEXT,
  region VARCHAR,
  address VARCHAR,
  photo TEXT,
  photos TEXT[],
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  opening_hours VARCHAR,
  facebook VARCHAR,
  instagram VARCHAR,
  status VARCHAR DEFAULT 'pending',
  rejection_reason TEXT,
  sustainability_score INT,
  services TEXT[],
  eco_labels TEXT[],
  website VARCHAR,
  phone VARCHAR,
  whatsapp VARCHAR,
  secondary_activity_types TEXT[],
  certifications TEXT[],
  history TEXT,
  videos TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed data
DO $$
DECLARE
  v_user1_id UUID;
  v_user2_id UUID;
  v_project1_id UUID;
  v_project2_id UUID;
  v_offer1_id UUID;
  v_offer2_id UUID;
BEGIN
  -- ============================================================
  -- User 1: fakerbennoomen@gmail.com (PROVIDER)
  -- ============================================================
  INSERT INTO users (id, email, password, auth_method, role, status, email_verified_at)
  VALUES (
    gen_random_uuid(),
    'fakerbennoomen@gmail.com',
    '$2b$10$xi12LqzYTWB7wtjUrFdBCueOXdipgKc.he4/x5qG3mbB7IgkeIQge',
    'email',
    'provider',
    'active',
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET status = 'active', email_verified_at = NOW()
  RETURNING id INTO v_user1_id;

  -- Provider profile for user 1 (guide type)
  INSERT INTO providers (user_id, full_name, provider_type, bio, country, language, region, status, languages_spoken, years_experience, specialties, services)
  VALUES (
    v_user1_id,
    'Faker Bennoomen',
    'guide',
    'Guide passionné par la nature et le tourisme durable. Je propose des randonnées éco-responsables dans les plus beaux paysages de Tunisie.',
    'Tunisie',
    'fr',
    'Nord-Ouest',
    'active',
    ARRAY['Français', 'Arabe', 'Anglais'],
    8,
    ARRAY['Randonnée', 'VTT', 'Observation faune', 'Visites culturelles'],
    ARRAY['Guide touristique', 'Accompagnateur', 'Conseil en écotourisme']
  )
  ON CONFLICT (user_id) DO UPDATE SET status = 'active'
  RETURNING user_id INTO v_user1_id;

  -- ============================================================
  -- User 2: f.akerbennoomen@gmail.com (ECO_TRAVELER + Guide + ProjectOwner)
  -- ============================================================
  INSERT INTO users (id, email, password, auth_method, role, status, email_verified_at)
  VALUES (
    gen_random_uuid(),
    'f.akerbennoomen@gmail.com',
    '$2b$10$xi12LqzYTWB7wtjUrFdBCueOXdipgKc.he4/x5qG3mbB7IgkeIQge',
    'email',
    'eco_traveler',
    'active',
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET status = 'active', email_verified_at = NOW()
  RETURNING id INTO v_user2_id;

  -- Eco-traveler profile
  INSERT INTO eco_travelers (user_id, full_name, bio, country, language, is_onboarded, profile_completion, traveler_types, motivations, sustainability_values, landscapes, travel_styles, sustainability_goals)
  VALUES (
    v_user2_id,
    'F. Aker Bennoomen',
    'Voyageur éco-responsable passionné par la découverte des cultures locales et la protection de l environnement.',
    'Tunisie',
    'fr',
    true,
    80,
    ARRAY['Aventurier', 'Éco-touriste', 'Culturel'],
    ARRAY['Découverte', 'Nature', 'Rencontres locales'],
    ARRAY['Respect environnement', 'Éthique', 'Partage'],
    ARRAY['Montagne', 'Forêt', 'Désert', 'Mer'],
    ARRAY['Randonnée', 'Slow travel', 'Immersion culturelle'],
    ARRAY['Réduire empreinte carbone', 'Soutenir économie locale']
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Guide profile for user 2
  INSERT INTO guides (user_id, full_name, guide_type, bio, country, language, zone, specialties, languages_spoken, years_experience, status, is_onboarded, profile_completion)
  VALUES (
    v_user2_id,
    'F. Aker Bennoomen',
    'local',
    'Guide local passionné partageant les secrets de sa région et les traditions locales.',
    'Tunisie',
    'fr',
    'Sud-Est',
    ARRAY['Visites guidées', 'Artisanat local', 'Gastronomie'],
    ARRAY['Français', 'Arabe', 'Anglais', 'Espagnol'],
    5,
    'active',
    true,
    75
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Project owner profile for user 2
  INSERT INTO project_owners (user_id, full_name, bio, country, language, organization, position, phone, is_onboarded, profile_completion)
  VALUES (
    v_user2_id,
    'F. Aker Bennoomen',
    'Propriétaire de projets écotouristiques visant à promouvoir le tourisme durable en Tunisie.',
    'Tunisie',
    'fr',
    'EcoVoyage Tunisie',
    'Fondateur & Gérant',
    '+216 99 999 999',
    true,
    70
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- ============================================================
  -- Projects (owned by User 2 as ProjectOwner)
  -- ============================================================
  INSERT INTO projects (id, owner_id, name, project_type, description, region, address, status, sustainability_score, services, eco_labels, phone, whatsapp)
  VALUES (
    gen_random_uuid(),
    v_user2_id,
    'Écolodge des Dunes',
    ARRAY['Hébergement', 'Écotourisme'],
    'Un écolodge écologique en plein cœur du désert tunisien. Construit avec des matériaux locaux et fonctionnant à l énergie solaire. Offre une expérience unique d immersion dans le désert avec un impact environnemental minimal.',
    'Sud',
    'Ksar Ghilane, Tunisie',
    'active',
    85,
    ARRAY['Hébergement', 'Restauration bio', 'Randonnées', 'Ateliers artisanaux'],
    ARRAY['Clé Verte', 'Écolabel Tunisien'],
    '+216 99 999 991',
    '+216 99 999 991'
  )
  RETURNING id INTO v_project1_id;

  INSERT INTO projects (id, owner_id, name, project_type, description, region, address, status, sustainability_score, services, eco_labels, phone, whatsapp)
  VALUES (
    gen_random_uuid(),
    v_user2_id,
    'Ferme Agro-écologique Berbère',
    ARRAY['Agriculture', 'Écotourisme', 'Formation'],
    'Ferme agro-écologique proposant des séjours d immersion dans la vie rurale tunisienne. Les visiteurs participent aux activités agricoles biologiques et découvrent les traditions berbères.',
    'Nord-Ouest',
    'Dougga, Tunisie',
    'active',
    90,
    ARRAY['Agriculture bio', 'Hébergement rural', 'Cours de cuisine', 'Ateliers artisanaux'],
    ARRAY['Agriculture Biologique', 'Slow Food'],
    '+216 99 999 992',
    '+216 99 999 992'
  )
  RETURNING id INTO v_project2_id;

  -- ============================================================
  -- Offers (created by User 1 as Provider)
  -- ============================================================
  INSERT INTO offers (id, author_id, author_type, title, description, price, duration, offer_type, fulfillment_mode, region, status, price_type, capacity, min_group_size, max_group_size, sustainability_score, meeting_point, inclusions)
  VALUES (
    gen_random_uuid(),
    v_user1_id,
    'provider',
    'Randonnée guidée dans les montagnes de Kroumirie',
    'Une magnifique randonnée de 6 heures à travers les forêts de chênes-lièges et les montagnes de Kroumirie. Découvrez la faune et la flore locales accompagné d un guide expérimenté. Pique-nique bio inclus.',
    75.00,
    '1 journée',
    'activite',
    'scheduled',
    'Nord-Ouest',
    'approved',
    'per_person',
    15,
    2,
    15,
    80,
    'Aïn Draham, Centre-ville',
    'Guide professionnel, Pique-nique bio, Bâtons de marche, Assurance'
  )
  RETURNING id INTO v_offer1_id;

  INSERT INTO offers (id, author_id, author_type, title, description, price, duration, offer_type, fulfillment_mode, region, status, price_type, capacity, min_group_size, max_group_size, sustainability_score, meeting_point, inclusions, offer_subtypes, offer_mode)
  VALUES (
    gen_random_uuid(),
    v_user1_id,
    'provider',
    'Circuit éco-responsable : 3 jours dans le désert',
    'Un circuit de 3 jours en petit groupe (max 8 personnes) pour explorer le désert tunisien de manière responsable. Nuits chez l habitant, transport partagé, et rencontre avec les communautés locales.',
    350.00,
    '3 jours',
    'circuit',
    'scheduled',
    'Sud',
    'approved',
    'per_person',
    8,
    2,
    8,
    92,
    'Douz, Point de rendez-vous',
    'Transport aller-retour, Hébergement 2 nuits, Repas, Guide, Taxes environnementales',
    to_jsonb(ARRAY['Aventure', 'Culturel', 'Photographie']),
    'package'
  )
  RETURNING id INTO v_offer2_id;

  RAISE NOTICE 'Seed completed successfully:';
  RAISE NOTICE '  User 1 (provider): fakerbennoomen@gmail.com / 17092001';
  RAISE NOTICE '  User 2 (eco_traveler): f.akerbennoomen@gmail.com / 17092001';
  RAISE NOTICE '  Projects created: 2';
  RAISE NOTICE '  Offers created: 2';
END $$;

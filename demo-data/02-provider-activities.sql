-- ─────────────────────────────────────────────────────────────────────────
-- Activités déclarées des prestataires (onglet « Activités » du profil)
-- Idempotent. Crée l'organisation manquante de la ferme bio.
-- ─────────────────────────────────────────────────────────────────────────

-- 1) Organisation pour la ferme bio (absente en base)
INSERT INTO organizations (provider_id, name, provider_type, bio, region, country, status)
SELECT u.id, 'Ferme Bio de Tabarka', 'ferme',
       'Ferme biologique et table paysanne à Tabarka : cueillette, ateliers et dégustation.',
       'Jendouba', 'Tunisie', 'active'
FROM users u
WHERE u.email = 'ferme.bio.tabarka@gmail.com'
  AND NOT EXISTS (SELECT 1 FROM organizations o WHERE o.provider_id = u.id);

-- 2) Activités (principales + secondaires)
WITH acts(provider_email, level, category, subtypes, years_experience) AS (
  VALUES
    ('fakerbennoomen@gmail.com',       'primary',   'hebergement',        ARRAY['ecolodge','maison_hotes','gite_rural'],                            8),
    ('fakerbennoomen@gmail.com',       'primary',   'restaurant_terroir', ARRAY['table_hotes','restaurant_traditionnel','degustation_produits'],   6),
    ('fakerbennoomen@gmail.com',       'secondary', 'bien_etre_spa',      ARRAY['retraite_yoga','bain_thermal','therapie_plantes'],                4),
    ('fakerbennoomen@gmail.com',       'secondary', 'activite',           ARRAY['randonnee','observation_oiseaux','kayak_canoe'],                 10),
    ('fakerbennoomen@gmail.com',       'secondary', 'artisanat',          ARRAY['poterie','vannerie'],                                              3),
    ('ferme.bio.tabarka@gmail.com',    'primary',   'agriculture_terroir',ARRAY['visite_ferme','cueillette','atelier_fromage_yaourt','apiculture'], 15),
    ('ferme.bio.tabarka@gmail.com',    'primary',   'restaurant_terroir', ARRAY['ferme_restaurant','table_hotes','degustation_produits'],          12),
    ('ferme.bio.tabarka@gmail.com',    'secondary', 'activite',           ARRAY['cours_cuisine','plantation_jardinage'],                            7),
    ('ferme.bio.tabarka@gmail.com',    'secondary', 'artisanat',          ARRAY['vannerie','poterie'],                                              5)
)
INSERT INTO provider_activities (provider_id, organization_id, level, category, subtypes, years_experience)
SELECT u.id, o.id, a.level, a.category, to_jsonb(a.subtypes), a.years_experience
FROM acts a
JOIN users u ON u.email = a.provider_email
JOIN organizations o ON o.provider_id = u.id
WHERE NOT EXISTS (
  SELECT 1 FROM provider_activities pa
  WHERE pa.provider_id = u.id AND pa.category = a.category
);

SELECT 'organizations' AS t, count(*) FROM organizations
UNION ALL SELECT 'provider_activities', count(*) FROM provider_activities;

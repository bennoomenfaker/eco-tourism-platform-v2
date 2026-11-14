-- ─────────────────────────────────────────────────────────────────────────
-- Fusion des doublons de lieux (mêmes coordonnées) + corrections de données
-- Idempotent : ne fait rien si les doublons ont déjà été fusionnés.
--   1. Cascades de Beni M'Tir ×2      → garde 3d010e04… (fiche récente)
--   2. Lac Ichkeul + Parc de l'Ichkeul → garde 24467bcf… (fiche UNESCO)
--   3. Ruines + Site archéologique de Dougga → garde 5e5ea844… (nom UNESCO)
-- Les likes / commentaires / partages / contributions des fiches supprimées
-- sont reportés sur la fiche conservée.
-- ─────────────────────────────────────────────────────────────────────────

BEGIN;

-- 1) Cascades de Beni M'Tir ────────────────────────────────────────────────
-- Fiche conservée : 3d010e04… (créée par le seed, place_name « Beni M'Tir »)
-- Fiche supprimée : ae16b8af… (description plus détaillée → reprise ci-dessous)
UPDATE publication_likes SET publication_id = '3d010e04-64e8-5939-8f30-c2e06620dfdb'
WHERE publication_id = 'ae16b8af-6be3-4f2b-9e8e-6829804b81bb'
  AND NOT EXISTS (
    SELECT 1 FROM publication_likes x
    WHERE x.publication_id = '3d010e04-64e8-5939-8f30-c2e06620dfdb'
      AND x.user_id = publication_likes.user_id
  );
DELETE FROM publication_likes WHERE publication_id = 'ae16b8af-6be3-4f2b-9e8e-6829804b81bb';

UPDATE publication_comments SET publication_id = '3d010e04-64e8-5939-8f30-c2e06620dfdb'
WHERE publication_id = 'ae16b8af-6be3-4f2b-9e8e-6829804b81bb';

UPDATE publication_shares SET publication_id = '3d010e04-64e8-5939-8f30-c2e06620dfdb'
WHERE publication_id = 'ae16b8af-6be3-4f2b-9e8e-6829804b81bb';

UPDATE place_contributions SET publication_id = '3d010e04-64e8-5939-8f30-c2e06620dfdb'
WHERE publication_id = 'ae16b8af-6be3-4f2b-9e8e-6829804b81bb';

UPDATE publications
SET description = 'Une série de cascades au cœur de la forêt de chênes-lièges, accessible en 1 h de marche facile depuis le parking. Prévoyez de bonnes chaussures : le rocher est glissant après la pluie.',
    place_name  = 'Cascades de Beni M''Tir'
WHERE id = '3d010e04-64e8-5939-8f30-c2e06620dfdb';

DELETE FROM publications WHERE id = 'ae16b8af-6be3-4f2b-9e8e-6829804b81bb';

-- 2) Ichkeul ───────────────────────────────────────────────────────────────
-- Fiche conservée : 24467bcf… « Parc national de l'Ichkeul »
-- Fiche supprimée : 54f91acc… « Lac Ichkeul » (même point GPS)
UPDATE publication_likes SET publication_id = '24467bcf-1c35-5e56-8b79-e24d297003ac'
WHERE publication_id = '54f91acc-47c1-42e2-904b-e1db1bd2515f'
  AND NOT EXISTS (
    SELECT 1 FROM publication_likes x
    WHERE x.publication_id = '24467bcf-1c35-5e56-8b79-e24d297003ac'
      AND x.user_id = publication_likes.user_id
  );
DELETE FROM publication_likes WHERE publication_id = '54f91acc-47c1-42e2-904b-e1db1bd2515f';

UPDATE publication_comments SET publication_id = '24467bcf-1c35-5e56-8b79-e24d297003ac'
WHERE publication_id = '54f91acc-47c1-42e2-904b-e1db1bd2515f';

UPDATE publication_shares SET publication_id = '24467bcf-1c35-5e56-8b79-e24d297003ac'
WHERE publication_id = '54f91acc-47c1-42e2-904b-e1db1bd2515f';

UPDATE place_contributions SET publication_id = '24467bcf-1c35-5e56-8b79-e24d297003ac'
WHERE publication_id = '54f91acc-47c1-42e2-904b-e1db1bd2515f';

UPDATE publications
SET description = 'Lac alimenté par six oueds et réserve de biosphère UNESCO, refuge de centaines de milliers d''oiseaux migrateurs chaque hiver. Observation depuis les affûts au lever du jour ; site protégé, accès réglementé.',
    place_name  = 'Ichkeul'
WHERE id = '24467bcf-1c35-5e56-8b79-e24d297003ac';

DELETE FROM publications WHERE id = '54f91acc-47c1-42e2-904b-e1db1bd2515f';

-- 3) Dougga ────────────────────────────────────────────────────────────────
-- Fiche conservée : 5e5ea844… « Site archéologique de Dougga » (nom UNESCO)
-- Fiche supprimée : 45ebd6a9… « Ruines de Dougga »
UPDATE publication_likes SET publication_id = '5e5ea844-7e5a-4c0e-a6d0-1da626a27039'
WHERE publication_id = '45ebd6a9-e761-5abb-8325-62939229d1c8'
  AND NOT EXISTS (
    SELECT 1 FROM publication_likes x
    WHERE x.publication_id = '5e5ea844-7e5a-4c0e-a6d0-1da626a27039'
      AND x.user_id = publication_likes.user_id
  );
DELETE FROM publication_likes WHERE publication_id = '45ebd6a9-e761-5abb-8325-62939229d1c8';

UPDATE publication_comments SET publication_id = '5e5ea844-7e5a-4c0e-a6d0-1da626a27039'
WHERE publication_id = '45ebd6a9-e761-5abb-8325-62939229d1c8';

UPDATE publication_shares SET publication_id = '5e5ea844-7e5a-4c0e-a6d0-1da626a27039'
WHERE publication_id = '45ebd6a9-e761-5abb-8325-62939229d1c8';

UPDATE place_contributions SET publication_id = '5e5ea844-7e5a-4c0e-a6d0-1da626a27039'
WHERE publication_id = '45ebd6a9-e761-5abb-8325-62939229d1c8';

-- Dougga est à Béja (gouvernorat), pas au Kef ; coordonnées harmonisées.
UPDATE publications
SET region      = 'Béja',
    place_name  = 'Dougga',
    latitude    = 36.4233,
    longitude   = 9.2208,
    description = 'Cité romaine classée UNESCO, l''un des sites les mieux conservés d''Afrique du Nord : Capitole, théâtre, thermes et temples. À visiter tôt le matin pour éviter la chaleur.'
WHERE id = '5e5ea844-7e5a-4c0e-a6d0-1da626a27039';

DELETE FROM publications WHERE id = '45ebd6a9-e761-5abb-8325-62939229d1c8';

COMMIT;

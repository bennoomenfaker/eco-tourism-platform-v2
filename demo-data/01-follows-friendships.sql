-- ─────────────────────────────────────────────────────────────────────────
-- Données sociales de démo — follows + friendships (idempotent)
-- Alimente /publications/feed (éco-voyageur) et /publications/feed/pro
-- (guide / prestataire / projet) qui exigent des relations « accepted ».
-- ─────────────────────────────────────────────────────────────────────────

-- 1) Abonnements acceptés
WITH pairs(follower_email, following_email) AS (
  VALUES
    -- éco-voyageur principal → guides + prestataires
    ('fakerben.noomen@gmail.com', 'faker.bennoomen@gmail.com'),
    ('fakerben.noomen@gmail.com', 'fakerbennoomen@gmail.com'),
    ('fakerben.noomen@gmail.com', 'ferme.bio.tabarka@gmail.com'),
    ('fakerben.noomen@gmail.com', 'karim.haddad.tn@gmail.com'),
    -- autres éco-voyageurs
    ('lina.bouaziz.tn@gmail.com', 'faker.bennoomen@gmail.com'),
    ('lina.bouaziz.tn@gmail.com', 'fakerbennoomen@gmail.com'),
    ('lina.bouaziz.tn@gmail.com', 'ferme.bio.tabarka@gmail.com'),
    ('sami.trabelsi.tn@gmail.com', 'faker.bennoomen@gmail.com'),
    ('sami.trabelsi.tn@gmail.com', 'fakerbennoomen@gmail.com'),
    ('sami.trabelsi.tn@gmail.com', 'karim.haddad.tn@gmail.com'),
    -- flux « pro »
    ('fakerbennoomen@gmail.com', 'faker.bennoomen@gmail.com'),
    ('fakerbennoomen@gmail.com', 'ferme.bio.tabarka@gmail.com'),
    ('fakerbennoomen@gmail.com', 'karim.haddad.tn@gmail.com'),
    ('faker.bennoomen@gmail.com', 'fakerbennoomen@gmail.com'),
    ('faker.bennoomen@gmail.com', 'ferme.bio.tabarka@gmail.com'),
    ('faker.bennoomen@gmail.com', 'karim.haddad.tn@gmail.com'),
    ('ferme.bio.tabarka@gmail.com', 'faker.bennoomen@gmail.com'),
    ('ferme.bio.tabarka@gmail.com', 'fakerbennoomen@gmail.com'),
    ('karim.haddad.tn@gmail.com', 'faker.bennoomen@gmail.com'),
    ('karim.haddad.tn@gmail.com', 'fakerbennoomen@gmail.com'),
    ('projet.ecovillage.kroumirie@gmail.com', 'faker.bennoomen@gmail.com'),
    ('projet.ecovillage.kroumirie@gmail.com', 'fakerbennoomen@gmail.com'),
    ('projet.ecovillage.kroumirie@gmail.com', 'ferme.bio.tabarka@gmail.com')
)
INSERT INTO follows (follower_id, follower_type, following_id, following_type, status)
SELECT uf.id, uf.role, ug.id, ug.role, 'accepted'
FROM pairs p
JOIN users uf ON uf.email = p.follower_email
JOIN users ug ON ug.email = p.following_email
WHERE NOT EXISTS (
  SELECT 1 FROM follows f
  WHERE f.follower_id = uf.id AND f.following_id = ug.id
);

-- 2) Amitiés acceptées (entre éco-voyageurs)
WITH pairs(a_email, b_email) AS (
  VALUES
    ('fakerben.noomen@gmail.com', 'lina.bouaziz.tn@gmail.com'),
    ('fakerben.noomen@gmail.com', 'sami.trabelsi.tn@gmail.com'),
    ('lina.bouaziz.tn@gmail.com', 'sami.trabelsi.tn@gmail.com')
)
INSERT INTO friendships (requester_id, receiver_id, status)
SELECT ua.id, ub.id, 'accepted'
FROM pairs p
JOIN users ua ON ua.email = p.a_email
JOIN users ub ON ub.email = p.b_email
WHERE NOT EXISTS (
  SELECT 1 FROM friendships f
  WHERE (f.requester_id = ua.id AND f.receiver_id = ub.id)
     OR (f.requester_id = ub.id AND f.receiver_id = ua.id)
);

SELECT 'follows' AS t, count(*) FROM follows
UNION ALL SELECT 'friendships', count(*) FROM friendships;

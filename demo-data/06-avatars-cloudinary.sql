-- 06-avatars-cloudinary.sql
--
-- Remplace les derniers visuels pointant vers images.unsplash.com par des
-- fichiers servis par notre compte Cloudinary. Les photos de profil sont des
-- avatars à initiales générés en local puis téléversés dans
-- eco-tourism/v2/avatars/ ; les couvertures reprennent des photos de paysages
-- tunisiens déjà présentes dans eco-tourism/v2/drive/.
--
-- Idempotent : les UPDATE ciblent les lignes par user_id et peuvent être
-- rejoués sans effet de bord.

BEGIN;

-- ── Photos de profil ─────────────────────────────────────────────────────────
UPDATE eco_travelers SET photo = 'https://res.cloudinary.com/depzhocsd/image/upload/v1794748854/eco-tourism/v2/avatars/sami-trabelsi.png'
 WHERE user_id = '22222222-2222-4222-8222-222222222222';
UPDATE eco_travelers SET photo = 'https://res.cloudinary.com/depzhocsd/image/upload/v1794748851/eco-tourism/v2/avatars/lina-bouaziz.png'
 WHERE user_id = '33333333-3333-4333-8333-333333333333';
UPDATE eco_travelers SET photo = 'https://res.cloudinary.com/depzhocsd/image/upload/v1794748846/eco-tourism/v2/avatars/amira-ben-salem.png'
 WHERE user_id = '7539d482-c74a-4785-ad58-61695209c2ff';

UPDATE guides SET photo = 'https://res.cloudinary.com/depzhocsd/image/upload/v1794748850/eco-tourism/v2/avatars/karim-haddad.png'
 WHERE user_id = '11111111-1111-4111-8111-111111111111';
UPDATE guides SET photo = 'https://res.cloudinary.com/depzhocsd/image/upload/v1794748855/eco-tourism/v2/avatars/youssef-mansouri.png'
 WHERE user_id = 'f36b7208-ddf5-4773-8e02-699dcf8ec3e7';

UPDATE providers SET photo = 'https://res.cloudinary.com/depzhocsd/image/upload/v1794748852/eco-tourism/v2/avatars/nadia-gharbi.png'
 WHERE user_id = '44444444-4444-4444-8444-444444444444';
UPDATE providers SET photo = 'https://res.cloudinary.com/depzhocsd/image/upload/v1794748847/eco-tourism/v2/avatars/faker-bennoomen.png'
 WHERE user_id = 'fb0ae1b6-9315-419e-9dd3-efda84838e61';

UPDATE project_owners SET photo = 'https://res.cloudinary.com/depzhocsd/image/upload/v1794748849/eco-tourism/v2/avatars/hedi-mansour.png'
 WHERE user_id = '55555555-5555-4555-8555-555555555555';

-- ── Couvertures de profil ────────────────────────────────────────────────────
UPDATE eco_travelers SET cover_photo = 'https://res.cloudinary.com/depzhocsd/image/upload/t_eco_1600/v1794745571/eco-tourism/v2/drive/douz/01-tunisia-10-12-086-douz-and-the-festival-of-the-sahara-660.jpg'
 WHERE user_id = '22222222-2222-4222-8222-222222222222';
UPDATE eco_travelers SET cover_photo = 'https://res.cloudinary.com/depzhocsd/image/upload/t_eco_1600/v1794744826/eco-tourism/v2/drive/mer-littoral/01-ciel-nuageux-avec-des-rayons-de-soleils-plage-de-rad-s.jpg'
 WHERE user_id = '33333333-3333-4333-8333-333333333333';
UPDATE eco_travelers SET cover_photo = 'https://res.cloudinary.com/depzhocsd/image/upload/t_eco_1600/v1794745319/eco-tourism/v2/drive/ain-draham/02-coucher-de-soleil-dans-une-foret-de-pin-et-de-chenes-ain-.jpg'
 WHERE user_id = '7539d482-c74a-4785-ad58-61695209c2ff';

UPDATE guides SET cover_photo = 'https://res.cloudinary.com/depzhocsd/image/upload/t_eco_1600/v1794744537/eco-tourism/v2/drive/ksar-ghilane/03-tents-at-ksar-ghilane-tunisia-june-2018.jpg'
 WHERE user_id = '11111111-1111-4111-8111-111111111111';
UPDATE guides SET cover_photo = 'https://res.cloudinary.com/depzhocsd/image/upload/t_eco_1600/v1794744556/eco-tourism/v2/drive/matmata/01-matmata-panorama.jpg'
 WHERE user_id = 'f36b7208-ddf5-4773-8e02-699dcf8ec3e7';

UPDATE providers SET cover_photo = 'https://res.cloudinary.com/depzhocsd/image/upload/t_eco_1600/v1794745058/eco-tourism/v2/drive/ain-draham/01-foret-de-pin-et-de-chenes-ain-draham.jpg'
 WHERE user_id = '44444444-4444-4444-8444-444444444444';
UPDATE providers SET cover_photo = 'https://res.cloudinary.com/depzhocsd/image/upload/t_eco_1600/v1794745926/eco-tourism/v2/drive/tozeur-chebika/04-chebika-tozeur-13.jpg'
 WHERE user_id = 'fb0ae1b6-9315-419e-9dd3-efda84838e61';

UPDATE project_owners SET cover_photo = 'https://res.cloudinary.com/depzhocsd/image/upload/t_eco_1600/v1794743397/eco-tourism/v2/drive/complement-nord/cap-bon-plages-et-peninsule/02-tunisia-cap-bon-13581659583.jpg'
 WHERE user_id = '55555555-5555-4555-8555-555555555555';

-- ── Galeries de profil (providers.photos, liste séparée par des virgules) ────
UPDATE providers SET photos = 'https://res.cloudinary.com/depzhocsd/image/upload/t_eco_1600/v1794745319/eco-tourism/v2/drive/ain-draham/02-coucher-de-soleil-dans-une-foret-de-pin-et-de-chenes-ain-.jpg,https://res.cloudinary.com/depzhocsd/image/upload/t_eco_1600/v1794745365/eco-tourism/v2/drive/ain-draham/03-tas-de-li-ge-ain-draham-devant-la-foret.jpg'
 WHERE user_id = '44444444-4444-4444-8444-444444444444';
UPDATE providers SET photos = 'https://res.cloudinary.com/depzhocsd/image/upload/t_eco_1600/v1794744335/eco-tourism/v2/drive/djerba/01-groupe-de-pecheur-djerba-tunisie.jpg,https://res.cloudinary.com/depzhocsd/image/upload/t_eco_1600/v1794745571/eco-tourism/v2/drive/douz/01-tunisia-10-12-086-douz-and-the-festival-of-the-sahara-660.jpg,https://res.cloudinary.com/depzhocsd/image/upload/t_eco_1600/v1794745926/eco-tourism/v2/drive/tozeur-chebika/04-chebika-tozeur-13.jpg'
 WHERE user_id = 'fb0ae1b6-9315-419e-9dd3-efda84838e61';

-- ── Photos ajoutées aux lieux (contributions) ────────────────────────────────
UPDATE place_contributions SET images = 'https://res.cloudinary.com/depzhocsd/image/upload/t_eco_1600/v1794743500/eco-tourism/v2/drive/complement-sud/bizerte-et-ghar-el-melh-lagune/01-lagune-de-gher-el-melh.jpg'
 WHERE id = '794ba8a3-c6f8-4475-abfb-9630752e83b3';
UPDATE place_contributions SET images = 'https://res.cloudinary.com/depzhocsd/image/upload/t_eco_1600/v1794745365/eco-tourism/v2/drive/ain-draham/03-tas-de-li-ge-ain-draham-devant-la-foret.jpg'
 WHERE id = 'fcc51854-402f-4c1a-97fa-b7cb393febad';

COMMIT;

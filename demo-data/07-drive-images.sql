-- 07-drive-images.sql
--
-- Rattache les 77 photos téléversées depuis le Drive (eco-tourism/v2/drive/…)
-- aux lieux correspondants : chaque dossier du Drive correspond à un lieu réel
-- (Chebika, Matmata, Douz, Ksar Ghilane, Ichkeul, Aïn Draham…), les photos sont
-- ajoutées en galerie après les visuels existants.
--
-- Idempotent : la clause WHERE évite d'ajouter deux fois la même série.

BEGIN;

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794745058/eco-tourism/v2/drive/ain-draham/01-foret-de-pin-et-de-chenes-ain-draham.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794745365/eco-tourism/v2/drive/ain-draham/03-tas-de-li-ge-ain-draham-devant-la-foret.jpg'
 WHERE id = '4320b6a8-ee9e-4d38-9439-d7a4f9871bc6' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794745058/eco-tourism/v2/drive/ain-draham/01-foret-de-pin-et-de-chenes-ain-draham.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794743366/eco-tourism/v2/drive/artisanat/03-poti-res-de-sejnane-au-saf-saf-la-marsa.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743500/eco-tourism/v2/drive/complement-sud/bizerte-et-ghar-el-melh-lagune/01-lagune-de-gher-el-melh.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743506/eco-tourism/v2/drive/complement-sud/bizerte-et-ghar-el-melh-lagune/02-lagune-de-gher-el-melh-2.jpg'
 WHERE id = 'bc9492b8-17e4-5215-86e5-02fbb73b09fc' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794743366/eco-tourism/v2/drive/artisanat/03-poti-res-de-sejnane-au-saf-saf-la-marsa.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794743513/eco-tourism/v2/drive/complement-sud/bizerte-et-ghar-el-melh-lagune/03-lagune-de-ghar-melh.jpg'
 WHERE id = 'c85d6a06-8a19-41b1-846b-3ed516ea7c3c' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794743513/eco-tourism/v2/drive/complement-sud/bizerte-et-ghar-el-melh-lagune/03-lagune-de-ghar-melh.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794745319/eco-tourism/v2/drive/ain-draham/02-coucher-de-soleil-dans-une-foret-de-pin-et-de-chenes-ain-.jpg'
 WHERE id = '3d010e04-64e8-5939-8f30-c2e06620dfdb' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794745319/eco-tourism/v2/drive/ain-draham/02-coucher-de-soleil-dans-une-foret-de-pin-et-de-chenes-ain-.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794743541/eco-tourism/v2/drive/complement-sud/chebika-oasis-de-montagne/01-chebika-oasis-tunisia-1.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743549/eco-tourism/v2/drive/complement-sud/chebika-oasis-de-montagne/02-oasis-chebika-tunisia-oct-2010-panoramio.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743574/eco-tourism/v2/drive/complement-sud/chebika-oasis-de-montagne/03-2025-04-01-chebika-oasis-tozeur-tunisia.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794745926/eco-tourism/v2/drive/tozeur-chebika/04-chebika-tozeur-13.jpg'
 WHERE id = '15c3e39a-892b-58d6-a7da-43acd69cc1f1' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794743541/eco-tourism/v2/drive/complement-sud/chebika-oasis-de-montagne/01-chebika-oasis-tunisia-1.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794743586/eco-tourism/v2/drive/complement-sud/chenini-villages-du-dahar/01-ksar-chenini-vue-6.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743595/eco-tourism/v2/drive/complement-sud/chenini-villages-du-dahar/02-vue-panoramique-du-village-berb-re-de-chenini-tataouine-t.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743604/eco-tourism/v2/drive/complement-sud/chenini-villages-du-dahar/03-chenini-8567.jpg'
 WHERE id = '6b1109a1-9c43-5c31-b7fc-38c4997441b9' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794743586/eco-tourism/v2/drive/complement-sud/chenini-villages-du-dahar/01-ksar-chenini-vue-6.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794744139/eco-tourism/v2/drive/complement-sud/nefta-corbeille-et-oasis/03-immensityoasisnefta.jpg'
 WHERE id = '6d7d7605-9497-5b47-a1ed-9a0c4dbb992a' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794744139/eco-tourism/v2/drive/complement-sud/nefta-corbeille-et-oasis/03-immensityoasisnefta.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794743636/eco-tourism/v2/drive/complement-sud/douz-sahara-et-dunes/01-tunisia-10-12-121-douz-sahara-trek-6609312913.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743652/eco-tourism/v2/drive/complement-sud/douz-sahara-et-dunes/02-tunisia-3658-here-come-the-rides-7847620450.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743664/eco-tourism/v2/drive/complement-sud/douz-sahara-et-dunes/03-le-d-sert-de-douz.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794745571/eco-tourism/v2/drive/douz/01-tunisia-10-12-086-douz-and-the-festival-of-the-sahara-660.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794745604/eco-tourism/v2/drive/douz/02-tunisia-10-12-079-douz-and-the-festival-of-the-sahara-660.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794745634/eco-tourism/v2/drive/douz/03-tunisia-10-12-077-douz-and-the-festival-of-the-sahara-660.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794745648/eco-tourism/v2/drive/douz/04-tunisia-10-12-097-douz-sahara-trek-6609308033.jpg'
 WHERE id = '3bc53342-0d24-5696-91bb-6ab78b504319' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794743636/eco-tourism/v2/drive/complement-sud/douz-sahara-et-dunes/01-tunisia-10-12-121-douz-sahara-trek-6609312913.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794745531/eco-tourism/v2/drive/ain-draham/04-troupeau-de-mouton-foret-ain-draham.jpg'
 WHERE id = 'e49a9cf3-8e49-5764-82dd-c446511af138' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794745531/eco-tourism/v2/drive/ain-draham/04-troupeau-de-mouton-foret-ain-draham.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794743608/eco-tourism/v2/drive/complement-sud/djerba-lagune-et-ras-rmel/01-djerba-ras-rmel-19.jpg'
 WHERE id = '55ec83ca-550c-5ed6-89af-5f3467c7e222' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794743608/eco-tourism/v2/drive/complement-sud/djerba-lagune-et-ras-rmel/01-djerba-ras-rmel-19.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794743682/eco-tourism/v2/drive/complement-sud/gabes-oasis-maritime/01-gabes-oasis-de-lemdoun.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743688/eco-tourism/v2/drive/complement-sud/gabes-oasis-maritime/02-palmier-pour-le-legmi-oasis-gab-s.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743701/eco-tourism/v2/drive/complement-sud/gabes-oasis-maritime/03-parmerardegabes.jpg'
 WHERE id = '5365909a-d689-529e-981e-77d749165ea4' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794743682/eco-tourism/v2/drive/complement-sud/gabes-oasis-maritime/01-gabes-oasis-de-lemdoun.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794743620/eco-tourism/v2/drive/complement-sud/djerba-lagune-et-ras-rmel/02-djerba-ras-rmel-01.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744335/eco-tourism/v2/drive/djerba/01-groupe-de-pecheur-djerba-tunisie.jpg'
 WHERE id = 'fd55c368-9542-5b35-8fd8-12e43679186d' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794743620/eco-tourism/v2/drive/complement-sud/djerba-lagune-et-ras-rmel/02-djerba-ras-rmel-01.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794743380/eco-tourism/v2/drive/complement-nord/cap-bon-plages-et-peninsule/01-the-cap-bon-tunisia-cost.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743426/eco-tourism/v2/drive/complement-nord/cap-bon-plages-et-peninsule/03-tunisia-cap-bon-13581692993.jpg'
 WHERE id = 'dab855b2-a069-50f8-83f6-5a363f956582' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794743380/eco-tourism/v2/drive/complement-nord/cap-bon-plages-et-peninsule/01-the-cap-bon-tunisia-cost.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794743307/eco-tourism/v2/drive/artisanat/01-traditional-weaving-workshops-in-houmt-souk-djerba.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743626/eco-tourism/v2/drive/complement-sud/djerba-lagune-et-ras-rmel/03-djerba-ras-rmel-23.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744361/eco-tourism/v2/drive/djerba/02-groupe-de-pecheur-en-fin-de-journ-e-djerba-tunisie.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744433/eco-tourism/v2/drive/djerba/04-barque-de-pecheur-djerba.jpg'
 WHERE id = '7158a295-d575-5d80-9aef-d26eda71c958' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794743307/eco-tourism/v2/drive/artisanat/01-traditional-weaving-workshops-in-houmt-souk-djerba.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794743479/eco-tourism/v2/drive/complement-nord/parc-national-de-l-ichkeul/01-capparis-spinosa-ichkeul-national-parc.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743487/eco-tourism/v2/drive/complement-nord/parc-national-de-l-ichkeul/02-bluethroat-luscinia-svecica-at-ichkeul-np.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743495/eco-tourism/v2/drive/complement-nord/parc-national-de-l-ichkeul/03-european-bee-eater-merops-apiaster-at-ichkeul-np.jpg'
 WHERE id = '24467bcf-1c35-5e56-8b79-e24d297003ac' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794743479/eco-tourism/v2/drive/complement-nord/parc-national-de-l-ichkeul/01-capparis-spinosa-ichkeul-national-parc.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794743734/eco-tourism/v2/drive/complement-sud/ksar-ghilane-oasis-et-bivouac/01-castellum-tisavar-ksar-rhilane-ksar-ghilane-tunisia.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743761/eco-tourism/v2/drive/complement-sud/ksar-ghilane-oasis-et-bivouac/02-ksar-ghilane-4103846788.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743789/eco-tourism/v2/drive/complement-sud/ksar-ghilane-oasis-et-bivouac/03-oase-ksar-ghilane-schafe.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744478/eco-tourism/v2/drive/ksar-ghilane/01-ksar-ghilane-tunisia-unsplash.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744513/eco-tourism/v2/drive/ksar-ghilane/02-stele-of-the-column-of-general-leclerc-ksar-ghilane-01.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744537/eco-tourism/v2/drive/ksar-ghilane/03-tents-at-ksar-ghilane-tunisia-june-2018.jpg'
 WHERE id = '23e6a4bf-6010-5559-8e16-966f5e1853be' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794743734/eco-tourism/v2/drive/complement-sud/ksar-ghilane-oasis-et-bivouac/01-castellum-tisavar-ksar-rhilane-ksar-ghilane-tunisia.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794743444/eco-tourism/v2/drive/complement-nord/jebel-chambi-montagne-et-parc/01-storm-over-mountain-chaambi-2.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743469/eco-tourism/v2/drive/complement-nord/jebel-chambi-montagne-et-parc/03-storm-over-mountain-chaambi.jpg'
 WHERE id = '2bf041d0-f98f-5744-b958-c76e1b30725b' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794743444/eco-tourism/v2/drive/complement-nord/jebel-chambi-montagne-et-parc/01-storm-over-mountain-chaambi-2.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794743865/eco-tourism/v2/drive/complement-sud/matmata-maisons-troglodytes/01-matmata-house.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743874/eco-tourism/v2/drive/complement-sud/matmata-maisons-troglodytes/02-matmata-berber-kitchen.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743882/eco-tourism/v2/drive/complement-sud/matmata-maisons-troglodytes/03-matmata-berber-room.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744556/eco-tourism/v2/drive/matmata/01-matmata-panorama.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744644/eco-tourism/v2/drive/matmata/02-a-cooking-corner-in-a-matmata-troglodyte-house.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744741/eco-tourism/v2/drive/matmata/03-matmata-1988.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744809/eco-tourism/v2/drive/matmata/04-tunisia-3513-entering-matmata-7847461488.jpg'
 WHERE id = 'f3c24d3d-7e1e-5de1-ad3a-9e63337f0388' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794743865/eco-tourism/v2/drive/complement-sud/matmata-maisons-troglodytes/01-matmata-house.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794743328/eco-tourism/v2/drive/artisanat/02-tunisian-crafts.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743397/eco-tourism/v2/drive/complement-nord/cap-bon-plages-et-peninsule/02-tunisia-cap-bon-13581659583.jpg'
 WHERE id = 'f6d2830b-d4c9-5925-9101-c99ed290337e' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794743328/eco-tourism/v2/drive/artisanat/02-tunisian-crafts.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794744826/eco-tourism/v2/drive/mer-littoral/01-ciel-nuageux-avec-des-rayons-de-soleils-plage-de-rad-s.jpg'
 WHERE id = '55a1fb0c-7616-5ce4-8201-0482a0299bec' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794744826/eco-tourism/v2/drive/mer-littoral/01-ciel-nuageux-avec-des-rayons-de-soleils-plage-de-rad-s.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794744158/eco-tourism/v2/drive/complement-sud/tabarka-littoral-et-aiguilles/01-les-aiguilles-de-tabarka.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744169/eco-tourism/v2/drive/complement-sud/tabarka-littoral-et-aiguilles/02-tabarka-les-aiguilles.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744193/eco-tourism/v2/drive/complement-sud/tabarka-littoral-et-aiguilles/03-tabarka-coast-tunisia.jpg'
 WHERE id = '6c5a5dca-c1d1-5665-ac6a-ec714957e6b0' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794744158/eco-tourism/v2/drive/complement-sud/tabarka-littoral-et-aiguilles/01-les-aiguilles-de-tabarka.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794743936/eco-tourism/v2/drive/complement-sud/mides-canyon/01-mid-oasis-and-cliffs-at-mides-canyon-tunisia-2023.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794743995/eco-tourism/v2/drive/complement-sud/mides-canyon/02-mid-layered-cliffs-of-mides-canyon-tunisia-2023.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744038/eco-tourism/v2/drive/complement-sud/mides-canyon/03-mides-canyon-mides-tunisia-04.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744225/eco-tourism/v2/drive/complement-sud/tamerza-cascades-et-canyon/01-tunisia-4040-panorama-canyon-7849958616.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744236/eco-tourism/v2/drive/complement-sud/tamerza-cascades-et-canyon/02-la-grande-cascade-de-tamerza-en-tunisie-20220323-134639.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744252/eco-tourism/v2/drive/complement-sud/tamerza-cascades-et-canyon/03-canyon-dor-de-tamaghza-01.jpg'
 WHERE id = '2b1a9eda-7930-5d98-a939-36ac13ca7378' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794743936/eco-tourism/v2/drive/complement-sud/mides-canyon/01-mid-oasis-and-cliffs-at-mides-canyon-tunisia-2023.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794744064/eco-tourism/v2/drive/complement-sud/nefta-corbeille-et-oasis/01-oasis-nefta-2.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744113/eco-tourism/v2/drive/complement-sud/nefta-corbeille-et-oasis/02-oasis-nefta.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744266/eco-tourism/v2/drive/complement-sud/tozeur-palmeraie/01-une-grappe-de-datte-avant-la-r-colte-palmeraie-de-tozeur-.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744287/eco-tourism/v2/drive/complement-sud/tozeur-palmeraie/02-tozeur-oasis-at-sunset.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744315/eco-tourism/v2/drive/complement-sud/tozeur-palmeraie/03-bled-el-hadhar-valley-in-tozeur-tunisia-djerid-oasis.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794745767/eco-tourism/v2/drive/tozeur-chebika/02-zaouia-al-ismailia-tozeur-tunisia-04.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794745892/eco-tourism/v2/drive/tozeur-chebika/03-zaouia-al-ismailia-tozeur-tunisia-05.jpg'
 WHERE id = 'a1a489e1-2938-561e-afc3-195c5d3d3383' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794744064/eco-tourism/v2/drive/complement-sud/nefta-corbeille-et-oasis/01-oasis-nefta-2.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794743456/eco-tourism/v2/drive/complement-nord/jebel-chambi-montagne-et-parc/02-cloudy-day-over-mountain-chaambi.jpg'
 WHERE id = '6673c29c-9d39-549f-951c-aae0b99b0290' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794743456/eco-tourism/v2/drive/complement-nord/jebel-chambi-montagne-et-parc/02-cloudy-day-over-mountain-chaambi.jpg%';

UPDATE publications
   SET images = images || ',' || 'https://res.cloudinary.com/depzhocsd/image/upload/v1794744394/eco-tourism/v2/drive/djerba/03-barques-de-pecheur-djerba.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744867/eco-tourism/v2/drive/mer-littoral/02-djerba-south-coast-2.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744925/eco-tourism/v2/drive/mer-littoral/03-djerba-south-coast-3.jpg,https://res.cloudinary.com/depzhocsd/image/upload/v1794744956/eco-tourism/v2/drive/mer-littoral/04-djerba-south-coast-1.jpg'
 WHERE id = '575ddae3-685d-5215-8977-cd8643a43b80' AND images NOT LIKE '%https://res.cloudinary.com/depzhocsd/image/upload/v1794744394/eco-tourism/v2/drive/djerba/03-barques-de-pecheur-djerba.jpg%';
-- Dédoublonnage : deux lieux avaient la même photo deux fois dans leur galerie
-- (Tozeur, Tabarka) ; on ne garde que la première occurrence, en conservant l'ordre.
UPDATE publications p
   SET images = (
         SELECT string_agg(u, ',' ORDER BY premier)
           FROM (SELECT u, MIN(ord) AS premier
                   FROM unnest(string_to_array(p.images, ',')) WITH ORDINALITY AS t(u, ord)
                  GROUP BY u) s)
 WHERE p.type = 'place'
   AND array_length(string_to_array(p.images, ','), 1)
       <> array_length(array(SELECT DISTINCT unnest(string_to_array(p.images, ','))), 1);

COMMIT;

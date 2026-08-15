import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Property from '../models/Property.js';
import bcrypt from 'bcryptjs';

dotenv.config();

// KUMPULAN GAMBAR REAL DARI UNSPLASH
const getImagesByType = (type, index) => {
  const imageSets = {
    rumah: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=500&fit=crop&crop=center',
      'https://media.istockphoto.com/id/2155879454/id/foto/ini-adalah-foto-eksterior-rumah-yang-dijual-di-beverly-hills-ca.jpg?s=1024x1024&w=is&k=20&c=bEepHYM_8gs9RKNp0pSuP6IlF7VcsGL42oZRSJ0l-HI=',
      'https://media.istockphoto.com/id/2155899949/id/foto/kolam-besar-di-depan-sebuah-rumah-putih-di-encino-california.jpg?s=1024x1024&w=is&k=20&c=FOz_9ImlXuIx3NAtmOgPk-G_pp_VsWJMIk95af0WUZI=',
      'https://media.istockphoto.com/id/147205632/id/foto/modern-home-with-swimming-pool.jpg?s=1024x1024&w=is&k=20&c=09JvCHBoAsJenCGiBgiJf1QQVOFCrkAsa3pZkwlav2k=',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop&crop=center',
    ],
    apartemen: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop&crop=center',
    ],
    villa: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=500&fit=crop&crop=center',
    ],
    tanah: [
      'https://media.istockphoto.com/id/1442038572/id/foto/kavling-tanah-untuk-bangunan-rumah-pemandangan-udara-bidang-tanah-dengan-pin-lokasi-pin-untuk.jpg?s=612x612&w=0&k=20&c=t_QSLcKQAggYAJz-QTMV7gHeqR0oqqGinyRS73FjWS0=',
      'https://media.istockphoto.com/id/1321283567/id/foto/plot-tanah-dalam-tampilan-udara.jpg?s=612x612&w=0&k=20&c=Aj5K6ZD213jGTBjV9lzrTL3JrqogmKxgXkEEGeup0E8=',
      'https://media.istockphoto.com/id/1434957137/id/foto/manajemen-plot-tanah-konsep-real-estat-dengan-tanah-kosong-dan-paket-kadaster-tersedia-untuk.jpg?s=612x612&w=0&k=20&c=W4F5NM7RH3EqzrB8mpvZZHwGx9LxQyDcAmOVZUj07Fg=',
      'https://media.istockphoto.com/id/1323817635/id/foto/plot-tanah-dalam-tampilan-udara.jpg?s=612x612&w=0&k=20&c=B-cBNR0-71fECwkIBGrJexI_Z8sElb3jLridKLoVceU=',
      'https://media.istockphoto.com/id/1316128398/id/foto/plot-tanah-dalam-pandangan-udara-untuk-pengembangan-atau-investasi.jpg?s=612x612&w=0&k=20&c=SnQpLup2s8aigzI0JuqudZAZ0mjsg708EURKu0GzJII=',
      'https://media.istockphoto.com/id/1316966020/id/foto/plot-tanah-dalam-pandangan-udara-untuk-pengembangan-atau-investasi.jpg?s=612x612&w=0&k=20&c=eDJqaDn1rKS5JceVQKfG0BwlpY4epQqVQUPfmBmvexI=',
    ],
    ruko: [
      'https://media.istockphoto.com/id/2281448941/id/foto/ruko-komersial-yang-baru-selesai.jpg?s=1024x1024&w=is&k=20&c=E_FAiZgr-qFW7ppFZtMYH7ImGlVlQ7w9VV2c7VOeZTA=',
      'https://media.istockphoto.com/id/1484419810/id/foto/tampak-depan-low-angle-dari-jendela-kaca-eksterior-bangunan-di-gresik-jawa-timur-indonesia.jpg?s=1024x1024&w=is&k=20&c=I3Y64gxWZHSGEArVQN30eBhPG-2KraMu6KQSJucA51Q=',
      'https://media.istockphoto.com/id/2216497480/id/foto/ruko-dan-perumahan-cluster.jpg?s=1024x1024&w=is&k=20&c=gSUZe8ZEzv9xPDXgtm0Z415VX0-MtXsejF96srpSJto=',
      'https://media.istockphoto.com/id/2216497517/id/foto/ruko-dan-perumahan-cluster.jpg?s=1024x1024&w=is&k=20&c=BfjNMNzudGwnFDqmA3mXndPJsnLRR1cOYAleIFDSYaA=',
      'https://media.istockphoto.com/id/2161335402/id/foto/bangunan-toko.jpg?s=1024x1024&w=is&k=20&c=6m5hCX8W5wu9KdMDIZV4nOR6yMid83TbFmliCcutu4E=',
    ],
  };

  const images = imageSets[type] || imageSets.rumah;
  return [
    images[index % images.length],
    images[(index + 1) % images.length],
    images[(index + 2) % images.length],
  ];
};

// ALAMAT
const realAddresses = {
  rumah: [
    { address: 'Jl. Brawijaya No. 45, Kebayoran Baru', city: 'Jakarta Selatan', province: 'DKI Jakarta' },
    { address: 'Jl. Cipete Raya No. 12, Cipete', city: 'Jakarta Selatan', province: 'DKI Jakarta' },
    { address: 'Jl. Senopati No. 78, Senayan', city: 'Jakarta Pusat', province: 'DKI Jakarta' },
    { address: 'Jl. Gunawarman No. 34, Kebayoran Baru', city: 'Jakarta Selatan', province: 'DKI Jakarta' },
    { address: 'Jl. Wijaya No. 56, Kebayoran Baru', city: 'Jakarta Selatan', province: 'DKI Jakarta' },
    { address: 'Jl. Dago Atas No. 123, Dago', city: 'Bandung', province: 'Jawa Barat' },
    { address: 'Jl. Setiabudhi No. 89, Setiabudhi', city: 'Bandung', province: 'Jawa Barat' },
    { address: 'Jl. Raya Puncak No. 45, Cisarua', city: 'Bogor', province: 'Jawa Barat' },
    { address: 'Jl. Raya Ubud No. 67, Ubud', city: 'Gianyar', province: 'Bali' },
    { address: 'Jl. Pantai Kuta No. 34, Kuta', city: 'Badung', province: 'Bali' },
  ],
  apartemen: [
    { address: 'Jl. Gatot Subroto Kav. 56, Kuningan', city: 'Jakarta Selatan', province: 'DKI Jakarta' },
    { address: 'Jl. MH Thamrin No. 12, Thamrin', city: 'Jakarta Pusat', province: 'DKI Jakarta' },
    { address: 'Jl. Rasuna Said No. 34, Kuningan', city: 'Jakarta Selatan', province: 'DKI Jakarta' },
    { address: 'Jl. Sudirman No. 78, Senayan', city: 'Jakarta Pusat', province: 'DKI Jakarta' },
    { address: 'Jl. HR Rasuna Said No. 23, Kuningan', city: 'Jakarta Selatan', province: 'DKI Jakarta' },
    { address: 'Jl. Braga No. 45, Braga', city: 'Bandung', province: 'Jawa Barat' },
    { address: 'Jl. Tunjungan No. 67, Tunjungan', city: 'Surabaya', province: 'Jawa Timur' },
    { address: 'Jl. Malioboro No. 89, Malioboro', city: 'Yogyakarta', province: 'DI Yogyakarta' },
    { address: 'Jl. Legian No. 56, Legian', city: 'Badung', province: 'Bali' },
    { address: 'Jl. Bukit Indah No. 12, Bukit', city: 'Badung', province: 'Bali' },
  ],
  villa: [
    { address: 'Jl. Raya Uluwatu No. 45, Pecatu', city: 'Badung', province: 'Bali' },
    { address: 'Jl. Tanah Lot No. 78, Tabanan', city: 'Tabanan', province: 'Bali' },
    { address: 'Jl. Raya Lembang No. 234, Lembang', city: 'Bandung Barat', province: 'Jawa Barat' },
    { address: 'Jl. Raya Puncak No. 789, Cisarua', city: 'Bogor', province: 'Jawa Barat' },
    { address: 'Jl. Kaliurang No. 456, Kaliurang', city: 'Sleman', province: 'DI Yogyakarta' },
    { address: 'Jl. Raya Ciawi No. 123, Ciawi', city: 'Bogor', province: 'Jawa Barat' },
    { address: 'Jl. Sunset Road No. 234, Kuta', city: 'Badung', province: 'Bali' },
    { address: 'Jl. Raya Jimbaran No. 567, Jimbaran', city: 'Badung', province: 'Bali' },
    { address: 'Jl. Raya Batu No. 89, Batu', city: 'Malang', province: 'Jawa Timur' },
    { address: 'Jl. Raya Anyer No. 45, Anyer', city: 'Serang', province: 'Banten' },
  ],
  tanah: [
    { address: 'Jl. Raya Cikarang No. 123, Cikarang', city: 'Bekasi', province: 'Jawa Barat' },
    { address: 'Jl. Raya Karawang No. 456, Karawang', city: 'Karawang', province: 'Jawa Barat' },
    { address: 'Jl. Raya Tangerang No. 789, Tangerang', city: 'Tangerang', province: 'Banten' },
    { address: 'Jl. Raya Bogor No. 234, Bogor', city: 'Bogor', province: 'Jawa Barat' },
    { address: 'Jl. Raya BSD No. 567, Serpong', city: 'Tangerang Selatan', province: 'Banten' },
    { address: 'Jl. Raya Cibubur No. 89, Cibubur', city: 'Jakarta Timur', province: 'DKI Jakarta' },
    { address: 'Jl. Raya Depok No. 123, Depok', city: 'Depok', province: 'Jawa Barat' },
    { address: 'Jl. Raya Bekasi No. 456, Bekasi', city: 'Bekasi', province: 'Jawa Barat' },
    { address: 'Jl. Raya Pantai Indah Kapuk No. 78, PIK', city: 'Jakarta Utara', province: 'DKI Jakarta' },
    { address: 'Jl. Raya Alam Sutera No. 90, Alam Sutera', city: 'Tangerang', province: 'Banten' },
  ],
  ruko: [
    { address: 'Jl. Raya Margonda No. 123, Depok', city: 'Depok', province: 'Jawa Barat' },
    { address: 'Jl. Raya Boulevard No. 456, Kelapa Gading', city: 'Jakarta Utara', province: 'DKI Jakarta' },
    { address: 'Jl. Raya Pajajaran No. 789, Bogor', city: 'Bogor', province: 'Jawa Barat' },
    { address: 'Jl. Raya Ahmad Yani No. 234, Bandung', city: 'Bandung', province: 'Jawa Barat' },
    { address: 'Jl. Raya Diponegoro No. 567, Surabaya', city: 'Surabaya', province: 'Jawa Timur' },
    { address: 'Jl. Raya Solo No. 89, Solo', city: 'Surakarta', province: 'Jawa Tengah' },
    { address: 'Jl. Raya Gajah Mada No. 123, Jakarta', city: 'Jakarta Pusat', province: 'DKI Jakarta' },
    { address: 'Jl. Raya Hayam Wuruk No. 456, Jakarta', city: 'Jakarta Pusat', province: 'DKI Jakarta' },
    { address: 'Jl. Raya Kuta No. 78, Kuta', city: 'Badung', province: 'Bali' },
    { address: 'Jl. Raya Cikini No. 90, Cikini', city: 'Jakarta Pusat', province: 'DKI Jakarta' },
  ],
};

// NAMA AGENT
const agentNames = [
  { name: 'Budi Santoso', phone: '0812-3456-7890', email: 'budi.santoso@realestate.com' },
  { name: 'Dewi Lestari', phone: '0813-5678-9012', email: 'dewi.lestari@realestate.com' },
  { name: 'Ahmad Hidayat', phone: '0815-6789-0123', email: 'ahmad.hidayat@realestate.com' },
  { name: 'Siti Rahayu', phone: '0816-7890-1234', email: 'siti.rahayu@realestate.com' },
  { name: 'Rizky Pratama', phone: '0817-8901-2345', email: 'rizky.pratama@realestate.com' },
  { name: 'Nina Marlina', phone: '0818-9012-3456', email: 'nina.marlina@realestate.com' },
  { name: 'Andi Wijaya', phone: '0819-0123-4567', email: 'andi.wijaya@realestate.com' },
  { name: 'Rina Wati', phone: '0821-1234-5678', email: 'rina.wati@realestate.com' },
  { name: 'Doni Saputra', phone: '0822-2345-6789', email: 'doni.saputra@realestate.com' },
  { name: 'Maya Anggraini', phone: '0823-3456-7890', email: 'maya.anggraini@realestate.com' },
];

// TITLE PROPERTI
const realTitles = {
  rumah: [
    'Rumah Mewah 2 Lantai di Kebayoran Baru',
    'Rumah Minimalis Modern di Senopati',
    'Rumah Keluarga di Brawijaya',
    'Rumah Cantik dengan Taman di Cipete',
    'Rumah Eksklusif di Gunawarman',
    'Rumah Bergaya Tropis di Dago',
    'Rumah Mediterania di Setiabudhi',
    'Rumah dengan Kolam Renang di Puncak',
    'Rumah Impian di Ubud',
    'Rumah Pantai di Kuta',
  ],
  apartemen: [
    'Apartemen Studio di Kuningan',
    'Apartemen 2 Kamar di Thamrin',
    'Apartemen Mewah di Rasuna Said',
    'Apartemen City View di Sudirman',
    'Apartemen Premium di HR Rasuna Said',
    'Apartemen Braga City View',
    'Apartemen Tunjungan Surabaya',
    'Apartemen Malioboro Yogyakarta',
    'Apartemen Legian Bali',
    'Apartemen Bukit Indah',
  ],
  villa: [
    'Villa Mewah dengan Pantai di Uluwatu',
    'Villa Resort di Tanah Lot',
    'Villa Eksklusif di Lembang',
    'Villa Puncak dengan Pemandangan',
    'Villa Kaliurang Yogyakarta',
    'Villa Ciawi Bogor',
    'Villa Sunset Road Bali',
    'Villa Jimbaran dengan Kolam Renang',
    'Villa Batu Malang',
    'Villa Anyer Banten',
  ],
  tanah: [
    'Tanah Kavling Cikarang Strategis',
    'Tanah Industri di Karawang',
    'Tanah Perumahan Tangerang',
    'Tanah Pertanian Bogor',
    'Tanah BSD Serpong',
    'Tanah Cibubur Jakarta',
    'Tanah Depok Strategis',
    'Tanah Bekasi',
    'Tanah PIK Jakarta',
    'Tanah Alam Sutera',
  ],
  ruko: [
    'Ruko 3 Lantai di Margonda Depok',
    'Ruko Strategis di Kelapa Gading',
    'Ruko Pajajaran Bogor',
    'Ruko Ahmad Yani Bandung',
    'Ruko Diponegoro Surabaya',
    'Ruko Solo Jawa Tengah',
    'Ruko Gajah Mada Jakarta',
    'Ruko Hayam Wuruk Jakarta',
    'Ruko Kuta Bali',
    'Ruko Cikini Jakarta',
  ],
};

// FACILITIES REALISTIC
const allFacilities = [
  'AC Central', 'Split AC', 'Kolam Renang', 'Garasi 2 Mobil', 'Garasi 1 Mobil',
  'Taman Depan', 'Taman Belakang', 'Keamanan 24 Jam', 'CCTV', 'Parkir Luas',
  'Furnished', 'Dapur Modern', 'Ruang Keluarga', 'Ruang Makan', 'Ruang Tamu',
  'Kamar Pembantu', 'Dapur', 'Kulkas', 'TV', 'Internet', 'Air Panas', 'Water Heater',
  'Lift', 'Gym', 'Sauna', 'Pemandangan', 'Balkon', 'Halaman Luas'
];

// SEED DATABASE
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // CREATE AGENTS (MULTIPLE AGENTS)
    const agents = [];
    for (let i = 0; i < 5; i++) {
      const agentData = agentNames[i % agentNames.length];
      const password = await bcrypt.hash('password123', 10);
      const agent = await User.create({
        name: agentData.name,
        email: agentData.email,
        password: password,
        role: 'agent',
        phone: agentData.phone,
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(agentData.name)}&size=128&background=D4AF37&color=fff`,
        isVerified: true,
      });
      agents.push(agent);
      console.log(`✅ Agent ${i + 1}: ${agentData.name} created`);
    }

    // CREATE ADMIN & USER
    const adminPassword = await bcrypt.hash('password123', 10);
    await User.create({
      name: 'Super Admin',
      email: 'admin@realestate.com',
      password: adminPassword,
      role: 'admin',
      phone: '0812-8888-9999',
      profileImage: 'https://ui-avatars.com/api/?name=Super+Admin&size=128&background=1A2A3A&color=fff',
      isVerified: true,
    });
    console.log('✅ Admin created');

    const userPassword = await bcrypt.hash('password123', 10);
    await User.create({
      name: 'John Doe',
      email: 'user@realestate.com',
      password: userPassword,
      role: 'user',
      phone: '0812-7777-8888',
      profileImage: 'https://ui-avatars.com/api/?name=John+Doe&size=128&background=6B7280&color=fff',
      isVerified: true,
    });
    console.log('✅ User created');

    // ==========================================
    // CREATE PROPERTIES WITH REAL DATA
    // ==========================================
    const statuses = ['jual', 'sewa'];
    const properties = [];
    const totalProperties = 30;

    for (let i = 0; i < totalProperties; i++) {
      const type = Object.keys(realTitles)[Math.floor(Math.random() * Object.keys(realTitles).length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const addressData = realAddresses[type][i % realAddresses[type].length];
      const titleList = realTitles[type];
      const agent = agents[i % agents.length];
      
      const bedrooms = Math.floor(Math.random() * 4) + 1;
      const bathrooms = Math.floor(Math.random() * 3) + 1;
      const landSize = Math.floor(Math.random() * 500) + 100;
      const buildingSize = Math.floor(Math.random() * 400) + 50;
      
      // Harga realistis
      let price;
      if (status === 'jual') {
        price = Math.floor(Math.random() * 2000000000) + 800000000;
      } else {
        price = Math.floor(Math.random() * 25000000) + 8000000;
      }

      // Pilih 3-6 facilities random
      const shuffled = [...allFacilities].sort(() => 0.5 - Math.random());
      const selectedFacilities = shuffled.slice(0, Math.floor(Math.random() * 4) + 3);

      const property = {
        title: titleList[i % titleList.length],
        description: `Properti ${type} yang nyaman dan strategis. ${type === 'rumah' ? 'Cocok untuk keluarga dengan desain modern' : type === 'apartemen' ? 'Dengan pemandangan kota yang indah' : type === 'villa' ? 'Sempurna untuk liburan atau investasi' : type === 'tanah' ? 'Lokasi strategis dengan akses mudah' : 'Sangat cocok untuk bisnis dan usaha'}. Dilengkapi dengan fasilitas: ${selectedFacilities.slice(0, 4).join(', ')}. ${status === 'jual' ? 'Harga jual kompetitif' : 'Harga sewa terjangkau'} dengan lokasi ${addressData.city} yang sangat strategis.`,
        type,
        status,
        price,
        pricePerMeter: status === 'jual' ? Math.floor(price / landSize) : Math.floor(price / buildingSize),
        location: {
          address: addressData.address,
          city: addressData.city,
          province: addressData.province,
          postalCode: `${Math.floor(Math.random() * 10000) + 10000}`,
          coordinates: {
            type: 'Point',
            coordinates: [
              // Longitude: sekitar Indonesia (95-141)
              106.8 + (Math.random() * 0.5),
              // Latitude: sekitar Indonesia (-6 hingga -10)
              -6.2 + (Math.random() * 0.5)
            ],
          },
        },
        specifications: {
          landSize,
          buildingSize,
          bedrooms,
          bathrooms,
          yearBuilt: 1995 + Math.floor(Math.random() * 28),
          certificateType: ['SHM', 'SHGB', 'HGB', 'Hak Pakai'][Math.floor(Math.random() * 4)],
          condition: ['Baru', 'Bekas', 'Renovasi'][Math.floor(Math.random() * 3)],
          facing: ['Utara', 'Selatan', 'Timur', 'Barat', 'Timur Laut', 'Tenggara'][Math.floor(Math.random() * 6)],
        },
        facilities: selectedFacilities,
        images: getImagesByType(type, i),
        featured: Math.random() > 0.7,
        isNew: Math.random() > 0.6,
        isHotDeal: Math.random() > 0.85,
        views: Math.floor(Math.random() * 1500) + 100,
        agentId: agent._id,
        rating: Number((3 + Math.random() * 2).toFixed(1)),
        totalReviews: Math.floor(Math.random() * 50) + 1,
        // statusProperty: ['tersedia', 'tersedia', 'tersedia', 'tersedia', 'terjual', 'disewa'][Math.floor(Math.random() * 6)],
      };

      properties.push(property);
    }

    await Property.insertMany(properties);
    console.log(`✅ Seeded ${properties.length} properties with REALISTIC data`);
    console.log(`   - ${properties.filter(p => p.status === 'jual').length} properties for sale`);
    console.log(`   - ${properties.filter(p => p.status === 'sewa').length} properties for rent`);

    // ==========================================
    // 📋  SUMMARY
    // ==========================================
    console.log('\n📋 ===== SEED COMPLETE =====');
    console.log('👤 Users:');
    console.log('  - 5 Agents dengan nama real');
    console.log('  - Admin:   admin@realestate.com / password123');
    console.log('  - User:    user@realestate.com / password123');
    console.log(`🏠 Properties: ${properties.length} properti dengan data realistis`);
    console.log('📍 Alamat: Jalan, Kota, Provinsi real');
    console.log('👤 Nama Agent: Nama real Indonesia');
    console.log('📞 No HP: Format Indonesia');
    console.log('🏷️  Title: Deskripsi properti real');
    console.log('==============================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
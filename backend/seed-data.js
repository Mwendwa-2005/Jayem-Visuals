const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'portfolio.db'));

// Clear existing data
db.run('DELETE FROM portfolios');
db.run('DELETE FROM testimonials');

// Insert portfolio items with different categories
const portfolioItems = [
    {
        title: 'African Safari Adventure',
        category: 'wildlife',
        description: 'Stunning wildlife photography from the African savanna',
        imageUrl: 'https://images.unsplash.com/photo-1550358864-518f202c02ba?w=800&h=600&fit=crop',
        featured: 1
    },
    {
        title: 'Majestic Elephant Herd',
        category: 'wildlife',
        description: 'Elephants roaming freely in their natural habitat',
        imageUrl: 'https://images.unsplash.com/photo-1515981606840-3ef5ec878b4b?w=800&h=600&fit=crop',
        featured: 0
    },
    {
        title: 'Lion in the Wild',
        category: 'wildlife',
        description: 'A majestic lion captured in the golden hour',
        imageUrl: 'https://images.unsplash.com/photo-1565381409641-978849cd7bcb?w=800&h=600&fit=crop',
        featured: 0
    },
    {
        title: 'Sarah & Michael Wedding',
        category: 'wedding',
        description: 'Beautiful wedding captured in the countryside',
        imageUrl: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&h=600&fit=crop',
        featured: 1
    },
    {
        title: 'Elegant Bridal Portrait',
        category: 'wedding',
        description: 'Bridal portrait with natural light',
        imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
        featured: 0
    },
    {
        title: 'Reception Celebration',
        category: 'wedding',
        description: 'Candid moments from the wedding reception',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
        featured: 0
    },
    {
        title: 'Music Festival Live',
        category: 'event',
        description: 'High-energy event photography at a music festival',
        imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
        featured: 0
    },
    {
        title: 'Corporate Conference',
        category: 'event',
        description: 'Professional coverage of a corporate conference',
        imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
        featured: 0
    },
    {
        title: 'Fashion Runway Show',
        category: 'event',
        description: 'Fashion week runway photography',
        imageUrl: 'https://images.unsplash.com/photo-1533003505519-6a9b92ed4911?w=800&h=600&fit=crop',
        featured: 0
    },
    {
        title: 'Fashion Portrait',
        category: 'studio',
        description: 'Professional studio portrait with creative lighting',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop',
        featured: 1
    },
    {
        title: 'Dramatic Headshot',
        category: 'studio',
        description: 'Dramatic black and white headshot',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        featured: 0
    },
    {
        title: 'Product Photography',
        category: 'studio',
        description: 'Professional product photography for brands',
        imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=600&fit=crop',
        featured: 0
    },
    {
        title: 'Mountain Portrait',
        category: 'outdoor',
        description: 'Breathtaking portrait in mountain landscape',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        featured: 0
    },
    {
        title: 'Beach Sunset Session',
        category: 'outdoor',
        description: 'Golden hour portrait on the beach',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        featured: 0
    },
    {
        title: 'Family Outdoor Portrait',
        category: 'outdoor',
        description: 'Family portrait in a natural setting',
        imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=600&fit=crop',
        featured: 0
    },
    {
        title: 'Cozy Family Session',
        category: 'indoor',
        description: 'Intimate family portrait in a cozy home setting',
        imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=600&fit=crop',
        featured: 0
    },
    {
        title: 'Newborn Photography',
        category: 'indoor',
        description: 'Beautiful newborn photography session',
        imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=600&fit=crop',
        featured: 0
    },
    {
        title: 'Interior Lifestyle',
        category: 'indoor',
        description: 'Lifestyle photography in a beautiful interior',
        imageUrl: 'https://images.unsplash.com/photo-1499956827881-d2661f85b122?w=800&h=600&fit=crop',
        featured: 0
    }
];

// Insert testimonials
const testimonials = [
    {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        content: 'Willfred captured our wedding day perfectly! The photos are stunning and really captured the emotion of the day. We will cherish them forever.',
        rating: 5,
        service: 'wedding',
        approved: 1,
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=0D0D0D&color=e63946&size=100'
    },
    {
        name: 'Michael Brown',
        email: 'michael@example.com',
        content: 'The wildlife photos from our African safari are breathtaking. Willfred has an incredible eye for composition and timing. Highly recommend!',
        rating: 5,
        service: 'wildlife',
        approved: 1,
        avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=0D0D0D&color=e63946&size=100'
    },
    {
        name: 'Jennifer Lee',
        email: 'jennifer@example.com',
        content: 'Our corporate event photos were exactly what we needed - professional, high-quality, and delivered on time. Willfred is a true professional.',
        rating: 4,
        service: 'event',
        approved: 1,
        avatar: 'https://ui-avatars.com/api/?name=Jennifer+Lee&background=0D0D0D&color=e63946&size=100'
    },
    {
        name: 'David Kim',
        email: 'david@example.com',
        content: 'The studio portraits were amazing! Willfred made us feel comfortable and the photos turned out better than we imagined.',
        rating: 5,
        service: 'studio',
        approved: 1,
        avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=0D0D0D&color=e63946&size=100'
    }
];

// Insert data
db.serialize(function() {
    // Insert portfolios
    var stmt = db.prepare('INSERT INTO portfolios (title, category, description, imageUrl, featured) VALUES (?, ?, ?, ?, ?)');
    portfolioItems.forEach(function(item) {
        stmt.run(item.title, item.category, item.description, item.imageUrl, item.featured);
    });
    stmt.finalize();
    
    // Insert testimonials
    var stmt2 = db.prepare('INSERT INTO testimonials (name, email, content, rating, service, approved, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)');
    testimonials.forEach(function(item) {
        stmt2.run(item.name, item.email, item.content, item.rating, item.service, item.approved, item.avatar);
    });
    stmt2.finalize();
    
    console.log('✅ Sample data added successfully!');
    console.log(`📸 ${portfolioItems.length} portfolio items added`);
    console.log(`💬 ${testimonials.length} testimonials added`);
});

db.close();
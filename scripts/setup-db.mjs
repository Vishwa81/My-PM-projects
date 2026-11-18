import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_x5qVWEhskbX9@ep-long-smoke-besfq6qj-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = neon(databaseUrl);

async function setup() {
  console.log("Connecting to Neon PostgreSQL...");

  // 1. Create tables
  console.log("Creating tables...");
  await sql`
    CREATE TABLE IF NOT EXISTS restaurants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      cuisine VARCHAR(255) NOT NULL,
      address TEXT,
      image_url TEXT,
      price_range VARCHAR(50) DEFAULT '₹₹',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      avatar_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
      customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      title VARCHAR(255),
      comment TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'published' NOT NULL,
      helpful_count INTEGER DEFAULT 0 NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;

  // 2. Create indexes
  console.log("Creating indexes...");
  await sql`CREATE INDEX IF NOT EXISTS restaurant_id_idx ON reviews(restaurant_id);`;
  await sql`CREATE INDEX IF NOT EXISTS customer_id_idx ON reviews(customer_id);`;
  await sql`CREATE INDEX IF NOT EXISTS rating_idx ON reviews(rating);`;
  await sql`CREATE INDEX IF NOT EXISTS created_at_idx ON reviews(created_at);`;

  // 3. Check if Ludhiana Bistro already exists
  const existingRestaurants = await sql`
    SELECT id, name FROM restaurants WHERE name = 'Ludhiana Bistro' LIMIT 1;
  `;

  let restaurantId;
  if (existingRestaurants.length > 0) {
    restaurantId = existingRestaurants[0].id;
    console.log(`Found existing restaurant: Ludhiana Bistro (${restaurantId})`);
  } else {
    const inserted = await sql`
      INSERT INTO restaurants (name, description, cuisine, address, image_url, price_range)
      VALUES (
        'Ludhiana Bistro',
        'Experience royal Punjab on your plate. Authentic North Indian and Punjabi delicacies slow-cooked over clay tandoors with signature rich gravies, aromatic biryanis, and artisanal breads.',
        'North Indian, Punjabi',
        'SCO 42-43, Feroze Gandhi Market, Ludhiana, Punjab 141001',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
        '₹800 for two'
      )
      RETURNING id;
    `;
    restaurantId = inserted[0].id;
    console.log(`Created restaurant: Ludhiana Bistro (${restaurantId})`);
  }

  // 4. Seed demo reviews if needed
  const reviewCount = await sql`
    SELECT COUNT(*) as count FROM reviews WHERE restaurant_id = ${restaurantId};
  `;

  console.log(`Current review count for Ludhiana Bistro: ${reviewCount[0].count}`);

  if (Number(reviewCount[0].count) < 5) {
    console.log("Seeding demo reviews...");

    const demoReviews = [
      {
        name: "Rahul Sharma",
        email: "demo_rahul.sharma@example.com",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        title: "Best Butter Chicken in Punjab!",
        comment: "One of the best places to enjoy authentic Punjabi food. The butter chicken was velvety and rich, the garlic naan was blistered to perfection, and the service was warm and attentive.",
        helpful: 24,
        daysAgo: 1
      },
      {
        name: "Simran Kaur",
        email: "demo_simran.kaur@example.com",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        title: "Pure Royal Dining Experience",
        comment: "The Dal Makhani simmered for 24 hours was outstanding. Amritsari Kulcha with Chole was super crisp and flavorful. Cozy seating with traditional Punjabi instrumental music.",
        helpful: 19,
        daysAgo: 3
      },
      {
        name: "Amit Patel",
        email: "demo_amit.patel@example.com",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
        rating: 4,
        title: "Delicious tandoori platter and great ambience",
        comment: "Loved the smoky Paneer Tikka and Bhatti da Murgh. Generous portion sizes! Wait time was about 15 minutes during peak dinner hours, but totally worth it.",
        helpful: 11,
        daysAgo: 5
      },
      {
        name: "Pooja Malhotra",
        email: "demo_pooja.malhotra@example.com",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        title: "A gem for family dinners",
        comment: "Celebrated my parents' anniversary here. The staff made it special with complimentary Phirni. Highly recommend the Mutton Rogan Josh and Kadhai Paneer.",
        helpful: 15,
        daysAgo: 7
      },
      {
        name: "Vikram Singh",
        email: "demo_vikram.singh@example.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        rating: 4,
        title: "Authentic flavours and fresh lassi",
        comment: "Thick, creamy Patiala lassi topped with malai. The Tandoori Roti with sarson da saag was hearty. Pricing is very reasonable for the quality and hospitality.",
        helpful: 8,
        daysAgo: 10
      },
      {
        name: "Neha Gupta",
        email: "demo_neha.gupta@example.com",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        title: "Crispy naans and soulful curries",
        comment: "Everything about Ludhiana Bistro reflects culinary passion. Clean hygiene, well-spaced tables, and swift staff. Their stuffed kulchas are a must-try!",
        helpful: 12,
        daysAgo: 12
      },
      {
        name: "Arjun Verma",
        email: "demo_arjun.verma@example.com",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        rating: 3,
        title: "Good food but slow service on weekends",
        comment: "Food quality is undeniably good, especially the Chicken Tikka Lababdar. However, they were overwhelmed on Saturday evening and our drinks arrived late.",
        helpful: 7,
        daysAgo: 15
      },
      {
        name: "Harpreet Dhillon",
        email: "demo_harpreet.dhillon@example.com",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        title: "Reminds me of authentic Punjabi village kitchens",
        comment: "Real desi ghee aromas and earthy spices. The Pindi Chole was packed with tangy flavors. Hospitality was top tier. Will definitely bring more friends.",
        helpful: 14,
        daysAgo: 18
      },
      {
        name: "Tanvi Kapoor",
        email: "demo_tanvi.kapoor@example.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        rating: 4,
        title: "Loved the mocktails and kebabs",
        comment: "Modern twist on classic appetizers. Dahi ke Kebab melted in the mouth. Great spot for casual hangouts and celebrations.",
        helpful: 6,
        daysAgo: 20
      },
      {
        name: "Manish Joshi",
        email: "demo_manish.joshi@example.com",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
        rating: 2,
        title: "A bit too rich and heavy for my taste",
        comment: "Portions are very large and heavy on butter/cream. If you prefer light gravies, make sure to specify spice and butter levels in advance. Parking was also tricky.",
        helpful: 4,
        daysAgo: 22
      },
      {
        name: "Kavita Sethi",
        email: "demo_kavita.sethi@example.com",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        title: "Exceptional Biryani and Raita",
        comment: "The Dum Biryani was fragrant, perfectly layered with succulent meat, caramelized onions, and saffron. Mint chutney was zesty and fresh.",
        helpful: 9,
        daysAgo: 25
      },
      {
        name: "Rohan Bhatia",
        email: "demo_rohan.bhatia@example.com",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
        rating: 4,
        title: "Reliable, comforting dinner spot",
        comment: "Ordered delivery as well as dined in multiple times. Consistency across dishes is impressive. Butter Naan remains soft even after 20 mins.",
        helpful: 5,
        daysAgo: 28
      },
      {
        name: "Jaspreet Gill",
        email: "demo_jaspreet.gill@example.com",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        title: "Best dining spot in Feroze Gandhi Market!",
        comment: "The staff treats you like family. Loved the Malai Kofta, rich yet not overly sweet. Gulab Jamun served hot with rabri was heavenly.",
        helpful: 16,
        daysAgo: 32
      },
      {
        name: "Gaurav Chawla",
        email: "demo_gaurav.chawla@example.com",
        avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80",
        rating: 3,
        title: "Decent food, music was a bit loud",
        comment: "Tandoori chicken was flavorful and juicy. The restaurant had high energy, though background music was slightly too loud for a quiet conversation.",
        helpful: 3,
        daysAgo: 35
      },
      {
        name: "Sunita Roy",
        email: "demo_sunita.roy@example.com",
        avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        title: "Top tier hospitality and memorable food",
        comment: "Traveled from Chandigarh and stopped by based on recommendations. Did not disappoint! Paneer Butter Masala was extraordinary. 5 stars all the way.",
        helpful: 13,
        daysAgo: 40
      },
      {
        name: "Deepak Mehra",
        email: "demo_deepak.mehra@example.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
        rating: 1,
        title: "Long waiting queue without reservation",
        comment: "Walked in on Sunday night and was told 45 minutes wait. We ended up waiting over an hour. Staff was apologetic but reservation system should be improved.",
        helpful: 2,
        daysAgo: 45
      }
    ];

    for (const r of demoReviews) {
      // 1. Insert or get customer
      const cust = await sql`
        INSERT INTO customers (name, email, avatar_url)
        VALUES (${r.name}, ${r.email}, ${r.avatar})
        ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, avatar_url = EXCLUDED.avatar_url
        RETURNING id;
      `;
      const customerId = cust[0].id;

      // Calculate realistic creation timestamp
      const createdAt = new Date(Date.now() - r.daysAgo * 24 * 60 * 60 * 1000);

      // 2. Insert review
      await sql`
        INSERT INTO reviews (restaurant_id, customer_id, rating, title, comment, status, helpful_count, created_at, updated_at)
        VALUES (${restaurantId}, ${customerId}, ${r.rating}, ${r.title}, ${r.comment}, 'published', ${r.helpful}, ${createdAt}, ${createdAt});
      `;
    }

    console.log(`Successfully seeded ${demoReviews.length} demo reviews!`);
  }

  // Verify counts
  const finalSummary = await sql`
    SELECT 
      COUNT(*) as total_reviews,
      ROUND(AVG(rating)::numeric, 1) as avg_rating
    FROM reviews
    WHERE restaurant_id = ${restaurantId};
  `;
  console.log("Database initialized successfully!");
  console.log(`Ludhiana Bistro (${restaurantId}): ${finalSummary[0].total_reviews} reviews, Average rating: ${finalSummary[0].avg_rating}/5`);
}

setup().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});

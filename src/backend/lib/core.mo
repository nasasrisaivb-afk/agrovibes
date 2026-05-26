import Types "../types/core";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  // ── Farmers ───────────────────────────────────────────────────────────────

  public func getFarmers(farmers : List.List<Types.Farmer>) : [Types.Farmer] {
    farmers.toArray()
  };

  public func getFarmerById(farmers : List.List<Types.Farmer>, id : Nat) : ?Types.Farmer {
    farmers.find(func(f) { f.id == id })
  };

  // ── Listings ──────────────────────────────────────────────────────────────

  public func getListings(listings : List.List<Types.Listing>) : [Types.Listing] {
    listings.toArray()
  };

  public func createListing(
    listings : List.List<Types.Listing>,
    nextId : Nat,
    input : Types.CreateListingInput,
    now : Int,
  ) : Types.Listing {
    let listing : Types.Listing = {
      id = nextId;
      farmerId = input.farmerId;
      name = input.name;
      category = input.category;
      price = input.price;
      imageUrl = input.imageUrl;
      description = input.description;
      rating = 0.0;
      escrowEnabled = input.escrowEnabled;
      createdAt = now;
    };
    listings.add(listing);
    listing
  };

  // ── Reels ─────────────────────────────────────────────────────────────────

  public func getReels(reels : List.List<Types.Reel>) : [Types.Reel] {
    reels.toArray()
  };

  public func createReel(
    reels : List.List<Types.Reel>,
    nextId : Nat,
    input : Types.CreateReelInput,
  ) : Types.Reel {
    let reel : Types.Reel = {
      id = nextId;
      farmerId = input.farmerId;
      title = input.title;
      thumbnailUrl = input.thumbnailUrl;
      viewCount = 0;
      linkedListingId = input.linkedListingId;
    };
    reels.add(reel);
    reel
  };

  // ── Q&A ───────────────────────────────────────────────────────────────────

  public func getQuestions(questions : List.List<Types.Question>) : [Types.Question] {
    questions.toArray()
  };

  public func getAnswers(answers : List.List<Types.Answer>, questionId : Nat) : [Types.Answer] {
    answers.filter(func(a) { a.questionId == questionId }).toArray()
  };

  public func createQuestion(
    questions : List.List<Types.Question>,
    nextId : Nat,
    input : Types.CreateQuestionInput,
    now : Int,
  ) : Types.Question {
    let q : Types.Question = {
      id = nextId;
      authorId = input.authorId;
      title = input.title;
      description = input.description;
      category = input.category;
      answerCount = 0;
      upvoteCount = 0;
      createdAt = now;
    };
    questions.add(q);
    q
  };

  // ── Groups ────────────────────────────────────────────────────────────────

  public func getGroups(groups : List.List<Types.Group>) : [Types.Group] {
    groups.toArray()
  };

  public func getGroupMessages(
    messages : List.List<Types.GroupMessage>,
    groupId : Nat,
  ) : [Types.GroupMessage] {
    messages.filter(func(m) { m.groupId == groupId }).toArray()
  };

  public func addGroupMessage(
    messages : List.List<Types.GroupMessage>,
    nextId : Nat,
    input : Types.AddGroupMessageInput,
    now : Int,
  ) : Types.GroupMessage {
    let msg : Types.GroupMessage = {
      id = nextId;
      groupId = input.groupId;
      authorId = input.authorId;
      content = input.content;
      isVoiceMessage = input.isVoiceMessage;
      timestamp = now;
    };
    messages.add(msg);
    msg
  };

  // ── Services ──────────────────────────────────────────────────────────────

  public func getMachinery(machinery : List.List<Types.MachineryListing>) : [Types.MachineryListing] {
    machinery.toArray()
  };

  public func getLogistics(logistics : List.List<Types.LogisticsListing>) : [Types.LogisticsListing] {
    logistics.toArray()
  };

  public func getExperts(experts : List.List<Types.ExpertProfile>) : [Types.ExpertProfile] {
    experts.toArray()
  };

  // ── Alerts ────────────────────────────────────────────────────────────────

  public func getAlerts(alerts : List.List<Types.Alert>) : [Types.Alert] {
    alerts.toArray()
  };

  // ── Orders ────────────────────────────────────────────────────────────────

  public func getOrders(orders : List.List<Types.Order>) : [Types.Order] {
    orders.toArray()
  };

  public func submitOrder(
    orders : List.List<Types.Order>,
    nextId : Nat,
    input : Types.SubmitOrderInput,
    now : Int,
  ) : Types.Order {
    let order : Types.Order = {
      id = nextId;
      buyerId = input.buyerId;
      listingId = input.listingId;
      quantity = input.quantity;
      total = input.total;
      status = #Pending;
      createdAt = now;
    };
    orders.add(order);
    order
  };

  // ── Seed data helpers ─────────────────────────────────────────────────────

  public func seedFarmers(farmers : List.List<Types.Farmer>) {
    let data : [Types.Farmer] = [
      { id = 1; name = "Rajan Kumar"; avatarUrl = "https://picsum.photos/seed/f1/80/80"; location = "Amritsar, Punjab"; kycStatus = #Verified; rating = 4.8; numListings = 12; bio = "Wheat and rice farmer with 20 years of experience in the Punjab heartland." },
      { id = 2; name = "Priya Devi"; avatarUrl = "https://picsum.photos/seed/f2/80/80"; location = "Nashik, Maharashtra"; kycStatus = #Verified; rating = 4.7; numListings = 8; bio = "Certified organic grape and onion grower supplying to export markets." },
      { id = 3; name = "Suresh Patel"; avatarUrl = "https://picsum.photos/seed/f3/80/80"; location = "Anand, Gujarat"; kycStatus = #Verified; rating = 4.9; numListings = 15; bio = "Third-generation dairy farmer running an award-winning cooperative." },
      { id = 4; name = "Lakshmi Rao"; avatarUrl = "https://picsum.photos/seed/f4/80/80"; location = "Guntur, Andhra Pradesh"; kycStatus = #Pending; rating = 4.2; numListings = 6; bio = "Chili and tobacco specialist; pioneering eco-friendly pest management." },
      { id = 5; name = "Harpreet Singh"; avatarUrl = "https://picsum.photos/seed/f5/80/80"; location = "Ludhiana, Punjab"; kycStatus = #Verified; rating = 4.6; numListings = 10; bio = "Paddy and maize cultivator using smart irrigation across 40 acres." },
      { id = 6; name = "Kavitha Nair"; avatarUrl = "https://picsum.photos/seed/f6/80/80"; location = "Thrissur, Kerala"; kycStatus = #Verified; rating = 4.5; numListings = 9; bio = "Specialty spice farmer growing cardamom, pepper, and vanilla." },
      { id = 7; name = "Ramesh Yadav"; avatarUrl = "https://picsum.photos/seed/f7/80/80"; location = "Varanasi, Uttar Pradesh"; kycStatus = #Unverified; rating = 3.9; numListings = 4; bio = "Vegetable grower serving local mandis with fresh seasonal produce." },
      { id = 8; name = "Anita Sharma"; avatarUrl = "https://picsum.photos/seed/f8/80/80"; location = "Jaipur, Rajasthan"; kycStatus = #Verified; rating = 4.7; numListings = 11; bio = "Poultry and dairy producer; runs a certified free-range egg unit." },
      { id = 9; name = "Mohan Das"; avatarUrl = "https://picsum.photos/seed/f9/80/80"; location = "Bhubaneswar, Odisha"; kycStatus = #Pending; rating = 4.1; numListings = 5; bio = "Paddy and groundnut farmer transitioning to integrated farming systems." },
      { id = 10; name = "Sunita Gupta"; avatarUrl = "https://picsum.photos/seed/f10/80/80"; location = "Indore, Madhya Pradesh"; kycStatus = #Verified; rating = 4.6; numListings = 7; bio = "Soybean and wheat specialist, FPO board member for central India." },
      { id = 11; name = "Vijay Patil"; avatarUrl = "https://picsum.photos/seed/f11/80/80"; location = "Kolhapur, Maharashtra"; kycStatus = #Verified; rating = 4.4; numListings = 8; bio = "Sugarcane and jaggery producer supplying FMCG brands across India." },
      { id = 12; name = "Deepa Menon"; avatarUrl = "https://picsum.photos/seed/f12/80/80"; location = "Coimbatore, Tamil Nadu"; kycStatus = #Unverified; rating = 3.8; numListings = 3; bio = "Coconut and turmeric grower exploring direct-to-consumer sales." },
      { id = 13; name = "Ajay Verma"; avatarUrl = "https://picsum.photos/seed/f13/80/80"; location = "Meerut, Uttar Pradesh"; kycStatus = #Verified; rating = 4.5; numListings = 9; bio = "Fruit orchardist growing mango, guava, and litchi for pan-India markets." },
      { id = 14; name = "Geeta Kumari"; avatarUrl = "https://picsum.photos/seed/f14/80/80"; location = "Patna, Bihar"; kycStatus = #Pending; rating = 4.0; numListings = 5; bio = "Paddy and mustard farmer building her own brand for refined mustard oil." },
      { id = 15; name = "Naresh Reddy"; avatarUrl = "https://picsum.photos/seed/f15/80/80"; location = "Hyderabad, Telangana"; kycStatus = #Verified; rating = 4.8; numListings = 13; bio = "Tech-savvy farmer using IoT sensors for precision cotton cultivation." },
      { id = 16; name = "Meena Bisht"; avatarUrl = "https://picsum.photos/seed/f16/80/80"; location = "Dehradun, Uttarakhand"; kycStatus = #Verified; rating = 4.6; numListings = 6; bio = "Organic apple and pear grower in the Himalayan foothills." },
    ];
    for (f in data.vals()) { farmers.add(f) };
  };

  public func seedListings(listings : List.List<Types.Listing>) {
    let data : [Types.Listing] = [
      // Vegetables
      { id = 1;  farmerId = 1;  name = "Fresh Tomatoes";         category = #Vegetables; price = 35.0;  imageUrl = "https://picsum.photos/seed/p10/400/300"; description = "Plump, sun-ripened tomatoes, ideal for cooking and salads."; rating = 4.5; escrowEnabled = true;  createdAt = 0 },
      { id = 2;  farmerId = 7;  name = "Green Peas";             category = #Vegetables; price = 60.0;  imageUrl = "https://picsum.photos/seed/p11/400/300"; description = "Freshly shelled green peas, sweet and tender."; rating = 4.3; escrowEnabled = false; createdAt = 0 },
      { id = 3;  farmerId = 4;  name = "Red Chili (Dry)";        category = #Vegetables; price = 180.0; imageUrl = "https://picsum.photos/seed/p12/400/300"; description = "Sun-dried Guntur red chili, medium-hot variety."; rating = 4.7; escrowEnabled = true;  createdAt = 0 },
      { id = 4;  farmerId = 7;  name = "Cauliflower";            category = #Vegetables; price = 45.0;  imageUrl = "https://picsum.photos/seed/p13/400/300"; description = "Large white cauliflower heads, freshly harvested."; rating = 4.1; escrowEnabled = false; createdAt = 0 },
      { id = 5;  farmerId = 14; name = "Mustard Greens";         category = #Vegetables; price = 25.0;  imageUrl = "https://picsum.photos/seed/p14/400/300"; description = "Young tender mustard leaves, popular in Bihari cuisine."; rating = 4.4; escrowEnabled = true;  createdAt = 0 },
      { id = 6;  farmerId = 1;  name = "Onions (Red)";           category = #Vegetables; price = 28.0;  imageUrl = "https://picsum.photos/seed/p15/400/300"; description = "Medium-sized red onions, long shelf life."; rating = 4.6; escrowEnabled = true;  createdAt = 0 },
      { id = 7;  farmerId = 2;  name = "Nashik Onions";          category = #Vegetables; price = 30.0;  imageUrl = "https://picsum.photos/seed/p16/400/300"; description = "Premium Nashik white onions, mild and crisp."; rating = 4.8; escrowEnabled = true;  createdAt = 0 },
      { id = 8;  farmerId = 15; name = "Brinjal (Eggplant)";     category = #Vegetables; price = 40.0;  imageUrl = "https://picsum.photos/seed/p17/400/300"; description = "Shiny purple brinjals, perfect for curries and grills."; rating = 4.2; escrowEnabled = false; createdAt = 0 },
      { id = 9;  farmerId = 10; name = "Soybeans (Fresh)";       category = #Vegetables; price = 55.0;  imageUrl = "https://picsum.photos/seed/p18/400/300"; description = "Edamame-style fresh soybeans, high protein content."; rating = 4.3; escrowEnabled = true;  createdAt = 0 },
      { id = 10; farmerId = 7;  name = "Spinach Bundle";         category = #Vegetables; price = 20.0;  imageUrl = "https://picsum.photos/seed/p19/400/300"; description = "Fresh spinach bundles, washed and packed hygienically."; rating = 4.5; escrowEnabled = false; createdAt = 0 },
      // Fruits
      { id = 11; farmerId = 13; name = "Alphonso Mangoes";       category = #Fruits; price = 250.0; imageUrl = "https://picsum.photos/seed/p20/400/300"; description = "Certified GI-tagged Alphonso mangoes from Ratnagiri."; rating = 4.9; escrowEnabled = true;  createdAt = 0 },
      { id = 12; farmerId = 2;  name = "Nashik Grapes (Green)";  category = #Fruits; price = 90.0;  imageUrl = "https://picsum.photos/seed/p21/400/300"; description = "Seedless green grapes, export-quality, sweet and crisp."; rating = 4.8; escrowEnabled = true;  createdAt = 0 },
      { id = 13; farmerId = 13; name = "Guava";                  category = #Fruits; price = 45.0;  imageUrl = "https://picsum.photos/seed/p22/400/300"; description = "Large pink-fleshed guavas, rich in Vitamin C."; rating = 4.6; escrowEnabled = false; createdAt = 0 },
      { id = 14; farmerId = 16; name = "Himalayan Apples";       category = #Fruits; price = 120.0; imageUrl = "https://picsum.photos/seed/p23/400/300"; description = "Organic red and golden apples from Dehradun farms."; rating = 4.7; escrowEnabled = true;  createdAt = 0 },
      { id = 15; farmerId = 13; name = "Litchi";                 category = #Fruits; price = 150.0; imageUrl = "https://picsum.photos/seed/p24/400/300"; description = "Juicy litchis with thin skin and fragrant flesh."; rating = 4.8; escrowEnabled = true;  createdAt = 0 },
      { id = 16; farmerId = 12; name = "Fresh Coconut";          category = #Fruits; price = 35.0;  imageUrl = "https://picsum.photos/seed/p25/400/300"; description = "Young green coconuts, great for water and cooking."; rating = 4.4; escrowEnabled = false; createdAt = 0 },
      { id = 17; farmerId = 16; name = "Pears (Nashpati)";       category = #Fruits; price = 95.0;  imageUrl = "https://picsum.photos/seed/p26/400/300"; description = "Juicy green pears from Uttarakhand orchards."; rating = 4.5; escrowEnabled = true;  createdAt = 0 },
      // Grains
      { id = 18; farmerId = 1;  name = "Basmati Rice (Premium)"; category = #Grains; price = 85.0;  imageUrl = "https://picsum.photos/seed/p30/400/300"; description = "Long-grain aromatic basmati from the Punjab plains."; rating = 4.9; escrowEnabled = true;  createdAt = 0 },
      { id = 19; farmerId = 1;  name = "Wheat Grain";            category = #Grains; price = 22.0;  imageUrl = "https://picsum.photos/seed/p31/400/300"; description = "Sharbati wheat, ideal for making chapati and bread."; rating = 4.7; escrowEnabled = true;  createdAt = 0 },
      { id = 20; farmerId = 5;  name = "Yellow Maize";           category = #Grains; price = 18.0;  imageUrl = "https://picsum.photos/seed/p32/400/300"; description = "High-yield yellow maize, suitable for poultry feed and food processing."; rating = 4.3; escrowEnabled = false; createdAt = 0 },
      { id = 21; farmerId = 10; name = "Soybean Grain";          category = #Grains; price = 42.0;  imageUrl = "https://picsum.photos/seed/p33/400/300"; description = "Grade-A soybeans for oil extraction and animal feed."; rating = 4.5; escrowEnabled = true;  createdAt = 0 },
      { id = 22; farmerId = 9;  name = "Groundnuts";             category = #Grains; price = 65.0;  imageUrl = "https://picsum.photos/seed/p34/400/300"; description = "Unshelled groundnuts, freshly harvested and sun-dried."; rating = 4.4; escrowEnabled = false; createdAt = 0 },
      { id = 23; farmerId = 14; name = "Black Mustard Seeds";    category = #Grains; price = 55.0;  imageUrl = "https://picsum.photos/seed/p35/400/300"; description = "Pure black mustard seeds for oil pressing and spice use."; rating = 4.6; escrowEnabled = true;  createdAt = 0 },
      { id = 24; farmerId = 5;  name = "Toor Dal (Pigeon Pea)";  category = #Grains; price = 95.0;  imageUrl = "https://picsum.photos/seed/p36/400/300"; description = "Split yellow pigeon peas, a kitchen staple across India."; rating = 4.8; escrowEnabled = true;  createdAt = 0 },
      { id = 25; farmerId = 9;  name = "Chana (Chickpeas)";      category = #Grains; price = 70.0;  imageUrl = "https://picsum.photos/seed/p37/400/300"; description = "Desi chana, small and earthy, perfect for dal and snacks."; rating = 4.5; escrowEnabled = true;  createdAt = 0 },
      // Dairy
      { id = 26; farmerId = 3;  name = "Full-Cream Milk (5L)";   category = #Dairy; price = 280.0; imageUrl = "https://picsum.photos/seed/p40/400/300"; description = "Pure A2 milk from Gir cow herd, chilled and packed."; rating = 4.9; escrowEnabled = true;  createdAt = 0 },
      { id = 27; farmerId = 3;  name = "Fresh Paneer (500g)";    category = #Dairy; price = 180.0; imageUrl = "https://picsum.photos/seed/p41/400/300"; description = "Soft homestyle paneer made fresh daily."; rating = 4.8; escrowEnabled = true;  createdAt = 0 },
      { id = 28; farmerId = 3;  name = "Cultured Ghee (1L)";     category = #Dairy; price = 750.0; imageUrl = "https://picsum.photos/seed/p42/400/300"; description = "Bilona-method cultured ghee from curd-churned butter."; rating = 4.9; escrowEnabled = true;  createdAt = 0 },
      { id = 29; farmerId = 11; name = "Jaggery Powder (1kg)";   category = #Dairy; price = 120.0; imageUrl = "https://picsum.photos/seed/p43/400/300"; description = "Organic sugarcane jaggery powder, unrefined and mineral-rich."; rating = 4.7; escrowEnabled = false; createdAt = 0 },
      { id = 30; farmerId = 3;  name = "Curd (Dahi) 1kg";        category = #Dairy; price = 90.0;  imageUrl = "https://picsum.photos/seed/p44/400/300"; description = "Thick natural set curd from full-cream milk."; rating = 4.7; escrowEnabled = true;  createdAt = 0 },
      // Eggs
      { id = 31; farmerId = 8;  name = "Free-Range Eggs (30)";   category = #Eggs; price = 180.0; imageUrl = "https://picsum.photos/seed/p50/400/300"; description = "Farm-fresh free-range eggs with deep-orange yolks."; rating = 4.8; escrowEnabled = true;  createdAt = 0 },
      { id = 32; farmerId = 8;  name = "Brown Eggs (12)";        category = #Eggs; price = 80.0;  imageUrl = "https://picsum.photos/seed/p51/400/300"; description = "Premium brown eggs, naturally nutrient-rich."; rating = 4.7; escrowEnabled = false; createdAt = 0 },
      { id = 33; farmerId = 8;  name = "Organic Eggs (6)";       category = #Eggs; price = 65.0;  imageUrl = "https://picsum.photos/seed/p52/400/300"; description = "Certified organic eggs from hormone-free hens."; rating = 4.9; escrowEnabled = true;  createdAt = 0 },
      // Other / Spices
      { id = 34; farmerId = 6;  name = "Green Cardamom (100g)";  category = #Other; price = 320.0; imageUrl = "https://picsum.photos/seed/p60/400/300"; description = "Premium Kerala green cardamom, intensely aromatic."; rating = 4.9; escrowEnabled = true;  createdAt = 0 },
      { id = 35; farmerId = 6;  name = "Black Pepper (250g)";    category = #Other; price = 190.0; imageUrl = "https://picsum.photos/seed/p61/400/300"; description = "Malabar black pepper berries, bold and pungent."; rating = 4.8; escrowEnabled = true;  createdAt = 0 },
      { id = 36; farmerId = 12; name = "Turmeric (500g)";        category = #Other; price = 110.0; imageUrl = "https://picsum.photos/seed/p62/400/300"; description = "Pure Erode turmeric with high curcumin content."; rating = 4.7; escrowEnabled = false; createdAt = 0 },
      { id = 37; farmerId = 6;  name = "Vanilla Pods (10pcs)";   category = #Other; price = 450.0; imageUrl = "https://picsum.photos/seed/p63/400/300"; description = "Hand-pollinated vanilla pods, Grade-A, fully cured."; rating = 4.9; escrowEnabled = true;  createdAt = 0 },
      { id = 38; farmerId = 15; name = "Raw Cotton Bales";       category = #Other; price = 6000.0; imageUrl = "https://picsum.photos/seed/p64/400/300"; description = "Telangana Bt cotton, well-ginned, good staple length."; rating = 4.6; escrowEnabled = true;  createdAt = 0 },
      { id = 39; farmerId = 11; name = "Cane Sugar (Raw)";       category = #Other; price = 48.0;  imageUrl = "https://picsum.photos/seed/p65/400/300"; description = "Unrefined raw cane sugar, light amber color."; rating = 4.5; escrowEnabled = false; createdAt = 0 },
      { id = 40; farmerId = 12; name = "Coconut Oil (1L)";       category = #Other; price = 230.0; imageUrl = "https://picsum.photos/seed/p66/400/300"; description = "Cold-pressed virgin coconut oil from fresh coconuts."; rating = 4.8; escrowEnabled = true;  createdAt = 0 },
      // Extra listings
      { id = 41; farmerId = 4;  name = "Turmeric Fingers";       category = #Other; price = 95.0;  imageUrl = "https://picsum.photos/seed/p70/400/300"; description = "Fresh turmeric rhizomes, bright orange inside."; rating = 4.6; escrowEnabled = true;  createdAt = 0 },
      { id = 42; farmerId = 5;  name = "Jowar (Sorghum)";        category = #Grains; price = 28.0;  imageUrl = "https://picsum.photos/seed/p71/400/300"; description = "White jowar grains, rich in fibre and gluten-free."; rating = 4.4; escrowEnabled = false; createdAt = 0 },
      { id = 43; farmerId = 5;  name = "Bajra (Pearl Millet)";   category = #Grains; price = 24.0;  imageUrl = "https://picsum.photos/seed/p72/400/300"; description = "Bajra grains ideal for roti and porridge."; rating = 4.3; escrowEnabled = false; createdAt = 0 },
      { id = 44; farmerId = 2;  name = "Pomegranate";            category = #Fruits; price = 140.0; imageUrl = "https://picsum.photos/seed/p73/400/300"; description = "Bhagwa pomegranates, juicy with deep-red arils."; rating = 4.8; escrowEnabled = true;  createdAt = 0 },
      { id = 45; farmerId = 13; name = "Raw Banana";             category = #Fruits; price = 30.0;  imageUrl = "https://picsum.photos/seed/p74/400/300"; description = "Green cooking bananas, great for chips and curries."; rating = 4.3; escrowEnabled = false; createdAt = 0 },
      { id = 46; farmerId = 9;  name = "Paddy (Raw Rice)";       category = #Grains; price = 17.0;  imageUrl = "https://picsum.photos/seed/p75/400/300"; description = "Odisha Sona Masuri paddy, unpolished and aromatic."; rating = 4.5; escrowEnabled = true;  createdAt = 0 },
      { id = 47; farmerId = 15; name = "Fenugreek Seeds";        category = #Other; price = 72.0;  imageUrl = "https://picsum.photos/seed/p76/400/300"; description = "Organic methi seeds with rich bitter flavor."; rating = 4.4; escrowEnabled = false; createdAt = 0 },
      { id = 48; farmerId = 16; name = "Walnut (In-Shell)";      category = #Other; price = 600.0; imageUrl = "https://picsum.photos/seed/p77/400/300"; description = "Kashmiri walnut in hard shell, harvested in autumn."; rating = 4.7; escrowEnabled = true;  createdAt = 0 },
      { id = 49; farmerId = 8;  name = "Duck Eggs (12)";         category = #Eggs; price = 110.0; imageUrl = "https://picsum.photos/seed/p78/400/300"; description = "Large duck eggs with rich, creamy yolk."; rating = 4.6; escrowEnabled = false; createdAt = 0 },
      { id = 50; farmerId = 3;  name = "Butter (500g)";          category = #Dairy; price = 240.0; imageUrl = "https://picsum.photos/seed/p79/400/300"; description = "Unsalted white butter churned from fresh cream."; rating = 4.8; escrowEnabled = true;  createdAt = 0 },
      { id = 51; farmerId = 11; name = "Sugarcane Juice (5L)";   category = #Other; price = 80.0;  imageUrl = "https://picsum.photos/seed/p80/400/300"; description = "Freshly extracted sugarcane juice, chilled."; rating = 4.5; escrowEnabled = false; createdAt = 0 },
      { id = 52; farmerId = 7;  name = "Bitter Gourd (Karela)";  category = #Vegetables; price = 38.0;  imageUrl = "https://picsum.photos/seed/p81/400/300"; description = "Fresh karela, prized for its medicinal properties."; rating = 4.2; escrowEnabled = false; createdAt = 0 },
    ];
    for (l in data.vals()) { listings.add(l) };
  };

  public func seedReels(reels : List.List<Types.Reel>) {
    let data : [Types.Reel] = [
      { id = 1;  farmerId = 1;  title = "Wheat harvest timelapse";             thumbnailUrl = "https://picsum.photos/seed/r1/400/600";  viewCount = 12450; linkedListingId = ?18 },
      { id = 2;  farmerId = 2;  title = "Nashik grape picking season";         thumbnailUrl = "https://picsum.photos/seed/r2/400/600";  viewCount = 8900;  linkedListingId = ?12 },
      { id = 3;  farmerId = 3;  title = "A day at our dairy cooperative";      thumbnailUrl = "https://picsum.photos/seed/r3/400/600";  viewCount = 15600; linkedListingId = ?26 },
      { id = 4;  farmerId = 6;  title = "Cardamom plantation tour";            thumbnailUrl = "https://picsum.photos/seed/r4/400/600";  viewCount = 9800;  linkedListingId = ?34 },
      { id = 5;  farmerId = 13; title = "Mango orchard — first fruits!";       thumbnailUrl = "https://picsum.photos/seed/r5/400/600";  viewCount = 21000; linkedListingId = ?11 },
      { id = 6;  farmerId = 8;  title = "Free-range hens — morning rounds";    thumbnailUrl = "https://picsum.photos/seed/r6/400/600";  viewCount = 7300;  linkedListingId = ?31 },
      { id = 7;  farmerId = 15; title = "Cotton field after rain";             thumbnailUrl = "https://picsum.photos/seed/r7/400/600";  viewCount = 5100;  linkedListingId = ?38 },
      { id = 8;  farmerId = 5;  title = "Smart irrigation in action";          thumbnailUrl = "https://picsum.photos/seed/r8/400/600";  viewCount = 11200; linkedListingId = ?20 },
      { id = 9;  farmerId = 11; title = "Jaggery making — traditional method"; thumbnailUrl = "https://picsum.photos/seed/r9/400/600";  viewCount = 18700; linkedListingId = ?29 },
      { id = 10; farmerId = 16; title = "Apple harvest in the Himalayas";      thumbnailUrl = "https://picsum.photos/seed/r10/400/600"; viewCount = 24500; linkedListingId = ?14 },
      { id = 11; farmerId = 4;  title = "Chili drying in Guntur sun";          thumbnailUrl = "https://picsum.photos/seed/r11/400/600"; viewCount = 6700;  linkedListingId = ?3  },
      { id = 12; farmerId = 12; title = "Coconut oil extraction process";      thumbnailUrl = "https://picsum.photos/seed/r12/400/600"; viewCount = 9300;  linkedListingId = ?40 },
    ];
    for (r in data.vals()) { reels.add(r) };
  };

  public func seedQuestions(questions : List.List<Types.Question>) {
    let data : [Types.Question] = [
      { id = 1;  authorId = 7;  title = "How to control aphids on mustard?";                 description = "My mustard crop has severe aphid infestation. What is the best organic remedy?";                category = "Pest Control"; answerCount = 4; upvoteCount = 18; createdAt = 0 },
      { id = 2;  authorId = 9;  title = "Best price for paddy in Odisha this season?";       description = "MSP is set but local traders offering less. Where can I get better rates?";                   category = "Pricing";      answerCount = 6; upvoteCount = 25; createdAt = 0 },
      { id = 3;  authorId = 14; title = "Pre-monsoon rain forecast for Bihar?";              description = "Looking for reliable source for hyperlocal weather data for Patna district.";                  category = "Weather";      answerCount = 3; upvoteCount = 12; createdAt = 0 },
      { id = 4;  authorId = 4;  title = "Renting a tractor in Guntur — tips?";              description = "Need a tractor for 3 days next week. What should I check before renting?";                    category = "Equipment";    answerCount = 5; upvoteCount = 9;  createdAt = 0 },
      { id = 5;  authorId = 1;  title = "Wheat blast disease — how to identify?";           description = "Seeing unusual leaf spots on my wheat. Could this be wheat blast? Photos attached.";          category = "Pest Control"; answerCount = 7; upvoteCount = 31; createdAt = 0 },
      { id = 6;  authorId = 12; title = "Coconut export procedures?";                       description = "I want to start exporting dried coconut. What are the APEDA registration steps?";              category = "Pricing";      answerCount = 2; upvoteCount = 14; createdAt = 0 },
      { id = 7;  authorId = 15; title = "IoT soil sensors — which brand works in India?";   description = "Looking for affordable IoT soil moisture sensors that work with Indian networks.";             category = "Equipment";    answerCount = 8; upvoteCount = 22; createdAt = 0 },
      { id = 8;  authorId = 2;  title = "Grape downy mildew during monsoon?";               description = "Heavy monsoon this year and my vines are showing downy mildew. Treatment options?";            category = "Pest Control"; answerCount = 5; upvoteCount = 19; createdAt = 0 },
      { id = 9;  authorId = 10; title = "Soybean MSP vs market rate comparison?";           description = "Confused about whether to sell at MSP or wait for the market to improve.";                    category = "Pricing";      answerCount = 4; upvoteCount = 17; createdAt = 0 },
      { id = 10; authorId = 3;  title = "Hailstorm damage — how to claim insurance?";       description = "My dairy shed was damaged in a hailstorm. Steps to claim crop and asset insurance?";          category = "Weather";      answerCount = 6; upvoteCount = 28; createdAt = 0 },
      { id = 11; authorId = 6;  title = "Cardamom price outlook for Q4?";                   description = "Cardamom prices have been volatile. Any trade experts here tracking export demand?";           category = "Pricing";      answerCount = 3; upvoteCount = 11; createdAt = 0 },
      { id = 12; authorId = 5;  title = "Maize stem borer management?";                     description = "Stem borers are destroying my second crop. Need advice on integrated pest management.";        category = "Pest Control"; answerCount = 9; upvoteCount = 36; createdAt = 0 },
      { id = 13; authorId = 8;  title = "Poultry feed cost reduction strategies?";          description = "Feed costs are up 20%. Any alternatives to commercial pellets for layer hens?";               category = "Other";        answerCount = 5; upvoteCount = 16; createdAt = 0 },
      { id = 14; authorId = 11; title = "Best variety for second sugarcane crop?";           description = "Looking for early maturing sugarcane variety that tolerates Kolhapur's late rains.";          category = "Other";        answerCount = 4; upvoteCount = 13; createdAt = 0 },
      { id = 15; authorId = 13; title = "Mango storage after harvest?";                     description = "How to extend shelf life of Alphonso mango before dispatch without cold chain?";               category = "Other";        answerCount = 6; upvoteCount = 24; createdAt = 0 },
      { id = 16; authorId = 16; title = "Apple scab — organic fungicide options?";          description = "Apple scab is spreading fast. Looking for certified organic fungicide options.";               category = "Pest Control"; answerCount = 4; upvoteCount = 20; createdAt = 0 },
      { id = 17; authorId = 7;  title = "Subsidy for drip irrigation in UP?";              description = "Heard there is 90% subsidy for drip irrigation in UP. How to apply?";                          category = "Equipment";    answerCount = 3; upvoteCount = 8;  createdAt = 0 },
      { id = 18; authorId = 9;  title = "Cyclone preparedness for coastal Odisha?";         description = "Bay of Bengal cyclone season — what precautions should coastal farmers take?";                category = "Weather";      answerCount = 5; upvoteCount = 22; createdAt = 0 },
      { id = 19; authorId = 14; title = "Mustard oil price crashed — why?";                 description = "Mustard oil prices dropped sharply this week. Import duty change? Any news?";                 category = "Pricing";      answerCount = 7; upvoteCount = 30; createdAt = 0 },
      { id = 20; authorId = 4;  title = "Fall armyworm detection using pheromone traps?";   description = "NCIPM recommends pheromone traps. Anyone using them in South India with success?";           category = "Pest Control"; answerCount = 4; upvoteCount = 15; createdAt = 0 },
      { id = 21; authorId = 15; title = "Cotton picking machine availability in Telangana?"; description = "Hand-picking costs are high. Any cotton-picking machine rental service nearby?";             category = "Equipment";    answerCount = 3; upvoteCount = 10; createdAt = 0 },
      { id = 22; authorId = 6;  title = "Vanilla curing — home method vs commercial?";      description = "First vanilla harvest next month. Is home curing feasible or should I use a facility?";      category = "Other";        answerCount = 5; upvoteCount = 18; createdAt = 0 },
    ];
    for (q in data.vals()) { questions.add(q) };
  };

  public func seedAnswers(answers : List.List<Types.Answer>) {
    let data : [Types.Answer] = [
      { id = 1;  questionId = 1;  authorId = 6;  content = "Use neem oil spray (5ml/L) every 5 days. Also release ladybird beetles as natural predators."; upvoteCount = 12 },
      { id = 2;  questionId = 1;  authorId = 10; content = "IARI recommends imidacloprid seed treatment. Works well even under heavy aphid pressure."; upvoteCount = 8 },
      { id = 3;  questionId = 2;  authorId = 1;  content = "Try eNAM portal directly — listed prices are usually 5-10% above local trader rates."; upvoteCount = 15 },
      { id = 4;  questionId = 2;  authorId = 11; content = "FPO aggregation helps a lot. Pool 50+ tonnes and negotiate directly with millers."; upvoteCount = 20 },
      { id = 5;  questionId = 5;  authorId = 15; content = "Wheat blast shows angular grayish lesions on leaves and ears. Upload clear photos to CABI Plantwise for diagnosis."; upvoteCount = 18 },
      { id = 6;  questionId = 5;  authorId = 3;  content = "Contact your nearest ICAR-IIWBR center immediately if you suspect blast — it is a notifiable disease."; upvoteCount = 25 },
      { id = 7;  questionId = 7;  authorId = 15; content = "Fasal and CropIn both have good IoT sensor kits. Fasal has better Hindi support and is popular in Maharashtra."; upvoteCount = 14 },
      { id = 8;  questionId = 8;  authorId = 2;  content = "Mancozeb 75% WP at 2.5g/L gave me good control. Apply before sunrise when humidity is lower."; upvoteCount = 11 },
      { id = 9;  questionId = 10; content = "Under PMFBY, file claim within 72 hours. Document damage with photos. Block-level crop cutting experiments determine the payout."; authorId = 3; upvoteCount = 22 },
      { id = 10; questionId = 12; authorId = 6;  content = "Coragen (chlorantraniliprole) is highly effective for stem borer. One spray at egg hatching stage is enough."; upvoteCount = 28 },
      { id = 11; questionId = 15; authorId = 13; content = "Pre-cooling at 8-10°C immediately after harvest extends shelf life by 5-7 days. Avoid ethylene-producing fruits in storage."; upvoteCount = 16 },
    ];
    for (a in data.vals()) { answers.add(a) };
  };

  public func seedGroups(groups : List.List<Types.Group>) {
    let data : [Types.Group] = [
      { id = 1; name = "General";           description = "Open forum for all AgriMarket members — questions, tips, and updates.";               memberCount = 4820; iconUrl = "https://picsum.photos/seed/g1/80/80" },
      { id = 2; name = "FPOs Hub";          description = "Dedicated space for Farmer Producer Organisations to share resources and best practices."; memberCount = 1250; iconUrl = "https://picsum.photos/seed/g2/80/80" },
      { id = 3; name = "Regional Support";  description = "State and district-level farming discussions, local mandi rates, and government schemes."; memberCount = 3100; iconUrl = "https://picsum.photos/seed/g3/80/80" },
      { id = 4; name = "Market Tips";       description = "Price forecasts, commodity news, export opportunities, and trading strategies.";         memberCount = 2600; iconUrl = "https://picsum.photos/seed/g4/80/80" },
      { id = 5; name = "Equipment Exchange";description = "Buy, sell, or rent farm machinery. Tractor, harvester, and irrigation equipment listings."; memberCount = 870;  iconUrl = "https://picsum.photos/seed/g5/80/80" },
    ];
    for (g in data.vals()) { groups.add(g) };
  };

  public func seedGroupMessages(messages : List.List<Types.GroupMessage>) {
    let data : [Types.GroupMessage] = [
      // Group 1 — General
      { id = 1;  groupId = 1; authorId = 1;  content = "Welcome everyone! Share your harvest updates here.";                   isVoiceMessage = false; timestamp = 0 },
      { id = 2;  groupId = 1; authorId = 3;  content = "Just listed our new ghee batch — check it out on marketplace!";         isVoiceMessage = false; timestamp = 0 },
      { id = 3;  groupId = 1; authorId = 7;  content = "Any government scheme updates for UP farmers this month?";              isVoiceMessage = false; timestamp = 0 },
      { id = 4;  groupId = 1; authorId = 10; content = "Soybean prices looking better in Indore today ₹4,200/qt.";             isVoiceMessage = false; timestamp = 0 },
      { id = 5;  groupId = 1; authorId = 15; content = "[Voice message — 0:23]";                                               isVoiceMessage = true;  timestamp = 0 },
      // Group 2 — FPOs
      { id = 6;  groupId = 2; authorId = 10; content = "FPO annual AGM scheduled for next Saturday at Indore NABARD office.";  isVoiceMessage = false; timestamp = 0 },
      { id = 7;  groupId = 2; authorId = 11; content = "Our sugarcane FPO got SFAC equity grant approval — sharing documents."; isVoiceMessage = false; timestamp = 0 },
      { id = 8;  groupId = 2; authorId = 3;  content = "Need help drafting bylaw amendments for our dairy FPO.";               isVoiceMessage = false; timestamp = 0 },
      { id = 9;  groupId = 2; authorId = 5;  content = "[Voice message — 1:02]";                                               isVoiceMessage = true;  timestamp = 0 },
      // Group 3 — Regional Support
      { id = 10; groupId = 3; authorId = 9;  content = "Bhubaneswar mandi wheat rate today: ₹2,175/qt. Anyone else confirm?";  isVoiceMessage = false; timestamp = 0 },
      { id = 11; groupId = 3; authorId = 14; content = "Bihar Rajya Fasal Sahayata Yojna registration open till 15th.";         isVoiceMessage = false; timestamp = 0 },
      { id = 12; groupId = 3; authorId = 4;  content = "Guntur chili arrivals heavy — prices under pressure this week.";       isVoiceMessage = false; timestamp = 0 },
      { id = 13; groupId = 3; authorId = 2;  content = "[Voice message — 0:45]";                                               isVoiceMessage = true;  timestamp = 0 },
      // Group 4 — Market Tips
      { id = 14; groupId = 4; authorId = 11; content = "Raw sugar futures up 3% on global supply concerns. Good time to hold."; isVoiceMessage = false; timestamp = 0 },
      { id = 15; groupId = 4; authorId = 6;  content = "Cardamom auction average ₹1,850/kg at Vandanmedu — 5yr high!";         isVoiceMessage = false; timestamp = 0 },
      { id = 16; groupId = 4; authorId = 16; content = "Apple prices expected to rise due to poor Himachal yield this year.";  isVoiceMessage = false; timestamp = 0 },
      { id = 17; groupId = 4; authorId = 1;  content = "[Voice message — 0:38]";                                               isVoiceMessage = true;  timestamp = 0 },
      // Group 5 — Equipment Exchange
      { id = 18; groupId = 5; authorId = 7;  content = "Selling Mahindra 475 DI tractor 2018 model. 2,400 hrs. DM me.";        isVoiceMessage = false; timestamp = 0 },
      { id = 19; groupId = 5; authorId = 5;  content = "Renting out 40 HP tractor with rotavator @ ₹800/hr near Ludhiana.";   isVoiceMessage = false; timestamp = 0 },
      { id = 20; groupId = 5; authorId = 15; content = "Looking for cotton picker rental in Warangal area — any leads?";       isVoiceMessage = false; timestamp = 0 },
    ];
    for (m in data.vals()) { messages.add(m) };
  };

  public func seedMachinery(machinery : List.List<Types.MachineryListing>) {
    let data : [Types.MachineryListing] = [
      { id = 1; name = "Mahindra 575 DI Tractor";     category = "Tractor";    dailyRate = 1200.0; ownerId = 5;  imageUrl = "https://picsum.photos/seed/m1/400/300"; available = true  },
      { id = 2; name = "Kubota Paddy Combine";         category = "Harvester";  dailyRate = 3500.0; ownerId = 9;  imageUrl = "https://picsum.photos/seed/m2/400/300"; available = true  },
      { id = 3; name = "Sona Thresher (7.5 HP)";      category = "Thresher";   dailyRate = 800.0;  ownerId = 1;  imageUrl = "https://picsum.photos/seed/m3/400/300"; available = false },
      { id = 4; name = "Boom Sprayer (600L)";          category = "Sprayer";    dailyRate = 600.0;  ownerId = 15; imageUrl = "https://picsum.photos/seed/m4/400/300"; available = true  },
      { id = 5; name = "John Deere Rotavator";         category = "Rotavator";  dailyRate = 900.0;  ownerId = 5;  imageUrl = "https://picsum.photos/seed/m5/400/300"; available = true  },
      { id = 6; name = "Sugarcane Harvester";          category = "Harvester";  dailyRate = 4200.0; ownerId = 11; imageUrl = "https://picsum.photos/seed/m6/400/300"; available = true  },
      { id = 7; name = "Drip Irrigation Setup Kit";    category = "Irrigation"; dailyRate = 500.0;  ownerId = 15; imageUrl = "https://picsum.photos/seed/m7/400/300"; available = true  },
    ];
    for (m in data.vals()) { machinery.add(m) };
  };

  public func seedLogistics(logistics : List.List<Types.LogisticsListing>) {
    let data : [Types.LogisticsListing] = [
      { id = 1; providerName = "AgroExpress Logistics";  ratePerKm = 12.0;  serviceArea = "Punjab, Haryana, Delhi NCR";      imageUrl = "https://picsum.photos/seed/l1/400/300" },
      { id = 2; providerName = "FarmFreight India";       ratePerKm = 10.5;  serviceArea = "Maharashtra, Karnataka, Goa";    imageUrl = "https://picsum.photos/seed/l2/400/300" },
      { id = 3; providerName = "RuralMove Transport";     ratePerKm = 9.0;   serviceArea = "Uttar Pradesh, Bihar, Jharkhand"; imageUrl = "https://picsum.photos/seed/l3/400/300" },
      { id = 4; providerName = "South Agri Carriers";     ratePerKm = 11.0;  serviceArea = "Tamil Nadu, Kerala, Andhra Pradesh"; imageUrl = "https://picsum.photos/seed/l4/400/300" },
    ];
    for (l in data.vals()) { logistics.add(l) };
  };

  public func seedExperts(experts : List.List<Types.ExpertProfile>) {
    let data : [Types.ExpertProfile] = [
      { id = 1; name = "Dr. Arun Mehta";     specialty = "Agronomy";        hourlyRate = 500.0;  available = true;  imageUrl = "https://picsum.photos/seed/e1/80/80" },
      { id = 2; name = "Dr. Priya Sekharan"; specialty = "Pest Management"; hourlyRate = 600.0;  available = true;  imageUrl = "https://picsum.photos/seed/e2/80/80" },
      { id = 3; name = "CA Suresh Jha";      specialty = "Pricing & Trade"; hourlyRate = 750.0;  available = false; imageUrl = "https://picsum.photos/seed/e3/80/80" },
      { id = 4; name = "Dr. Kamala Iyer";    specialty = "Soil Science";    hourlyRate = 550.0;  available = true;  imageUrl = "https://picsum.photos/seed/e4/80/80" },
      { id = 5; name = "Er. Ravi Naidu";     specialty = "Water Management";hourlyRate = 650.0;  available = true;  imageUrl = "https://picsum.photos/seed/e5/80/80" },
      { id = 6; name = "Dr. Neha Trivedi";   specialty = "Organic Farming"; hourlyRate = 480.0;  available = true;  imageUrl = "https://picsum.photos/seed/e6/80/80" },
    ];
    for (e in data.vals()) { experts.add(e) };
  };

  public func seedAlerts(alerts : List.List<Types.Alert>) {
    let data : [Types.Alert] = [
      { id = 1;  alertType = #Weather; title = "Heavy Rainfall Warning";        location = "Coastal Andhra Pradesh";   severity = #High;     description = "IMD forecasts 150-200mm rainfall over 48 hours. Protect standing crops and drain low-lying fields."; timestamp = 0 },
      { id = 2;  alertType = #Pest;    title = "Desert Locust Alert";           location = "Rajasthan, Gujarat Border";severity = #Critical; description = "Locust swarms detected near Barmer. Keep crop protection sprayers ready and report sightings to district agriculture office."; timestamp = 0 },
      { id = 3;  alertType = #Weather; title = "Cold Wave Warning";             location = "Punjab & Haryana";          severity = #Medium;   description = "Night temperatures to drop below 4°C over next 5 days. Cover young wheat seedlings to prevent frost damage."; timestamp = 0 },
      { id = 4;  alertType = #Pest;    title = "Fall Armyworm Outbreak";        location = "Karnataka & Telangana";    severity = #High;     description = "FAW larvae at damaging levels in maize fields. Apply chlorantraniliprole at egg hatching stage."; timestamp = 0 },
      { id = 5;  alertType = #Weather; title = "Cyclone Preparedness Alert";    location = "Odisha Coast";             severity = #Critical; description = "Cyclone forming in Bay of Bengal. Evacuate livestock, secure equipment, and delay harvest operations."; timestamp = 0 },
      { id = 6;  alertType = #Pest;    title = "Brown Plant Hopper Surge";      location = "West Bengal, Bihar";       severity = #High;     description = "BPH populations at outbreak levels in paddy. Remove affected tillers and apply buprofezin immediately."; timestamp = 0 },
      { id = 7;  alertType = #Weather; title = "Hailstorm Risk Advisory";       location = "Madhya Pradesh";           severity = #Medium;   description = "Severe thunderstorms with hail possible in Vidisha and Sehore districts. File crop insurance report if damage occurs."; timestamp = 0 },
      { id = 8;  alertType = #Pest;    title = "Whitefly on Cotton";            location = "Punjab, Haryana";          severity = #Medium;   description = "Whitefly populations climbing in cotton. Consider yellow sticky traps and thiamethoxam foliar spray if threshold crossed."; timestamp = 0 },
      { id = 9;  alertType = #Weather; title = "Drought Watch Issued";          location = "Marathwada, Maharashtra";  severity = #High;     description = "Cumulative rainfall 43% below normal. Prioritize water-saving irrigation. Soybean may face stress at pod-filling stage."; timestamp = 0 },
      { id = 10; alertType = #Pest;    title = "Mango Fruit Borer Detected";    location = "Uttar Pradesh (Meerut)";  severity = #Medium;   description = "Fruit borer damage reported in mango orchards. Use pheromone traps and spray carbaryl after petal fall."; timestamp = 0 },
      { id = 11; alertType = #Weather; title = "Fog Advisory — Rabi Crops";     location = "Indo-Gangetic Plains";    severity = #Low;      description = "Dense fog expected for 10+ days. Rabi wheat may face reduced photosynthesis. Ensure drainage to prevent foot rot."; timestamp = 0 },
      { id = 12; alertType = #Pest;    title = "Thrips Surge in Onion Fields";  location = "Nashik, Maharashtra";     severity = #Medium;   description = "Thrips infestation in onion crops. Apply spinosad or lambda-cyhalothrin at threshold of 10 thrips/plant."; timestamp = 0 },
      { id = 13; alertType = #Weather; title = "Heat Wave Watch";               location = "Telangana & AP";          severity = #High;     description = "Temperatures forecast to cross 42°C for 7 days. Irrigate crops at sunrise or sunset to reduce heat stress."; timestamp = 0 },
      { id = 14; alertType = #Pest;    title = "Helicoverpa on Chickpea";       location = "Madhya Pradesh, Rajasthan";severity = #Medium;  description = "Pod borer at damaging levels in chickpea. HaNPV biological spray is effective and NPOP-certified."; timestamp = 0 },
      { id = 15; alertType = #Weather; title = "Unseasonal Rain — Harvest Risk"; location = "Himachal Pradesh";        severity = #Low;      description = "Rain forecast at critical apple harvest window. Expedite picking for mature varieties to prevent cracking."; timestamp = 0 },
    ];
    for (a in data.vals()) { alerts.add(a) };
  };
  // ── Seasonal Alerts ───────────────────────────────────────────────────────

  public func getSeasonalAlerts(seasonalAlerts : List.List<Types.SeasonalAlert>) : [Types.SeasonalAlert] {
    seasonalAlerts.toArray()
  };

  public func seedSeasonalAlerts(seasonalAlerts : List.List<Types.SeasonalAlert>) {
    let data : [Types.SeasonalAlert] = [
      { id = 1; alertType = #Weather; cropName = "Wheat";  title = "Heavy Rainfall Forecast";       description = "IMD predicts 120mm rainfall in 48hrs across Punjab. Delay irrigation and ensure drainage in wheat fields."; region = "Punjab, Haryana";         severity = #High;   timestamp = 1716000000000000000 },
      { id = 2; alertType = #Weather; cropName = "Paddy"; title = "Cyclone Watch — Odisha Coast";   description = "Deep depression likely to intensify. Paddy at ripening stage at risk. Harvest early if possible.";           region = "Odisha Coast";            severity = #High;   timestamp = 1715900000000000000 },
      { id = 3; alertType = #Pest;    cropName = "Maize"; title = "Fall Armyworm Outbreak";         description = "FAW larvae at damaging threshold in Telangana maize belt. Apply chlorantraniliprole at first instar.";        region = "Telangana, Karnataka";    severity = #High;   timestamp = 1715800000000000000 },
      { id = 4; alertType = #Pest;    cropName = "Cotton";title = "Whitefly Alert — Cotton Belt";   description = "Whitefly nymph counts above threshold. Use yellow sticky traps and thiamethoxam if count exceeds 6/leaf.";   region = "Punjab, Haryana";         severity = #Medium; timestamp = 1715700000000000000 },
      { id = 5; alertType = #Price;   cropName = "Onion"; title = "Onion Price Surge Expected";     description = "Nashik arrivals down 30% due to excess rainfall. Wholesale prices may rise 20-25% over next fortnight.";     region = "Nashik, Maharashtra";     severity = #Medium; timestamp = 1715600000000000000 },
    ];
    for (a in data.vals()) { seasonalAlerts.add(a) };
  };

  // ── Market Price Ticks ────────────────────────────────────────────────────

  public func getMarketPriceTicks(marketPriceTicks : List.List<Types.MarketPriceTick>) : [Types.MarketPriceTick] {
    marketPriceTicks.toArray()
  };

  public func seedMarketPriceTicks(marketPriceTicks : List.List<Types.MarketPriceTick>) {
    let data : [Types.MarketPriceTick] = [
      { id = 1;  cropName = "Tomato";     price = 2850.0;  changePercent =  4.2;  date = 1716000000000000000 },
      { id = 2;  cropName = "Wheat";      price = 2210.0;  changePercent = -0.5;  date = 1716000000000000000 },
      { id = 3;  cropName = "Rice";       price = 3650.0;  changePercent =  1.1;  date = 1716000000000000000 },
      { id = 4;  cropName = "Potato";     price = 1420.0;  changePercent = -2.3;  date = 1716000000000000000 },
      { id = 5;  cropName = "Onion";      price = 3100.0;  changePercent =  7.8;  date = 1716000000000000000 },
      { id = 6;  cropName = "Maize";      price = 1980.0;  changePercent =  0.9;  date = 1716000000000000000 },
      { id = 7;  cropName = "Cotton";     price = 6400.0;  changePercent = -1.2;  date = 1716000000000000000 },
      { id = 8;  cropName = "Sugarcane";  price = 3150.0;  changePercent =  0.3;  date = 1716000000000000000 },
      { id = 9;  cropName = "Soybean";    price = 4220.0;  changePercent =  2.5;  date = 1716000000000000000 },
      { id = 10; cropName = "Chilli";     price = 9800.0;  changePercent =  5.6;  date = 1716000000000000000 },
    ];
    for (t in data.vals()) { marketPriceTicks.add(t) };
  };

  // ── Seller Listings ───────────────────────────────────────────────────────

  public func getSellerListings(sellerListings : List.List<Types.SellerListing>) : [Types.SellerListing] {
    sellerListings.toArray()
  };

  public func getSellerListing(sellerListings : List.List<Types.SellerListing>, id : Nat) : ?Types.SellerListing {
    sellerListings.find(func(s) { s.id == id })
  };

  public func addSellerListing(
    sellerListings : List.List<Types.SellerListing>,
    nextId : Nat,
    input : Types.CreateSellerListingInput,
    now : Int,
  ) : Types.SellerListing {
    let listing : Types.SellerListing = {
      id = nextId;
      farmerId = input.farmerId;
      name = input.name;
      category = input.category;
      price = input.price;
      imageUrl = input.imageUrl;
      description = input.description;
      rating = 0.0;
      escrowEnabled = input.escrowEnabled;
      createdAt = now;
      bulkUploadBatch = input.bulkUploadBatch;
      contractType = input.contractType;
      verificationStatus = input.verificationStatus;
      payoutSchedule = input.payoutSchedule;
      certifications = input.certifications;
    };
    sellerListings.add(listing);
    listing
  };

  public func seedSellerListings(sellerListings : List.List<Types.SellerListing>) {
    let data : [Types.SellerListing] = [
      { id = 1;  farmerId = 1;  name = "Wheat HYV HD-3086 Seeds (10kg)";     category = #Grains;     price = 480.0;   imageUrl = "https://picsum.photos/seed/sl1/400/300";  description = "High-yield wheat variety HD-3086, resistant to rust diseases, certified.";       rating = 4.7; escrowEnabled = true;  createdAt = 0; bulkUploadBatch = "BATCH-A"; contractType = #Phytosanitary; verificationStatus = #Approved; payoutSchedule = #Weekly; certifications = ["ICAR Certified", "Seed Act 1966"] },
      { id = 2;  farmerId = 1;  name = "Rice Basmati Pusa 1121 Seed (5kg)"; category = #Grains;     price = 350.0;   imageUrl = "https://picsum.photos/seed/sl2/400/300";  description = "Long-grain aromatic basmati, export-quality, high milling recovery.";           rating = 4.9; escrowEnabled = true;  createdAt = 0; bulkUploadBatch = "BATCH-A"; contractType = #Phytosanitary; verificationStatus = #Approved; payoutSchedule = #Weekly; certifications = ["GI Certified", "APEDA Approved"] },
      { id = 3;  farmerId = 15; name = "Tomato Hybrid Varun F1 (500g)";      category = #Vegetables; price = 280.0;   imageUrl = "https://picsum.photos/seed/sl3/400/300";  description = "Indeterminate hybrid tomato with high lycopene and long shelf-life.";           rating = 4.6; escrowEnabled = false; createdAt = 0; bulkUploadBatch = "BATCH-B"; contractType = #None;         verificationStatus = #Approved; payoutSchedule = #Daily; certifications = ["IARI Approved"] },
      { id = 4;  farmerId = 15; name = "Bt Cotton Seeds MCU-5 (450g)";       category = #Other;      price = 750.0;   imageUrl = "https://picsum.photos/seed/sl4/400/300";  description = "Approved Bt cotton hybrid with bollworm resistance and high ginning outturn."; rating = 4.8; escrowEnabled = true;  createdAt = 0; bulkUploadBatch = "BATCH-B"; contractType = #Phytosanitary; verificationStatus = #Approved; payoutSchedule = #Net30; certifications = ["GEAC Approved", "CICR Tested"] },
      { id = 5;  farmerId = 2;  name = "Organic Tomato Grade A (10kg)";      category = #Vegetables; price = 420.0;   imageUrl = "https://picsum.photos/seed/sl5/400/300";  description = "Pesticide-free tomatoes certified organic by APOF. Ready for export.";          rating = 4.8; escrowEnabled = true;  createdAt = 0; bulkUploadBatch = "BATCH-C"; contractType = #None;         verificationStatus = #Approved; payoutSchedule = #Daily; certifications = ["NPOP Organic", "APOF Certified"] },
      { id = 6;  farmerId = 4;  name = "Green Chilli Fresh (1kg)";           category = #Vegetables; price = 95.0;    imageUrl = "https://picsum.photos/seed/sl6/400/300";  description = "Medium-hot green chilli from Guntur fields, freshly harvested.";               rating = 4.5; escrowEnabled = false; createdAt = 0; bulkUploadBatch = "BATCH-C"; contractType = #None;         verificationStatus = #Pending; payoutSchedule = #Daily; certifications = [] },
      { id = 7;  farmerId = 9;  name = "Potato Kufri Jyoti (25kg)";         category = #Vegetables; price = 650.0;   imageUrl = "https://picsum.photos/seed/sl7/400/300";  description = "Table variety potato, uniform size, good cooking quality.";                     rating = 4.3; escrowEnabled = true;  createdAt = 0; bulkUploadBatch = "BATCH-D"; contractType = #None;         verificationStatus = #Approved; payoutSchedule = #Weekly; certifications = ["FSSAI Compliant"] },
      { id = 8;  farmerId = 5;  name = "Tractor 45 HP Mahindra (Rental)";   category = #Other;      price = 1400.0;  imageUrl = "https://picsum.photos/seed/sl8/400/300";  description = "Mahindra Arjun 605 DI-I, 45 HP, with rotavator attachment. Daily rental.";     rating = 4.6; escrowEnabled = true;  createdAt = 0; bulkUploadBatch = "BATCH-E"; contractType = #Rental;       verificationStatus = #Approved; payoutSchedule = #Daily; certifications = ["RC Valid", "Insurance Active"] },
      { id = 9;  farmerId = 15; name = "Boom Sprayer 500L (Rental)";         category = #Other;      price = 700.0;   imageUrl = "https://picsum.photos/seed/sl9/400/300";  description = "Tractor-mounted boom sprayer, 12m boom, suitable for cotton and soybean.";     rating = 4.4; escrowEnabled = true;  createdAt = 0; bulkUploadBatch = "BATCH-E"; contractType = #Rental;       verificationStatus = #Approved; payoutSchedule = #Daily; certifications = ["Calibration Certified"] },
      { id = 10; farmerId = 11; name = "Sugarcane Organic (Tonne)";          category = #Other;      price = 3200.0;  imageUrl = "https://picsum.photos/seed/sl10/400/300"; description = "Organic sugarcane from Kolhapur, free from chemical residues.";                 rating = 4.5; escrowEnabled = true;  createdAt = 0; bulkUploadBatch = "BATCH-F"; contractType = #Phytosanitary; verificationStatus = #Approved; payoutSchedule = #Net30; certifications = ["NPOP Organic"] },
      { id = 11; farmerId = 3;  name = "A2 Full Cream Milk (10L)";           category = #Dairy;      price = 560.0;   imageUrl = "https://picsum.photos/seed/sl11/400/300"; description = "Pure A2 milk from Gir cows, 10L canister, morning delivery.";                  rating = 4.9; escrowEnabled = false; createdAt = 0; bulkUploadBatch = "BATCH-F"; contractType = #None;         verificationStatus = #Approved; payoutSchedule = #Daily; certifications = ["FSSAI Licensed", "AGMARK"] },
      { id = 12; farmerId = 6;  name = "Cardamom Premium (1kg)";             category = #Other;      price = 1850.0;  imageUrl = "https://picsum.photos/seed/sl12/400/300"; description = "Bold-grade green cardamom from Idukki, aromatic and export-quality.";           rating = 4.9; escrowEnabled = true;  createdAt = 0; bulkUploadBatch = "BATCH-G"; contractType = #Phytosanitary; verificationStatus = #Approved; payoutSchedule = #Net30; certifications = ["Spices Board Certified", "GI Tagged"] },
      { id = 13; farmerId = 13; name = "Alphonso Mango Hapus (12pcs)";       category = #Fruits;     price = 380.0;   imageUrl = "https://picsum.photos/seed/sl13/400/300"; description = "GI-tagged Ratnagiri Alphonso, hand-picked, stage-3 ripeness.";                  rating = 4.9; escrowEnabled = true;  createdAt = 0; bulkUploadBatch = "BATCH-G"; contractType = #None;         verificationStatus = #Approved; payoutSchedule = #Daily; certifications = ["GI Certified", "APEDA Approved"] },
      { id = 14; farmerId = 16; name = "Organic Apple Shimla (5kg)";         category = #Fruits;     price = 620.0;   imageUrl = "https://picsum.photos/seed/sl14/400/300"; description = "Himachal organic apple, Royal Delicious, hand-sorted, no wax coating.";         rating = 4.7; escrowEnabled = true;  createdAt = 0; bulkUploadBatch = "BATCH-H"; contractType = #None;         verificationStatus = #Pending; payoutSchedule = #Weekly; certifications = ["NPOP Organic"] },
      { id = 15; farmerId = 10; name = "Soybean Grade FAQ (50kg)";           category = #Grains;     price = 2100.0;  imageUrl = "https://picsum.photos/seed/sl15/400/300"; description = "FAQ-grade soybean from Madhya Pradesh, moisture 9%, for oil extraction.";       rating = 4.5; escrowEnabled = true;  createdAt = 0; bulkUploadBatch = "BATCH-H"; contractType = #None;         verificationStatus = #Expired; payoutSchedule = #Net30; certifications = [] },
    ];
    for (s in data.vals()) { sellerListings.add(s) };
  };

  // ── Sales Analytics ───────────────────────────────────────────────────────

  public func getSalesAnalytics(salesAnalytics : List.List<Types.SalesAnalytics>) : [Types.SalesAnalytics] {
    salesAnalytics.toArray()
  };

  public func seedSalesAnalytics(salesAnalytics : List.List<Types.SalesAnalytics>) {
    let data : [Types.SalesAnalytics] = [
      { id = 1; cropName = "Wheat";     totalRevenue = 84200.0;  unitsSold = 3820; period = #Monthly },
      { id = 2; cropName = "Tomato";    totalRevenue = 52600.0;  unitsSold = 1845; period = #Monthly },
      { id = 3; cropName = "Basmati";   totalRevenue = 118500.0; unitsSold = 1394; period = #Monthly },
      { id = 4; cropName = "Soybean";   totalRevenue = 63000.0;  unitsSold = 1500; period = #Monthly },
      { id = 5; cropName = "Cotton";    totalRevenue = 192000.0; unitsSold =  320; period = #Monthly },
      { id = 6; cropName = "Cardamom";  totalRevenue = 148000.0; unitsSold =   80; period = #Weekly  },
      { id = 7; cropName = "Onion";     totalRevenue = 31500.0;  unitsSold = 1125; period = #Weekly  },
      { id = 8; cropName = "Potato";    totalRevenue = 26000.0;  unitsSold = 1857; period = #Weekly  },
    ];
    for (a in data.vals()) { salesAnalytics.add(a) };
  };

  // ── Inventory Items ───────────────────────────────────────────────────────

  public func getInventoryItems(inventoryItems : List.List<Types.InventoryItem>) : [Types.InventoryItem] {
    inventoryItems.toArray()
  };

  public func seedInventoryItems(inventoryItems : List.List<Types.InventoryItem>) {
    let data : [Types.InventoryItem] = [
      { id = 1; listingId = 18; currentStock = 2400; threshold = 500;  forecastDays = 12 },
      { id = 2; listingId = 19; currentStock = 380;  threshold = 400;  forecastDays = 3  },
      { id = 3; listingId = 34; currentStock = 60;   threshold = 50;   forecastDays = 8  },
      { id = 4; listingId = 11; currentStock = 45;   threshold = 80;   forecastDays = 2  },
      { id = 5; listingId = 26; currentStock = 1200; threshold = 300;  forecastDays = 15 },
      { id = 6; listingId = 38; currentStock = 120;  threshold = 200;  forecastDays = 5  },
    ];
    for (i in data.vals()) { inventoryItems.add(i) };
  };

  // ── Team Members ──────────────────────────────────────────────────────────

  public func getTeamMembers(teamMembers : List.List<Types.TeamMember>) : [Types.TeamMember] {
    teamMembers.toArray()
  };

  public func seedTeamMembers(teamMembers : List.List<Types.TeamMember>) {
    let data : [Types.TeamMember] = [
      { id = 1; name = "Rajan Kumar";   role = "Owner";   permissions = ["all"];                                                              lastActive = 1716000000000000000 },
      { id = 2; name = "Priya Sharma";  role = "Manager"; permissions = ["view_analytics", "manage_listings", "view_orders", "manage_inventory"]; lastActive = 1715990000000000000 },
      { id = 3; name = "Arun Nair";     role = "Staff";   permissions = ["view_orders", "manage_inventory"];                                  lastActive = 1715980000000000000 },
    ];
    for (m in data.vals()) { teamMembers.add(m) };
  };

  // ── KYC Records ───────────────────────────────────────────────────────────

  public func getKycRecords(kycRecords : List.List<Types.KycRecord>) : [Types.KycRecord] {
    kycRecords.toArray()
  };

  public func addKycRecord(
    kycRecords : List.List<Types.KycRecord>,
    nextId : Nat,
    userId : Nat,
  ) : Types.KycRecord {
    let record : Types.KycRecord = {
      id = nextId;
      userId = userId;
      status = #Pending;
      selfieVerified = false;
      idVerified = false;
      auditEvents = [];
    };
    kycRecords.add(record);
    record
  };

  public func updateKycStatus(
    kycRecords : List.List<Types.KycRecord>,
    id : Nat,
    status : Types.KycVerificationStatus,
  ) : Bool {
    var updated = false;
    kycRecords.mapInPlace(
      func(r) {
        if (r.id == id) {
          updated := true;
          { r with status = status }
        } else { r }
      }
    );
    updated
  };

  public func seedKycRecords(kycRecords : List.List<Types.KycRecord>) {
    let data : [Types.KycRecord] = [
      {
        id = 1; userId = 1; status = #Verified; selfieVerified = true; idVerified = true;
        auditEvents = [
          { action = "KYC Initiated";    performedBy = "system";          timestamp = 1714000000000000000 },
          { action = "Selfie Verified";  performedBy = "verifier@kyc.in"; timestamp = 1714100000000000000 },
          { action = "ID Verified";      performedBy = "verifier@kyc.in"; timestamp = 1714200000000000000 },
          { action = "KYC Approved";     performedBy = "admin@agri.in";   timestamp = 1714300000000000000 },
        ]
      },
      {
        id = 2; userId = 4; status = #Pending; selfieVerified = true; idVerified = false;
        auditEvents = [
          { action = "KYC Initiated";   performedBy = "system";          timestamp = 1715000000000000000 },
          { action = "Selfie Verified"; performedBy = "verifier@kyc.in"; timestamp = 1715100000000000000 },
        ]
      },
      {
        id = 3; userId = 7; status = #Rejected; selfieVerified = false; idVerified = false;
        auditEvents = [
          { action = "KYC Initiated"; performedBy = "system";       timestamp = 1715200000000000000 },
          { action = "KYC Rejected";  performedBy = "admin@agri.in"; timestamp = 1715300000000000000 },
        ]
      },
    ];
    for (k in data.vals()) { kycRecords.add(k) };
  };

  // ── Dispute Cases ─────────────────────────────────────────────────────────

  public func getDisputeCases(disputeCases : List.List<Types.DisputeCase>) : [Types.DisputeCase] {
    disputeCases.toArray()
  };

  public func addDisputeCase(
    disputeCases : List.List<Types.DisputeCase>,
    nextId : Nat,
    orderId : Nat,
    evidence : [Text],
    now : Int,
  ) : Types.DisputeCase {
    let disputeCase : Types.DisputeCase = {
      id = nextId;
      orderId = orderId;
      status = #Open;
      evidence = evidence;
      timeline = [{ event = "Dispute Filed"; timestamp = now; performedBy = "buyer" }];
      resolution = null;
    };
    disputeCases.add(disputeCase);
    disputeCase
  };

  public func seedDisputeCases(disputeCases : List.List<Types.DisputeCase>) {
    let data : [Types.DisputeCase] = [
      {
        id = 1; orderId = 1; status = #Open;
        evidence = ["photo_damage_1.jpg", "photo_damage_2.jpg", "invoice_scan.pdf"];
        timeline = [
          { event = "Dispute Filed";      timestamp = 1715000000000000000; performedBy = "buyer" },
          { event = "Evidence Submitted"; timestamp = 1715100000000000000; performedBy = "buyer" },
          { event = "Under Review";       timestamp = 1715200000000000000; performedBy = "mediator" },
        ];
        resolution = null;
      },
      {
        id = 2; orderId = 2; status = #Resolved;
        evidence = ["weight_certificate.pdf", "quality_report.pdf"];
        timeline = [
          { event = "Dispute Filed";           timestamp = 1714000000000000000; performedBy = "buyer" },
          { event = "Seller Responded";        timestamp = 1714100000000000000; performedBy = "seller" },
          { event = "Mediation Scheduled";     timestamp = 1714200000000000000; performedBy = "mediator" },
          { event = "Resolved Partial Refund"; timestamp = 1714400000000000000; performedBy = "mediator" },
        ];
        resolution = ?"Partial refund of 450 issued. Seller agreed to re-ship 2kg replacement."
      },
    ];
    for (d in data.vals()) { disputeCases.add(d) };
  };

  // ── Planting Entries ──────────────────────────────────────────────────────

  public func getPlantingEntries(plantingEntries : List.List<Types.PlantingEntry>) : [Types.PlantingEntry] {
    plantingEntries.toArray()
  };

  public func seedPlantingEntries(plantingEntries : List.List<Types.PlantingEntry>) {
    let data : [Types.PlantingEntry] = [
      { id = 1; cropName = "Wheat HD-3086";      plantDate = 1699200000000000000; harvestDate = 1709424000000000000; notes = "20 acres, Amritsar. Timely sown. Apply urea top-dressing at CRI stage." },
      { id = 2; cropName = "Paddy Pusa 1121";    plantDate = 1686528000000000000; harvestDate = 1696752000000000000; notes = "15 acres, Ludhiana. Transplanted. Drain 2 weeks before harvest." },
      { id = 3; cropName = "Soybean JS-9305";    plantDate = 1688716800000000000; harvestDate = 1698854400000000000; notes = "10 acres, Indore. Kharif crop. Use rhizobium seed treatment." },
      { id = 4; cropName = "Tomato Varun F1";    plantDate = 1709424000000000000; harvestDate = 1717286400000000000; notes = "2 acres, Guntur. Staking required at 30cm height. Monitor for TLCV." },
      { id = 5; cropName = "Cotton MCU-5 Bt";    plantDate = 1683849600000000000; harvestDate = 1701302400000000000; notes = "25 acres, Hyderabad. Gap filling done. Expect 2 pickings." },
      { id = 6; cropName = "Cardamom Njallani";  plantDate = 1651363200000000000; harvestDate = 1724284800000000000; notes = "3 acres, Idukki. Perennial planting. Shade maintained at 50%." },
    ];
    for (p in data.vals()) { plantingEntries.add(p) };
  };

  // ── Market Prices ─────────────────────────────────────────────────────────

  public func getMarketPrices(marketPrices : List.List<Types.MarketPrice>) : [Types.MarketPrice] {
    marketPrices.toArray()
  };

  public func seedMarketPrices(marketPrices : List.List<Types.MarketPrice>) {
    let data : [Types.MarketPrice] = [
      { id = 1;  crop = "Tomato";    region = "Delhi";     bidPrice = 2700.0;  askPrice = 2900.0;  date = 1716000000000000000 },
      { id = 2;  crop = "Tomato";    region = "Mumbai";    bidPrice = 2800.0;  askPrice = 3000.0;  date = 1716000000000000000 },
      { id = 3;  crop = "Wheat";     region = "Delhi";     bidPrice = 2150.0;  askPrice = 2250.0;  date = 1716000000000000000 },
      { id = 4;  crop = "Wheat";     region = "Chennai";   bidPrice = 2300.0;  askPrice = 2450.0;  date = 1716000000000000000 },
      { id = 5;  crop = "Onion";     region = "Mumbai";    bidPrice = 2950.0;  askPrice = 3200.0;  date = 1716000000000000000 },
      { id = 6;  crop = "Onion";     region = "Hyderabad"; bidPrice = 2800.0;  askPrice = 3050.0;  date = 1716000000000000000 },
      { id = 7;  crop = "Potato";    region = "Delhi";     bidPrice = 1350.0;  askPrice = 1500.0;  date = 1716000000000000000 },
      { id = 8;  crop = "Potato";    region = "Hyderabad"; bidPrice = 1500.0;  askPrice = 1650.0;  date = 1716000000000000000 },
      { id = 9;  crop = "Soybean";   region = "Mumbai";    bidPrice = 4100.0;  askPrice = 4300.0;  date = 1716000000000000000 },
      { id = 10; crop = "Soybean";   region = "Chennai";   bidPrice = 4250.0;  askPrice = 4450.0;  date = 1716000000000000000 },
      { id = 11; crop = "Cotton";    region = "Hyderabad"; bidPrice = 6200.0;  askPrice = 6500.0;  date = 1716000000000000000 },
      { id = 12; crop = "Rice";      region = "Chennai";   bidPrice = 3500.0;  askPrice = 3750.0;  date = 1716000000000000000 },
    ];
    for (m in data.vals()) { marketPrices.add(m) };
  };

  // ── Equipment Guides ──────────────────────────────────────────────────────

  public func getEquipmentGuides(equipmentGuides : List.List<Types.EquipmentGuide>) : [Types.EquipmentGuide] {
    equipmentGuides.toArray()
  };

  public func seedEquipmentGuides(equipmentGuides : List.List<Types.EquipmentGuide>) {
    let data : [Types.EquipmentGuide] = [
      {
        id = 1; equipmentName = "Mahindra Arjun 605 Tractor";
        maintenanceLog = [
          { date = 1712000000000000000; description = "Engine oil change 15W-40 6L";  technician = "Ravi Mechanic Ludhiana" },
          { date = 1714000000000000000; description = "Air filter replacement";         technician = "Ravi Mechanic Ludhiana" },
          { date = 1715500000000000000; description = "Hydraulic oil top-up";          technician = "Dealer Service Center" },
        ];
        compatibility = ["Rotavator 65-80HP", "MB Plough 3-Furrow", "Disc Harrow 28-disc", "Paddy Transplanter 6-row"];
      },
      {
        id = 2; equipmentName = "Boom Sprayer 600L Tractor Mounted";
        maintenanceLog = [
          { date = 1713000000000000000; description = "Nozzle set replaced flat fan 110 deg"; technician = "Agro Service Pvt Ltd" },
          { date = 1715000000000000000; description = "Pump seal kit replaced";               technician = "Agro Service Pvt Ltd" },
        ];
        compatibility = ["45-80 HP tractors", "Cotton 12m boom", "Soybean 12m boom", "Wheat 12m boom", "Orchard 6m boom"];
      },
      {
        id = 3; equipmentName = "Kubota DC-68 Paddy Combine Harvester";
        maintenanceLog = [
          { date = 1711000000000000000; description = "Threshing cylinder bars replaced";   technician = "Kubota Dealer Bhubaneswar" },
          { date = 1714500000000000000; description = "Concave clearance adjusted 14mm";    technician = "Kubota Dealer Bhubaneswar" },
          { date = 1715800000000000000; description = "Annual pre-season service done";     technician = "Kubota Dealer Bhubaneswar" },
        ];
        compatibility = ["Paddy all varieties", "Wheat", "Soybean", "Recommended field size above 2 acres"];
      },
    ];
    for (e in data.vals()) { equipmentGuides.add(e) };
  };

  // ── Forum Posts ───────────────────────────────────────────────────────────

  public func getForumPosts(forumPosts : List.List<Types.ForumPost>) : [Types.ForumPost] {
    forumPosts.toArray()
  };

  public func addForumPost(
    forumPosts : List.List<Types.ForumPost>,
    nextId : Nat,
    author : Text,
    title : Text,
    body : Text,
  ) : Types.ForumPost {
    let post : Types.ForumPost = {
      id = nextId;
      author = author;
      title = title;
      body = body;
      replies = [];
      upvotes = 0;
    };
    forumPosts.add(post);
    post
  };

  public func seedForumPosts(forumPosts : List.List<Types.ForumPost>) {
    let data : [Types.ForumPost] = [
      {
        id = 1; author = "Dr. Neha Trivedi"; upvotes = 48;
        title = "Getting started with organic farming: a step-by-step guide";
        body = "Transitioning to organic farming is a 3-year process. Start by obtaining NPOP certification from an accredited agency. Key inputs: vermicompost 4t/acre, neem cake 200kg/acre, and bio-pesticides. Avoid synthetic fertilisers during the conversion period.";
        replies = [
          { author = "Rajan Kumar";  body = "Thanks! Is APOF or Control Union better for small farms in Punjab?";                             timestamp = 1715100000000000000 },
          { author = "Kavitha Nair"; body = "We went with IMO Control - they have Hindi-speaking auditors and are affordable for under 5 acres."; timestamp = 1715200000000000000 },
        ];
      },
      {
        id = 2; author = "Dr. Priya Sekharan"; upvotes = 62;
        title = "Integrated Pest Management IPM for Kharif crops practical guide";
        body = "IPM combines cultural, biological, and chemical controls. Step 1: pheromone traps at 5/acre for FAW monitoring. Step 2: release Trichogramma egg parasitoids 50000/acre weekly. Step 3: use HaNPV spray only if larval count exceeds 2/plant. Chemical: chlorantraniliprole as last resort.";
        replies = [
          { author = "Lakshmi Rao";        body = "Trichogramma really works for bollworm in cotton too. We reduced chemical sprays by 60%."; timestamp = 1715300000000000000 },
          { author = "Harpreet Singh";     body = "Where to get HaNPV in Punjab? Local agro shops do not stock it.";                        timestamp = 1715400000000000000 },
          { author = "Dr. Priya Sekharan"; body = "NBAII Bangalore ships directly. Also available on Amazon Agro. Search Helicide.";          timestamp = 1715500000000000000 },
        ];
      },
      {
        id = 3; author = "Er. Ravi Naidu"; upvotes = 35;
        title = "Drip irrigation for vegetables ROI calculation for small farms";
        body = "Drip system costs 30000-50000/acre upfront. Government subsidy 50-90% depending on state. Water savings: 40-60% vs flood irrigation. Yield increase: 20-30%. Break-even typically in 2 seasons. PM Krishi Sinchayee Yojna covers micro-irrigation subsidy.";
        replies = [
          { author = "Ramesh Yadav"; body = "UP gives 90% subsidy for SC farmers. I got my 1-acre kit for just 3500 out of pocket."; timestamp = 1715600000000000000 },
          { author = "Sunita Gupta"; body = "MP subsidy is 55% for general category. Apply through the e-Krishi portal.";            timestamp = 1715700000000000000 },
        ];
      },
      {
        id = 4; author = "Dr. Arun Mehta"; upvotes = 41;
        title = "Soil testing 101: how to read your soil report and take action";
        body = "A standard soil test covers pH, N, P, K, organic carbon, and micronutrients. pH 6-7 is ideal for most crops. Low OC below 0.5% is common in Indian soils - apply FYM 5t/acre annually. Sulfur deficiency is rising in Punjab wheat - use gypsum 100-150kg/acre.";
        replies = [
          { author = "Mohan Das";    body = "ICAR-NAAS has free soil testing labs in all state capitals. Results in 3 working days.";               timestamp = 1715800000000000000 },
          { author = "Geeta Kumari"; body = "My soil had pH 8.2 too alkaline. Used gypsum plus acidic FYM and it dropped to 7.1 in one season."; timestamp = 1715900000000000000 },
        ];
      },
      {
        id = 5; author = "Suresh Patel"; upvotes = 29;
        title = "Crop rotation planning for maximising soil health and profitability";
        body = "A 3-year rotation for North India: Year 1 Kharif Maize Rabi Wheat. Year 2 Kharif Soybean nitrogen fixer Rabi Mustard. Year 3 Kharif Paddy Rabi Lentil. Soybean in rotation reduces wheat urea requirement by 25-30%.";
        replies = [
          { author = "Harpreet Singh"; body = "In Punjab the paddy-wheat rotation is hard to break because of MSP, but soybean in at least 20% area helps.";            timestamp = 1716000000000000000 },
          { author = "Vijay Patil";    body = "In Maharashtra sugarcane-onion rotation is popular. Sugarcane residue as mulch saves irrigation water for onion.";       timestamp = 1716100000000000000 },
          { author = "Dr. Arun Mehta"; body = "Correct - legume rotation can save 30-40kg urea/acre in the following rabi season. Documented in IARI trials."; timestamp = 1716200000000000000 },
        ];
      },
      {
        id = 6; author = "CA Suresh Jha"; upvotes = 57;
        title = "Understanding mandi prices vs MSP: a farmer guide to selling smart";
        body = "MSP is a floor price guaranteed by the government; mandi prices fluctuate with supply and demand. When mandi price is above MSP, sell in mandi. When mandi price is below MSP, use PMPS scheme. eNAM portal allows inter-mandi price discovery. FPO aggregation of 50 plus tonnes typically gets 5-8% premium.";
        replies = [
          { author = "Ramesh Yadav"; body = "eNAM is good but requires FSSAI registration for food grains. Did anyone find a workaround?";          timestamp = 1716300000000000000 },
          { author = "CA Suresh Jha"; body = "No workaround - FSSAI registration is mandatory for eNAM. It is free and takes 7 working days online."; timestamp = 1716400000000000000 },
        ];
      },
    ];
    for (p in data.vals()) { forumPosts.add(p) };
  };
};

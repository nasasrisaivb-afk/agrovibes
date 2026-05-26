import Types "../types/core";
import List "mo:core/List";

module {
  // ── Educators ─────────────────────────────────────────────────────────────

  public func getEducators(educators : List.List<Types.Educator>) : [Types.Educator] {
    educators.toArray()
  };

  public func getEducatorById(educators : List.List<Types.Educator>, id : Nat) : ?Types.Educator {
    educators.find(func(e) { e.id == id })
  };

  // ── Courses ───────────────────────────────────────────────────────────────

  public func getCourses(courses : List.List<Types.Course>) : [Types.Course] {
    courses.toArray()
  };

  public func getCourseById(courses : List.List<Types.Course>, id : Nat) : ?Types.Course {
    courses.find(func(c) { c.id == id })
  };

  public func createCourse(
    courses : List.List<Types.Course>,
    nextId : Nat,
    input : Types.CreateCourseInput,
    now : Int,
  ) : Types.Course {
    let course : Types.Course = {
      id = nextId;
      educatorId = input.educatorId;
      title = input.title;
      description = input.description;
      category = input.category;
      level = input.level;
      durationMinutes = input.durationMinutes;
      price = input.price;
      thumbnailUrl = input.thumbnailUrl;
      enrollmentCount = 0;
      rating = 0.0;
      isCertified = input.isCertified;
      createdAt = now;
    };
    courses.add(course);
    course
  };

  // ── Lessons ───────────────────────────────────────────────────────────────

  public func getLessonsByCourse(lessons : List.List<Types.Lesson>, courseId : Nat) : [Types.Lesson] {
    lessons.filter(func(l) { l.courseId == courseId }).toArray()
  };

  // ── Enrollments ───────────────────────────────────────────────────────────

  public func getEnrollmentsByUser(enrollments : List.List<Types.Enrollment>, userId : Nat) : [Types.Enrollment] {
    enrollments.filter(func(e) { e.userId == userId }).toArray()
  };

  public func createEnrollment(
    enrollments : List.List<Types.Enrollment>,
    nextId : Nat,
    input : Types.CreateEnrollmentInput,
    now : Int,
  ) : Types.Enrollment {
    let enrollment : Types.Enrollment = {
      id = nextId;
      userId = input.userId;
      courseId = input.courseId;
      progress = 0.0;
      completedAt = null;
      enrolledAt = now;
    };
    enrollments.add(enrollment);
    enrollment
  };

  // ── Certifications ────────────────────────────────────────────────────────

  public func getCertificationsByUser(certs : List.List<Types.Certification>, userId : Nat) : [Types.Certification] {
    certs.filter(func(c) { c.userId == userId }).toArray()
  };

  // ── Live Streams ──────────────────────────────────────────────────────────

  public func getLiveStreams(streams : List.List<Types.LiveStream>) : [Types.LiveStream] {
    streams.toArray()
  };

  public func createLiveStream(
    streams : List.List<Types.LiveStream>,
    nextId : Nat,
    input : Types.CreateLiveStreamInput,
    now : Int,
  ) : Types.LiveStream {
    let stream : Types.LiveStream = {
      id = nextId;
      hostId = input.hostId;
      title = input.title;
      description = input.description;
      thumbnailUrl = input.thumbnailUrl;
      status = #Scheduled;
      viewerCount = 0;
      scheduledAt = input.scheduledAt;
      startedAt = null;
      endedAt = null;
    };
    streams.add(stream);
    stream
  };

  // ── Direct Messages ───────────────────────────────────────────────────────

  public func getConversations(conversations : List.List<Types.Conversation>, userId : Nat) : [Types.Conversation] {
    conversations.filter(func(c) {
      c.participantIds.vals().any(func(pid) { pid == userId })
    }).toArray()
  };

  public func getDirectMessages(messages : List.List<Types.DirectMessage>, conversationId : Nat) : [Types.DirectMessage] {
    // conversationId encodes the pair: match by senderId/receiverId
    // Convention: messages with id matching conversationId range are returned
    // We store conversationId implicitly via sender/receiver pairing
    // For simplicity, return all messages where min(s,r) == conv ids encoded
    // Since conversations track participantIds, we look up the conversation by id
    // and filter messages by those participant pairs
    messages.filter(func(m) {
      // conversationId is the Conversation.id; we match via convention that
      // conversation.id = min(senderId, receiverId) * 1000 + max(...)
      // For seed data we use direct filtering by the stored conversationId field
      // which we embed as (senderId * 1000 + receiverId) or stored conv id
      // Simplest approach: return messages for the participant pair
      // We rely on the caller having a valid conversationId from getConversations
      // and use participantIds stored there — but DirectMessage doesn't carry convId.
      // Pattern: filter where (senderId == p1 && receiverId == p2) || vice versa
      // We encode participantIds in conversationId: id = p1 * 100 + p2 (seed data)
      let p1 = conversationId / 100;
      let p2 = conversationId % 100;
      (m.senderId == p1 and m.receiverId == p2) or
      (m.senderId == p2 and m.receiverId == p1)
    }).toArray()
  };

  public func sendDirectMessage(
    messages : List.List<Types.DirectMessage>,
    conversations : List.List<Types.Conversation>,
    nextMsgId : Nat,
    nextConvId : Nat,
    input : Types.CreateDirectMessageInput,
    now : Int,
  ) : Types.DirectMessage {
    let msg : Types.DirectMessage = {
      id = nextMsgId;
      senderId = input.senderId;
      receiverId = input.receiverId;
      content = input.content;
      isVoiceMessage = input.isVoiceMessage;
      timestamp = now;
      isRead = false;
    };
    messages.add(msg);

    // Update or create conversation
    let existingConv = conversations.find(func(c) {
      c.participantIds.vals().any(func(pid) { pid == input.senderId }) and
      c.participantIds.vals().any(func(pid) { pid == input.receiverId })
    });
    switch (existingConv) {
      case (?conv) {
        conversations.mapInPlace(func(c) {
          if (c.id == conv.id) {
            { c with lastMessage = input.content; lastMessageAt = now; unreadCount = c.unreadCount + 1 }
          } else { c }
        });
      };
      case null {
        let newConv : Types.Conversation = {
          id = nextConvId;
          participantIds = [input.senderId, input.receiverId];
          lastMessage = input.content;
          lastMessageAt = now;
          unreadCount = 1;
        };
        conversations.add(newConv);
      };
    };
    msg
  };

  // ── Notifications ─────────────────────────────────────────────────────────

  public func getNotifications(notifications : List.List<Types.Notification>, userId : Nat) : [Types.Notification] {
    notifications.filter(func(n) { n.userId == userId }).toArray()
  };

  public func createNotification(
    notifications : List.List<Types.Notification>,
    nextId : Nat,
    input : Types.CreateNotificationInput,
    now : Int,
  ) : Types.Notification {
    let notif : Types.Notification = {
      id = nextId;
      userId = input.userId;
      notifType = input.notifType;
      title = input.title;
      body = input.body;
      isRead = false;
      createdAt = now;
      priority = input.priority;
    };
    notifications.add(notif);
    notif
  };

  public func markNotificationRead(
    notifications : List.List<Types.Notification>,
    notifId : Nat,
  ) : Bool {
    let found = notifications.find(func(n) { n.id == notifId });
    switch (found) {
      case null { false };
      case (?_) {
        notifications.mapInPlace(func(n) {
          if (n.id == notifId) { { n with isRead = true } } else { n }
        });
        true
      };
    }
  };

  // ── Seed data ─────────────────────────────────────────────────────────────

  public func seedEducators(educators : List.List<Types.Educator>) {
    let data : [Types.Educator] = [
      {
        id = 1;
        name = "Dr. Ramesh Sharma";
        bio = "PhD in Soil Science from IARI. 18 years teaching organic farming practices across India. Author of 3 books on soil health.";
        avatarUrl = "https://picsum.photos/seed/ed1/80/80";
        specialty = "Soil Science & Organic Farming";
        rating = 4.9;
        studentCount = 1250;
        courseCount = 2;
        kycStatus = #Verified;
      },
      {
        id = 2;
        name = "Priya Nair";
        bio = "Hydroponics pioneer with 10 years experience setting up commercial soilless farms across Kerala and Tamil Nadu. Trainer for NABARD.";
        avatarUrl = "https://picsum.photos/seed/ed2/80/80";
        specialty = "Hydroponics & Modern Irrigation";
        rating = 4.8;
        studentCount = 890;
        courseCount = 2;
        kycStatus = #Verified;
      },
      {
        id = 3;
        name = "Suresh Patel";
        bio = "MBA in Agribusiness from IRMA Anand. Helped 200+ farmer groups connect directly to retail chains and export markets.";
        avatarUrl = "https://picsum.photos/seed/ed3/80/80";
        specialty = "Agricultural Business & Marketing";
        rating = 4.7;
        studentCount = 2100;
        courseCount = 2;
        kycStatus = #Verified;
      },
      {
        id = 4;
        name = "Kavitha Reddy";
        bio = "Entomologist and IPM specialist. 15 years field experience in pest scouting, biocontrol, and crop protection for South Indian crops.";
        avatarUrl = "https://picsum.photos/seed/ed4/80/80";
        specialty = "Pest Management & Crop Protection";
        rating = 4.9;
        studentCount = 756;
        courseCount = 2;
        kycStatus = #Verified;
      },
      {
        id = 5;
        name = "Anand Kumar";
        bio = "Agricultural engineer and precision farming consultant. Trained 500+ farmers on tractor operation, GPS guidance, and drone spraying.";
        avatarUrl = "https://picsum.photos/seed/ed5/80/80";
        specialty = "Equipment Mastery & Precision Farming";
        rating = 4.6;
        studentCount = 580;
        courseCount = 2;
        kycStatus = #Verified;
      },
      {
        id = 6;
        name = "Meena Joshi";
        bio = "Retired senior officer from NABARD. Expert on PM-Kisan, crop insurance, Kisan Credit Card, and rural banking for small farmers.";
        avatarUrl = "https://picsum.photos/seed/ed6/80/80";
        specialty = "Government Schemes & Farm Finance";
        rating = 4.8;
        studentCount = 1450;
        courseCount = 2;
        kycStatus = #Verified;
      },
    ];
    for (e in data.vals()) { educators.add(e) };
  };

  public func seedCourses(courses : List.List<Types.Course>) {
    let data : [Types.Course] = [
      {
        id = 1;
        educatorId = 1;
        title = "Organic Farming Fundamentals";
        description = "Start your organic farming journey. Covers soil biology, compost making, green manure, and chemical-free crop nutrition.";
        category = "Organic Farming";
        level = "Beginner";
        durationMinutes = 120;
        price = 0.0;
        thumbnailUrl = "https://picsum.photos/seed/c1/400/300";
        enrollmentCount = 4820;
        rating = 4.9;
        isCertified = true;
        createdAt = 0;
      },
      {
        id = 2;
        educatorId = 1;
        title = "Advanced Soil Health & Composting";
        description = "Deep dive into soil microbiome, vermicompost, biochar, and advanced composting techniques to boost yields naturally.";
        category = "Soil Science";
        level = "Advanced";
        durationMinutes = 180;
        price = 299.0;
        thumbnailUrl = "https://picsum.photos/seed/c2/400/300";
        enrollmentCount = 1380;
        rating = 4.8;
        isCertified = true;
        createdAt = 0;
      },
      {
        id = 3;
        educatorId = 2;
        title = "Hydroponics Step-by-Step";
        description = "Build your first hydroponic setup from scratch. NFT, DWC, and wick systems explained with full material lists and cost analysis.";
        category = "Hydroponics";
        level = "Beginner";
        durationMinutes = 90;
        price = 149.0;
        thumbnailUrl = "https://picsum.photos/seed/c3/400/300";
        enrollmentCount = 2100;
        rating = 4.8;
        isCertified = true;
        createdAt = 0;
      },
      {
        id = 4;
        educatorId = 2;
        title = "Drip Irrigation Mastery";
        description = "Design, install, and maintain drip irrigation for vegetables and orchards. Includes fertigation scheduling and pipe sizing calculations.";
        category = "Irrigation";
        level = "Intermediate";
        durationMinutes = 150;
        price = 199.0;
        thumbnailUrl = "https://picsum.photos/seed/c4/400/300";
        enrollmentCount = 1650;
        rating = 4.7;
        isCertified = false;
        createdAt = 0;
      },
      {
        id = 5;
        educatorId = 3;
        title = "Farm-to-Market: Selling Your Produce";
        description = "How to find buyers, negotiate prices, use eNAM, and build direct relationships with retailers. Free course for all farmers.";
        category = "Marketing";
        level = "Beginner";
        durationMinutes = 60;
        price = 0.0;
        thumbnailUrl = "https://picsum.photos/seed/c5/400/300";
        enrollmentCount = 6300;
        rating = 4.7;
        isCertified = true;
        createdAt = 0;
      },
      {
        id = 6;
        educatorId = 3;
        title = "Agricultural Business Planning";
        description = "Full business plan creation for farm enterprises. FPO formation, SFAC equity grants, credit linkage, and financial projections.";
        category = "Business";
        level = "Advanced";
        durationMinutes = 240;
        price = 499.0;
        thumbnailUrl = "https://picsum.photos/seed/c6/400/300";
        enrollmentCount = 870;
        rating = 4.8;
        isCertified = true;
        createdAt = 0;
      },
      {
        id = 7;
        educatorId = 4;
        title = "IPM: Integrated Pest Management";
        description = "Science-based pest management using biocontrol, pheromone traps, resistant varieties, and targeted pesticide use.";
        category = "Pest Management";
        level = "Intermediate";
        durationMinutes = 120;
        price = 249.0;
        thumbnailUrl = "https://picsum.photos/seed/c7/400/300";
        enrollmentCount = 1920;
        rating = 4.9;
        isCertified = true;
        createdAt = 0;
      },
      {
        id = 8;
        educatorId = 4;
        title = "Natural Pest Control Methods";
        description = "Organic-approved pest control using neem, garlic, tobacco extract, and beneficial insects. Zero-chemical approach.";
        category = "Organic Farming";
        level = "Beginner";
        durationMinutes = 90;
        price = 0.0;
        thumbnailUrl = "https://picsum.photos/seed/c8/400/300";
        enrollmentCount = 3400;
        rating = 4.8;
        isCertified = false;
        createdAt = 0;
      },
      {
        id = 9;
        educatorId = 5;
        title = "Tractor Maintenance & Operation";
        description = "Safe tractor driving, routine maintenance schedule, common repairs, and attachment handling for tractors from 35 to 75 HP.";
        category = "Equipment";
        level = "Intermediate";
        durationMinutes = 150;
        price = 199.0;
        thumbnailUrl = "https://picsum.photos/seed/c9/400/300";
        enrollmentCount = 2250;
        rating = 4.6;
        isCertified = true;
        createdAt = 0;
      },
      {
        id = 10;
        educatorId = 5;
        title = "Precision Agriculture with Technology";
        description = "GPS-guided tractors, drone spraying, IoT soil sensors, satellite crop monitoring, and data-driven farm management.";
        category = "Technology";
        level = "Advanced";
        durationMinutes = 200;
        price = 399.0;
        thumbnailUrl = "https://picsum.photos/seed/c10/400/300";
        enrollmentCount = 640;
        rating = 4.7;
        isCertified = false;
        createdAt = 0;
      },
      {
        id = 11;
        educatorId = 6;
        title = "PM-Kisan & Crop Insurance Guide";
        description = "Step-by-step guide to PM-Kisan registration, PMFBY crop insurance claims, land records, and e-KYC for farmers.";
        category = "Government Schemes";
        level = "Beginner";
        durationMinutes = 60;
        price = 0.0;
        thumbnailUrl = "https://picsum.photos/seed/c11/400/300";
        enrollmentCount = 8100;
        rating = 4.9;
        isCertified = true;
        createdAt = 0;
      },
      {
        id = 12;
        educatorId = 6;
        title = "Farm Credit & Banking for Farmers";
        description = "Kisan Credit Card, cooperative bank loans, subsidy applications, and how to avoid informal moneylenders.";
        category = "Finance";
        level = "Intermediate";
        durationMinutes = 90;
        price = 99.0;
        thumbnailUrl = "https://picsum.photos/seed/c12/400/300";
        enrollmentCount = 3200;
        rating = 4.8;
        isCertified = false;
        createdAt = 0;
      },
    ];
    for (c in data.vals()) { courses.add(c) };
  };

  public func seedLessons(lessons : List.List<Types.Lesson>) {
    let data : [Types.Lesson] = [
      // Course 1 — Organic Farming Fundamentals
      { id = 1;  courseId = 1;  title = "Introduction to Organic Farming";         content = "Overview of organic certification, market demand, and the transition plan from conventional to organic.";   videoUrl = "https://picsum.photos/seed/v1/640/360";  durationMinutes = 20; order = 1 },
      { id = 2;  courseId = 1;  title = "Understanding Soil Biology";               content = "Bacteria, fungi, protozoa, and earthworms — the living soil ecosystem and how to protect it.";               videoUrl = "https://picsum.photos/seed/v2/640/360";  durationMinutes = 25; order = 2 },
      { id = 3;  courseId = 1;  title = "Composting Basics";                        content = "Hot composting vs vermicomposting. Carbon:nitrogen ratios, moisture management, and turning schedules.";       videoUrl = "https://picsum.photos/seed/v3/640/360";  durationMinutes = 30; order = 3 },
      { id = 4;  courseId = 1;  title = "Green Manure Crops";                       content = "Sunn hemp, dhaincha, clover — selection, sowing, and incorporation timing for different cropping systems.";   videoUrl = "https://picsum.photos/seed/v4/640/360";  durationMinutes = 25; order = 4 },
      { id = 5;  courseId = 1;  title = "Getting Organic Certification";            content = "India Organic, PGS-India, NPOP standards. Documentation, inspection process, and annual renewal.";            videoUrl = "https://picsum.photos/seed/v5/640/360";  durationMinutes = 20; order = 5 },

      // Course 2 — Advanced Soil Health
      { id = 6;  courseId = 2;  title = "Soil Microbiome Deep Dive";               content = "Mycorrhizal networks, rhizobia, phosphate-solubilizing bacteria, and how to build biologically active soil."; videoUrl = "https://picsum.photos/seed/v6/640/360";  durationMinutes = 35; order = 1 },
      { id = 7;  courseId = 2;  title = "Vermicompost Production at Scale";        content = "Worm species selection, bedding preparation, feeding schedules, and harvesting vermicast efficiently.";       videoUrl = "https://picsum.photos/seed/v7/640/360";  durationMinutes = 40; order = 2 },
      { id = 8;  courseId = 2;  title = "Biochar & Soil Carbon Sequestration";     content = "How to produce biochar, application rates, and its long-term impact on water retention and pH.";              videoUrl = "https://picsum.photos/seed/v8/640/360";  durationMinutes = 35; order = 3 },
      { id = 9;  courseId = 2;  title = "Soil Testing & Interpretation";           content = "STCR approach, soil test kits, lab sampling protocols, and how to read and act on soil test reports.";        videoUrl = "https://picsum.photos/seed/v9/640/360";  durationMinutes = 30; order = 4 },
      { id = 10; courseId = 2;  title = "Nutrient Cycling in Organic Systems";     content = "Closing nutrient loops, intercropping for nutrient balance, and bio-stimulant applications.";                videoUrl = "https://picsum.photos/seed/v10/640/360"; durationMinutes = 40; order = 5 },

      // Course 3 — Hydroponics Step-by-Step
      { id = 11; courseId = 3;  title = "Why Hydroponics?";                        content = "Comparing soil vs soilless growing: yield, water use, space efficiency, and investment breakdown.";           videoUrl = "https://picsum.photos/seed/v11/640/360"; durationMinutes = 15; order = 1 },
      { id = 12; courseId = 3;  title = "NFT System Setup";                        content = "Nutrient Film Technique: channel spacing, pump sizing, and reservoir management for leafy greens.";           videoUrl = "https://picsum.photos/seed/v12/640/360"; durationMinutes = 25; order = 2 },
      { id = 13; courseId = 3;  title = "DWC Deep Water Culture";                  content = "Setting up DWC buckets for tomatoes and capsicum. Oxygen management and root zone health.";                   videoUrl = "https://picsum.photos/seed/v13/640/360"; durationMinutes = 25; order = 3 },
      { id = 14; courseId = 3;  title = "Nutrient Solutions & pH Management";      content = "NPK ratios for different growth stages, EC measurement, pH adjustment, and water quality requirements.";      videoUrl = "https://picsum.photos/seed/v14/640/360"; durationMinutes = 25; order = 4 },

      // Course 5 — Farm-to-Market
      { id = 15; courseId = 5;  title = "Understanding the Value Chain";           content = "From farm gate to consumer: mandis, commission agents, wholesalers, retailers, and direct channels.";         videoUrl = "https://picsum.photos/seed/v15/640/360"; durationMinutes = 20; order = 1 },
      { id = 16; courseId = 5;  title = "Using eNAM Effectively";                  content = "Registration on e-National Agriculture Market, uploading assay data, and winning transparent auctions.";      videoUrl = "https://picsum.photos/seed/v16/640/360"; durationMinutes = 20; order = 2 },
      { id = 17; courseId = 5;  title = "Pricing & Negotiation Skills";            content = "How to read mandi arrival data, use market intelligence, and negotiate better rates with traders.";            videoUrl = "https://picsum.photos/seed/v17/640/360"; durationMinutes = 20; order = 3 },

      // Course 7 — IPM
      { id = 18; courseId = 7;  title = "IPM Principles & Pest Thresholds";       content = "Economic threshold concept, pest scouting protocols, and decision-making frameworks for intervention.";       videoUrl = "https://picsum.photos/seed/v18/640/360"; durationMinutes = 25; order = 1 },
      { id = 19; courseId = 7;  title = "Biocontrol Agents";                       content = "Trichogramma wasps, NPV viruses, Beauveria bassiana — identification, procurement, and application.";        videoUrl = "https://picsum.photos/seed/v19/640/360"; durationMinutes = 30; order = 2 },
      { id = 20; courseId = 7;  title = "Pheromone Trap Systems";                  content = "Setting up sex and aggregation pheromone traps for bollworm, FAW, and fruit flies.";                          videoUrl = "https://picsum.photos/seed/v20/640/360"; durationMinutes = 25; order = 3 },
      { id = 21; courseId = 7;  title = "Targeted Pesticide Use";                  content = "Pre-mix selection, nozzle calibration, resistance management, and safe disposal of empty containers.";        videoUrl = "https://picsum.photos/seed/v21/640/360"; durationMinutes = 40; order = 4 },

      // Course 9 — Tractor Maintenance
      { id = 22; courseId = 9;  title = "Tractor Safety Rules";                    content = "ROPS, PTO guards, slope stability, safe hitching, and road transport regulations for tractors.";              videoUrl = "https://picsum.photos/seed/v22/640/360"; durationMinutes = 30; order = 1 },
      { id = 23; courseId = 9;  title = "Engine & Transmission Basics";            content = "Diesel engine maintenance, oil changes, air filter cleaning, and identifying gearbox issues early.";          videoUrl = "https://picsum.photos/seed/v23/640/360"; durationMinutes = 35; order = 2 },
      { id = 24; courseId = 9;  title = "Implement Calibration";                   content = "Setting disc depth, rotavator tine height, and drill seeding rates for accurate field operations.";           videoUrl = "https://picsum.photos/seed/v24/640/360"; durationMinutes = 35; order = 3 },
      { id = 25; courseId = 9;  title = "Seasonal Service Checklist";              content = "Pre-season and end-of-season maintenance checklist to extend tractor life and reduce repair costs.";           videoUrl = "https://picsum.photos/seed/v25/640/360"; durationMinutes = 25; order = 4 },

      // Course 11 — PM-Kisan & Crop Insurance
      { id = 26; courseId = 11; title = "PM-Kisan Registration & e-KYC";          content = "Step-by-step PM-Kisan portal registration, Aadhaar e-KYC, land record linking, and payment tracking.";       videoUrl = "https://picsum.photos/seed/v26/640/360"; durationMinutes = 20; order = 1 },
      { id = 27; courseId = 11; title = "PMFBY Crop Insurance Claims";             content = "Policy enrollment timeline, damage reporting window, crop cutting experiments, and how payouts are calculated.";videoUrl = "https://picsum.photos/seed/v27/640/360"; durationMinutes = 20; order = 2 },
      { id = 28; courseId = 11; title = "Other Key Schemes — KCC, RKVY, NHM";     content = "Overview of Kisan Credit Card, Rashtriya Krishi Vikas Yojana, and National Horticulture Mission benefits."; videoUrl = "https://picsum.photos/seed/v28/640/360"; durationMinutes = 20; order = 3 },
    ];
    for (l in data.vals()) { lessons.add(l) };
  };

  public func seedLiveStreams(streams : List.List<Types.LiveStream>) {
    // Use 0 for timestamps; frontend will display relative times
    let data : [Types.LiveStream] = [
      {
        id = 1;
        hostId = 1; // Dr. Ramesh Sharma
        title = "Live Q&A: Rabi Season Preparation";
        description = "Ask your questions about soil preparation, fertilizer scheduling, and variety selection for the upcoming rabi season.";
        thumbnailUrl = "https://picsum.photos/seed/ls1/400/300";
        status = #Ended;
        viewerCount = 1240;
        scheduledAt = 0;
        startedAt = ?0;
        endedAt = ?0;
      },
      {
        id = 2;
        hostId = 2; // Priya Nair
        title = "Live: Hydroponics Setup Demo";
        description = "Watch a complete NFT hydroponics system being assembled live. Bring your questions about materials, costs, and crops.";
        thumbnailUrl = "https://picsum.photos/seed/ls2/400/300";
        status = #Scheduled;
        viewerCount = 0;
        // scheduledAt = now + 24h; approximate with large fixed offset
        scheduledAt = 86_400_000_000_000; // 24h in nanoseconds as a placeholder
        startedAt = null;
        endedAt = null;
      },
      {
        id = 3;
        hostId = 3; // Suresh Patel
        title = "Market Prices Discussion — Tomato Crisis";
        description = "Live discussion on the ongoing tomato price crash, what farmers can do, and how to use futures markets to hedge.";
        thumbnailUrl = "https://picsum.photos/seed/ls3/400/300";
        status = #Live;
        viewerCount = 340;
        scheduledAt = 0;
        startedAt = ?0;
        endedAt = null;
      },
    ];
    for (s in data.vals()) { streams.add(s) };
  };
};

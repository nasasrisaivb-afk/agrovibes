// CropVibe MVP — development seed data.
//
// Local testing guide (Development environment only):
//   OTP:    every valid Indian mobile number accepts the fixed code 000000.
//           No real SMS is sent until MSG91 keys are wired (see .env.example).
//   Buyer:  phone 9000000001 (Anita Deshmukh, onboarded, no KYC)
//   Seller: phone 9000000002 (Ravi Kumar, KYC VERIFIED, bank verified,
//           3 published listings)
//   Seller: phone 9000000003 (Suresh Patil, KYC NONE — exercises the KYC
//           gating middleware on publish/checkout)
//   Admin:  admin@cropvibe.in / CropVibe@123 (employee login, separate path)
//   KYC simulation hooks: name the uploaded file with "blurry", "expired",
//   "fraud", "mismatch", "selfie-mismatch" or "review" to force the matching
//   provider outcome; any other file auto-approves.
//   Penny-drop hook: an account number ending in 0000 fails verification.
import Types "../types/core";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Sha256 "mo:sha2/Sha256";

module {
  // Config-driven business rules — single source, admin-editable at runtime.
  public func defaultConfig() : Types.AppConfig {
    {
      environment = #Development;
      kycCheckoutThresholdInr = 10_000;
      payoutHoldHours = 48; // T+2 days
      otpRateLimitMax = 3;
      otpRateLimitWindowSecs = 600; // 10 minutes
      otpExpirySecs = 300;
      kycMaxAttempts = 5;
      kycAttemptWindowHours = 72;
      kycAutoApproveThreshold = 0.85;
      kycPriorityHighBelow = 0.5;
      kycPriorityMediumBelow = 0.8;
      commissionBps = 500; // 5%
      sessionTtlHours = 168; // 7 days
    };
  };

  // NOTE: static salt is acceptable for the simulated employee directory
  // only; swap for per-user salts when a real identity provider is wired.
  public let passwordSalt : Text = "cropvibe-admin-salt-v1";

  public func hashPassword(password : Text) : Blob {
    Sha256.fromBlob(#sha256, (passwordSalt # ":" # password).encodeUtf8());
  };

  public func seedCategories(categories : Map.Map<Nat, Types.Category>) {
    let vegetables : Types.Category = {
      id = 1;
      name = "Vegetables";
      parentId = null;
      attributeSchema = [
        {
          key = "variety";
          fieldLabel = "Variety";
          fieldType = #TEXT;
          required = true;
          options = [];
          unit = null;
        },
        {
          key = "harvestDate";
          fieldLabel = "Harvest date";
          fieldType = #DATE;
          required = true;
          options = [];
          unit = null;
        },
        {
          key = "growingMethod";
          fieldLabel = "Growing method";
          fieldType = #SELECT;
          required = true;
          options = ["Organic", "Conventional", "Hydroponic"];
          unit = null;
        },
      ];
    };
    let grains : Types.Category = {
      id = 2;
      name = "Grains";
      parentId = null;
      attributeSchema = [
        {
          key = "variety";
          fieldLabel = "Variety";
          fieldType = #TEXT;
          required = true;
          options = [];
          unit = null;
        },
        {
          key = "moistureContent";
          fieldLabel = "Moisture content";
          fieldType = #NUMBER;
          required = true;
          options = [];
          unit = ?"%";
        },
        {
          key = "cropYear";
          fieldLabel = "Crop year";
          fieldType = #SELECT;
          required = false;
          options = ["2026", "2025", "2024"];
          unit = null;
        },
      ];
    };
    let inputs : Types.Category = {
      id = 3;
      name = "Farm Inputs";
      parentId = null;
      attributeSchema = [
        {
          key = "inputType";
          fieldLabel = "Input type";
          fieldType = #SELECT;
          required = true;
          options = ["Seeds", "Fertilizer", "Pesticide", "Tools"];
          unit = null;
        },
        {
          key = "brand";
          fieldLabel = "Brand";
          fieldType = #TEXT;
          required = false;
          options = [];
          unit = null;
        },
        {
          key = "expiryDate";
          fieldLabel = "Expiry date";
          fieldType = #DATE;
          required = false;
          options = [];
          unit = null;
        },
      ];
    };
    categories.add(1, vegetables);
    categories.add(2, grains);
    categories.add(3, inputs);
  };

  public func seedIfscDirectory(directory : Map.Map<Text, { bankName : Text; branch : Text }>) {
    directory.add("HDFC0000240", { bankName = "HDFC Bank"; branch = "Koramangala, Bengaluru" });
    directory.add("SBIN0000691", { bankName = "State Bank of India"; branch = "Connaught Place, New Delhi" });
    directory.add("ICIC0000104", { bankName = "ICICI Bank"; branch = "MG Road, Pune" });
    directory.add("PUNB0055000", { bankName = "Punjab National Bank"; branch = "Miller Ganj, Ludhiana" });
    directory.add("UTIB0000037", { bankName = "Axis Bank"; branch = "College Road, Nashik" });
    directory.add("KKBK0000958", { bankName = "Kotak Mahindra Bank"; branch = "Vijayawada Main" });
  };

  public func seedUsers(users : Map.Map<Nat, Types.User>, usersByPhone : Map.Map<Text, Nat>, now : Types.Timestamp) {
    let buyer : Types.User = {
      id = 1;
      phone = "9000000001";
      name = "Anita Deshmukh";
      roles = [#BUYER];
      kycStatus = #NONE;
      kycRejectionReason = null;
      deliveryLocation = ?"Pune, Maharashtra";
      businessType = null;
      primaryCategoryId = null;
      createdAt = now;
    };
    let verifiedSeller : Types.User = {
      id = 2;
      phone = "9000000002";
      name = "Ravi Kumar";
      roles = [#SELLER];
      kycStatus = #VERIFIED;
      kycRejectionReason = null;
      deliveryLocation = null;
      businessType = ?#INDIVIDUAL;
      primaryCategoryId = ?1;
      createdAt = now;
    };
    let unverifiedSeller : Types.User = {
      id = 3;
      phone = "9000000003";
      name = "Suresh Patil";
      roles = [#SELLER];
      kycStatus = #NONE;
      kycRejectionReason = null;
      deliveryLocation = null;
      businessType = ?#INDIVIDUAL;
      primaryCategoryId = ?2;
      createdAt = now;
    };
    users.add(1, buyer);
    users.add(2, verifiedSeller);
    users.add(3, unverifiedSeller);
    usersByPhone.add(buyer.phone, 1);
    usersByPhone.add(verifiedSeller.phone, 2);
    usersByPhone.add(unverifiedSeller.phone, 3);
  };

  public func seedAdmins(admins : Map.Map<Nat, Types.AdminUser>, adminsByEmail : Map.Map<Text, Nat>, now : Types.Timestamp) {
    let admin : Types.AdminUser = {
      id = 1;
      email = "admin@cropvibe.in";
      name = "Ops Admin";
      passwordHash = hashPassword("CropVibe@123");
      createdAt = now;
    };
    admins.add(1, admin);
    adminsByEmail.add(admin.email, 1);
  };

  public func seedKycDocuments(kycDocuments : Map.Map<Nat, Types.KycDocument>, now : Types.Timestamp) {
    // Ravi's approved verification — history row for the admin queue filter.
    let doc : Types.KycDocument = {
      id = 1;
      userId = 2;
      docType = #AADHAAR;
      fileUrl = "seed://ravi-aadhaar.jpg";
      selfieUrl = ?"seed://ravi-selfie.jpg";
      status = #VERIFIED;
      confidenceScore = ?0.97;
      rejectionReason = null;
      reviewedBy = null; // auto-approved by provider confidence
      reviewedAt = ?now;
      attemptNumber = 1;
      isLatest = true;
      submittedAt = now;
    };
    kycDocuments.add(1, doc);
  };

  public func seedBankAccounts(bankAccounts : Map.Map<Nat, Types.BankAccount>, now : Types.Timestamp) {
    let account : Types.BankAccount = {
      id = 1;
      userId = 2;
      ifsc = "HDFC0000240";
      bankName = "HDFC Bank";
      branch = "Koramangala, Bengaluru";
      accountNumberLast4 = "4321";
      accountHolderName = "Ravi Kumar";
      providerToken = "fa_sim_seed_0001";
      verificationStatus = #VERIFIED;
      createdAt = now;
    };
    bankAccounts.add(1, account);
  };

  public func seedListings(listings : Map.Map<Nat, Types.Listing>, now : Types.Timestamp) {
    let tomato : Types.Listing = {
      id = 1;
      sellerId = 2;
      categoryId = 1;
      title = "Fresh Nashik Tomatoes (Grade A)";
      description = "Vine-ripened hybrid tomatoes, harvested this week. Firm, uniform size, ideal for retail and restaurants. Packed in 25kg crates.";
      priceInr = 28;
      quantity = 400;
      unit = "kg";
      status = #PUBLISHED;
      attributes = [("variety", "Abhinav Hybrid"), ("harvestDate", "2026-07-24"), ("growingMethod", "Conventional")];
      location = "Nashik, Maharashtra";
      images = [{
        url = "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80";
        order = 0;
        qualityFlag = null;
      }];
      moderationNote = null;
      createdAt = now;
      updatedAt = now;
    };
    let onion : Types.Listing = {
      id = 2;
      sellerId = 2;
      categoryId = 1;
      title = "Red Onions — Wholesale Lot";
      description = "Storage-grade red onions, sorted and graded 45mm+. Low moisture, suitable for 2-3 month storage. Minimum order 50kg.";
      priceInr = 22;
      quantity = 1200;
      unit = "kg";
      status = #PUBLISHED;
      attributes = [("variety", "Nashik Red"), ("harvestDate", "2026-07-10"), ("growingMethod", "Conventional")];
      location = "Lasalgaon, Maharashtra";
      images = [{
        url = "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=800&q=80";
        order = 0;
        qualityFlag = null;
      }];
      moderationNote = null;
      createdAt = now;
      updatedAt = now;
    };
    let wheat : Types.Listing = {
      id = 3;
      sellerId = 2;
      categoryId = 2;
      title = "Sharbati Wheat — Premium Quality";
      description = "MP Sharbati wheat, machine-cleaned, 11.5% protein. Golden sheen, ideal for chakki atta. Available in 50kg bags.";
      priceInr = 3200;
      quantity = 80;
      unit = "quintal";
      status = #PUBLISHED;
      attributes = [("variety", "Sharbati C-306"), ("moistureContent", "10.5"), ("cropYear", "2026")];
      location = "Sehore, Madhya Pradesh";
      images = [{
        url = "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80";
        order = 0;
        qualityFlag = null;
      }];
      moderationNote = null;
      createdAt = now;
      updatedAt = now;
    };
    listings.add(1, tomato);
    listings.add(2, onion);
    listings.add(3, wheat);
  };
};

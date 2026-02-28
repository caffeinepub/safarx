import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// No migration needed, can initialize new variables as needed
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Admin credentials for legacy principal-based auth
  var adminUsername : Text = "";
  var adminPassword : Text = "";
  var adminPrincipal : ?Principal = null;

  // ── User profile (required by instructions) ──────────────────────────────

  public type UserProfile = {
    displayName : Text;
    bio : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getProfileByPrincipal(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // ── Inquiries ─────────────────────────────────────────────────────────────

  type Inquiry = {
    id : Text;
    name : Text;
    email : Text;
    destination : Text;
    message : Text;
    phone : Text;
    timestamp : Time.Time;
  };

  module Inquiry {
    public func compare(inquiry1 : Inquiry, inquiry2 : Inquiry) : Order.Order {
      Text.compare(inquiry1.destination, inquiry2.destination);
    };
  };

  let inquiries = Map.empty<Text, Inquiry>();
  var nextInquiryId = 0;

  public shared ({ caller }) func submitInquiry(
    name : Text,
    email : Text,
    destination : Text,
    message : Text,
    phone : Text,
  ) : async () {
    let id = nextInquiryId.toText();
    let inquiry : Inquiry = {
      id;
      name;
      email;
      destination;
      message;
      phone;
      timestamp = Time.now();
    };
    inquiries.add(id, inquiry);
    nextInquiryId += 1;
  };

  public query ({ caller }) func getInquiry(id : Text) : async Inquiry {
    if (not (isLegacyAdmin(caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view inquiries");
    };
    switch (inquiries.get(id)) {
      case (null) { Runtime.trap("Inquiry not found") };
      case (?inquiry) { inquiry };
    };
  };

  public shared ({ caller }) func deleteInquiry(id : Text, legacyToken : ?Text) : async () {
    if (not (isLegacyAdmin(caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete inquiries");
    };
    let existed = inquiries.containsKey(id);
    inquiries.remove(id);
    if (not existed) {
      Runtime.trap("Inquiry not found");
    };
  };

  public query ({ caller }) func getAllInquiriesSortedByDestination() : async [Inquiry] {
    if (not (isLegacyAdmin(caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view inquiries");
    };
    inquiries.values().toArray().sort();
  };

  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    if (not (isLegacyAdmin(caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view inquiries");
    };
    inquiries.values().toArray();
  };

  public query ({ caller }) func getInquiriesByDestination(destination : Text) : async [Inquiry] {
    if (not (isLegacyAdmin(caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view inquiries");
    };
    let filtered = inquiries.values().filter(
      func(inquiry) { inquiry.destination == destination }
    );
    filtered.toArray();
  };

  // ── Community users ───────────────────────────────────────────────────────

  public type CommunityUser = {
    userId : Nat;
    username : Text;
    passwordHash : Text;
    displayName : Text;
    bio : Text;
    joinedAt : Int;
    isGoogleUser : Bool;
  };

  let communityUsers = Map.empty<Nat, CommunityUser>();
  var nextUserId = 0;

  public type RegistrationResponse = {
    ok : Bool;
    message : Text;
  };

  public type LoginResponse = {
    ok : Bool;
    userId : Nat;
    displayName : Text;
    message : Text;
  };

  public type UserProfilePublic = {
    userId : Nat;
    displayName : Text;
    bio : Text;
    joinedAt : Int;
  };

  public shared ({ caller }) func registerUser(
    username : Text,
    password : Text,
    displayName : Text,
    isGoogleUser : Bool,
  ) : async RegistrationResponse {
    let lowerUsername = username.toLower();

    for ((_, user) in communityUsers.entries()) {
      if (user.username.toLower() == lowerUsername) {
        return {
          ok = false;
          message = "Username already exists. ";
        };
      };
    };

    if (not isGoogleUser and password.size() == 0) {
      return {
        ok = false;
        message = "Password cannot be empty for non-Google accounts. ";
      };
    };

    let newUser : CommunityUser = {
      userId = nextUserId;
      username = lowerUsername;
      passwordHash = if (isGoogleUser) { "GOOGLE_AUTH" } else { password };
      displayName;
      bio = "";
      joinedAt = Time.now();
      isGoogleUser;
    };

    communityUsers.add(nextUserId, newUser);
    nextUserId += 1;

    {
      ok = true;
      message = "Registration successful. ";
    };
  };

  public shared ({ caller }) func loginUser(
    username : Text,
    password : Text,
  ) : async LoginResponse {
    let lowerUsername = username.toLower();

    for ((_, user) in communityUsers.entries()) {
      if (user.username.toLower() == lowerUsername) {
        if (user.isGoogleUser or user.passwordHash == password) {
          return {
            ok = true;
            userId = user.userId;
            displayName = user.displayName;
            message = "Login successful. ";
          };
        };
      };
    };

    {
      ok = false;
      userId = 0;
      displayName = "";
      message = "Invalid username or password. ";
    };
  };

  public query ({ caller }) func getUserProfile(userId : Nat) : async ?UserProfilePublic {
    switch (communityUsers.get(userId)) {
      case (null) { null };
      case (?user) {
        ?{
          userId = user.userId;
          displayName = user.displayName;
          bio = user.bio;
          joinedAt = user.joinedAt;
        };
      };
    };
  };

  public shared ({ caller }) func updateUserProfile(
    userId : Nat,
    displayName : Text,
    bio : Text,
    password : Text,
  ) : async () {
    switch (communityUsers.get(userId)) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?user) {
        let isAdminCaller = isLegacyAdmin(caller) or AccessControl.isAdmin(accessControlState, caller);
        if (not isAdminCaller and user.passwordHash != password) {
          Runtime.trap("Unauthorized: Only the account owner or an admin can update this profile");
        };
        let updatedUser : CommunityUser = { user with displayName; bio };
        communityUsers.add(userId, updatedUser);
      };
    };
  };

  public shared ({ caller }) func changeUserPassword(
    userId : Nat,
    oldPassword : Text,
    newPassword : Text,
  ) : async Bool {
    switch (communityUsers.get(userId)) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?user) {
        let isAdminCaller = isLegacyAdmin(caller) or AccessControl.isAdmin(accessControlState, caller);
        if (not isAdminCaller and user.passwordHash != oldPassword) {
          return false;
        };
        let updatedUser : CommunityUser = {
          user with
          passwordHash = newPassword;
        };
        communityUsers.add(userId, updatedUser);
      };
    };
    true;
  };

  // ── Community posts ───────────────────────────────────────────────────────

  public type CommunityPost = {
    postId : Nat;
    authorId : Nat;
    authorDisplayName : Text;
    title : Text;
    body : Text;
    imageUrl : Text;
    destination : Text;
    createdAt : Int;
    likes : Nat;
  };

  let communityPosts = Map.empty<Nat, CommunityPost>();
  var nextPostId = 0;

  public type PostRecord = {
    postId : Nat;
    authorId : Nat;
    authorDisplayName : Text;
    title : Text;
    body : Text;
    imageUrl : Text;
    destination : Text;
    createdAt : Int;
    likes : Nat;
  };

  public type PostResponse = {
    ok : Bool;
    postId : Nat;
  };

  public shared ({ caller }) func createPost(
    authorId : Nat,
    password : Text,
    title : Text,
    body : Text,
    imageUrl : Text,
    destination : Text,
  ) : async PostResponse {
    switch (communityUsers.get(authorId)) {
      case (null) {
        return {
          ok = false;
          postId = 0;
        };
      };
      case (?authorUser) {
        let isAdminCaller = isLegacyAdmin(caller) or AccessControl.isAdmin(accessControlState, caller);
        if (not isAdminCaller and authorUser.passwordHash != password) {
          Runtime.trap("Unauthorized: Invalid credentials for the specified author account");
        };

        let newPost : CommunityPost = {
          postId = nextPostId;
          authorId;
          authorDisplayName = authorUser.displayName;
          title;
          body;
          imageUrl;
          destination;
          createdAt = Time.now();
          likes = 0;
        };

        communityPosts.add(nextPostId, newPost);
        let currentPostId = nextPostId;
        nextPostId += 1;

        {
          ok = true;
          postId = currentPostId;
        };
      };
    };
  };

  module CommunityPostModule {
    public func compareByCreatedAt(post1 : CommunityPost, post2 : CommunityPost) : Order.Order {
      Int.compare(post2.createdAt, post1.createdAt);
    };
  };

  public query ({ caller }) func getAllPosts() : async [PostRecord] {
    let postsArray = communityPosts.values().toArray();
    let sortedPosts = postsArray.sort(CommunityPostModule.compareByCreatedAt);
    sortedPosts;
  };

  public query ({ caller }) func getPostsByUser(userId : Nat) : async [PostRecord] {
    let filteredPosts = communityPosts.values().filter(
      func(post) { post.authorId == userId }
    );
    filteredPosts.toArray();
  };

  public shared ({ caller }) func deletePost(
    postId : Nat,
    requesterId : Nat,
    password : Text,
  ) : async { ok : Bool; message : Text } {
    switch (communityPosts.get(postId)) {
      case (null) {
        Runtime.trap("Post not found");
      };
      case (?post) {
        let isAdminCaller = isLegacyAdmin(caller) or AccessControl.isAdmin(accessControlState, caller);
        if (not isAdminCaller) {
          if (post.authorId != requesterId) {
            Runtime.trap("Unauthorized: Only the post author or an admin can delete this post");
          };
          switch (communityUsers.get(requesterId)) {
            case (null) {
              Runtime.trap("Unauthorized: Requester user not found");
            };
            case (?user) {
              if (user.passwordHash != password) {
                Runtime.trap("Unauthorized: Invalid credentials");
              };
            };
          };
        };
        communityPosts.remove(postId);
        { ok = true; message = "Post deleted successfully" };
      };
    };
  };

  public shared ({ caller }) func likePost(postId : Nat) : async { ok : Bool; likes : Nat } {
    switch (communityPosts.get(postId)) {
      case (null) {
        Runtime.trap("Post not found");
      };
      case (?post) {
        let updatedPost : CommunityPost = {
          post with
          likes = post.likes + 1;
        };
        communityPosts.add(postId, updatedPost);
        { ok = true; likes = updatedPost.likes };
      };
    };
  };

  // ── Admin-only stats and user listing ────────────────────────────────────

  public query ({ caller }) func getCommunityStats() : async {
    totalMembers : Nat;
    totalPosts : Nat;
  } {
    if (not (isLegacyAdmin(caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view community stats");
    };
    {
      totalMembers = communityUsers.size();
      totalPosts = communityPosts.size();
    };
  };

  public query ({ caller }) func getAllCommunityUsers() : async [{
    userId : Nat;
    username : Text;
    displayName : Text;
    joinedAt : Int;
  }] {
    if (not (isLegacyAdmin(caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all community users");
    };
    let result = communityUsers.toArray().map(
      func((id, user)) {
        {
          userId = id;
          username = user.username;
          displayName = user.displayName;
          joinedAt = user.joinedAt;
        };
      }
    );
    result;
  };

  // ── Legacy Admin Session ─────────────────────────────────────────────────

  public type AdminProfile = {
    username : Text;
    principal : Text;
  };
  public type SessionToken = Text;

  public type SessionResponse = {
    ok : Bool;
    token : SessionToken;
    message : Text;
  };

  // registerAdmin can only be called when no admin has been registered yet (first-call-wins).
  // Once an admin principal is stored, only that admin can re-register (to update credentials).
  public shared ({ caller }) func registerAdmin(username : Text, password : Text) : async AdminProfile {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous callers cannot register as admin");
    };
    switch (adminPrincipal) {
      case (null) {
        // No admin registered yet — first caller becomes admin
        adminUsername := username;
        adminPassword := password;
        adminPrincipal := ?caller;
      };
      case (?stored) {
        // Only the existing admin principal or an AccessControl admin may update credentials
        if (stored != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Admin already registered; only the existing admin can update credentials");
        };
        adminUsername := username;
        adminPassword := password;
        adminPrincipal := ?caller;
      };
    };
    { username; principal = caller.toText() };
  };

  public shared ({ caller }) func loginAdmin(username : Text, password : Text) : async SessionResponse {
    if (
      adminUsername != username or
      adminPassword != password
    ) {
      return {
        ok = false;
        token = "";
        message = "Invalid admin credentials";
      };
    };
    {
      ok = true;
      token = "session_token_123";
      message = "Legacy admin login successful";
    };
  };

  public query ({ caller }) func isAdminSession(token : SessionToken) : async Bool {
    token == "session_token_123";
  };

  // ── Legacy Admin Helpers ─────────────────────────────────────────────────

  func isLegacyAdmin(caller : Principal) : Bool {
    if (caller.isAnonymous()) { return false };
    switch (adminPrincipal) {
      case (null) { false };
      case (?stored) { stored == caller };
    };
  };
};

import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Inquiry Data Structure
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view inquiries");
    };
    switch (inquiries.get(id)) {
      case (null) { Runtime.trap("Inquiry not found") };
      case (?inquiry) { inquiry };
    };
  };

  public shared ({ caller }) func deleteInquiry(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete inquiries");
    };
    let existed = inquiries.containsKey(id);
    inquiries.remove(id);
    if (not existed) {
      Runtime.trap("Inquiry not found. ");
    };
  };

  public query ({ caller }) func getAllInquiriesSortedByDestination() : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view inquiries");
    };
    inquiries.values().toArray().sort();
  };

  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view inquiries");
    };
    inquiries.values().toArray();
  };

  public query ({ caller }) func getInquiriesByDestination(destination : Text) : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view inquiries");
    };
    let filtered = inquiries.values().filter(
      func(inquiry) { inquiry.destination == destination }
    );
    filtered.toArray();
  };

  // Community User Data Structure
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

    // Check for duplicate username
    for ((_, user) in communityUsers.entries()) {
      if (user.username.toLower() == lowerUsername) {
        return {
          ok = false;
          message = "Username already exists. ";
        };
      };
    };

    // Accept empty password only for Google users
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
        // For Google users, bypass password check
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
        // Allow if caller is admin OR if the supplied password matches (owner)
        let isAdminCaller = AccessControl.isAdmin(accessControlState, caller);
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
        let isAdminCaller = AccessControl.isAdmin(accessControlState, caller);
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

  // Community Post Data Structure
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
        // Verify the caller owns this account via password (or is an admin)
        let isAdminCaller = AccessControl.isAdmin(accessControlState, caller);
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
        let isAdminCaller = AccessControl.isAdmin(accessControlState, caller);
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

  public query ({ caller }) func getCommunityStats() : async {
    totalMembers : Nat;
    totalPosts : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
};

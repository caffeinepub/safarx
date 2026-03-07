import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  // Old, pre-migration versions (no shareCount field)
  type OldCommunityPost = {
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

  type OldPostRecord = {
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

  type OldActor = {
    communityPosts : Map.Map<Nat, OldCommunityPost>;
  };

  // New, post-migration versions (includes shareCount field)
  type NewCommunityPost = {
    postId : Nat;
    authorId : Nat;
    authorDisplayName : Text;
    title : Text;
    body : Text;
    imageUrl : Text;
    destination : Text;
    createdAt : Int;
    likes : Nat;
    shareCount : Nat;
  };

  type NewPostRecord = {
    postId : Nat;
    authorId : Nat;
    authorDisplayName : Text;
    title : Text;
    body : Text;
    imageUrl : Text;
    destination : Text;
    createdAt : Int;
    likes : Nat;
    shareCount : Nat;
  };

  type NewActor = {
    communityPosts : Map.Map<Nat, NewCommunityPost>;
  };

  // Migration function for community posts (adds shareCount field)
  public func run(old : OldActor) : NewActor {
    let newCommunityPosts = old.communityPosts.map<Nat, OldCommunityPost, NewCommunityPost>(
      func(_id, oldPost) {
        { oldPost with shareCount = 0 }; // Default old data to 0 shares
      }
    );
    { communityPosts = newCommunityPosts };
  };
};
